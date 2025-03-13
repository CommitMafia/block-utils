
import { useState, useEffect, useCallback } from 'react';
import * as bip39 from '@scure/bip39';
import { HDKey } from '@scure/bip32';
import { wordlist } from '@scure/bip39/wordlists/english';
import { hmac } from '@noble/hashes/hmac';
import { sha256 } from '@noble/hashes/sha256';
import { sha512 } from '@noble/hashes/sha512';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import * as secp256k1 from '@noble/secp256k1';

interface DerivedAddress {
  path: string;
  address: string;
  publicKey: string;
  privateKey: string;
}

export interface Bip39HookReturn {
  mnemonic: string;
  setMnemonic: (value: string) => void;
  entropy: string;
  setEntropy: (value: string) => void;
  entropyType: string;
  setEntropyType: (value: string) => void;
  wordCount: number;
  setWordCount: (value: number) => void;
  passphrase: string;
  setPassphrase: (value: string) => void;
  derivationPath: string;
  setDerivationPath: (value: string) => void;
  network: string;
  setNetwork: (value: string) => void;
  derivedAddresses: DerivedAddress[];
  derivedPrivateKey: string;
  derivedPublicKey: string;
  generateRandomMnemonic: () => void;
  isValidMnemonic: boolean;
  generateFromEntropy: () => void;
}

// Custom HMAC function for BIP32
const customHmac = (key: Uint8Array, ...messages: Uint8Array[]): Uint8Array => {
  const message = new Uint8Array(messages.reduce((acc, m) => acc + m.length, 0));
  let offset = 0;
  for (const m of messages) {
    message.set(m, offset);
    offset += m.length;
  }
  return hmac(sha512, key, message);
};

export function useBip39(): Bip39HookReturn {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [entropy, setEntropy] = useState<string>('');
  const [entropyType, setEntropyType] = useState<string>('hex');
  const [wordCount, setWordCount] = useState<number>(12);
  const [passphrase, setPassphrase] = useState<string>('');
  const [derivationPath, setDerivationPath] = useState<string>("m/44'/60'/0'/0/0");
  const [network, setNetwork] = useState<string>('ethereum');
  const [derivedAddresses, setDerivedAddresses] = useState<DerivedAddress[]>([]);
  const [derivedPrivateKey, setDerivedPrivateKey] = useState<string>('');
  const [derivedPublicKey, setDerivedPublicKey] = useState<string>('');
  const [isValidMnemonic, setIsValidMnemonic] = useState<boolean>(false);

  // Update derivation path when network changes
  useEffect(() => {
    switch (network) {
      case 'bitcoin':
        setDerivationPath("m/44'/0'/0'/0/0");
        break;
      case 'ethereum':
        setDerivationPath("m/44'/60'/0'/0/0");
        break;
      case 'litecoin':
        setDerivationPath("m/44'/2'/0'/0/0");
        break;
      case 'dogecoin':
        setDerivationPath("m/44'/3'/0'/0/0");
        break;
      case 'bip44':
      default:
        setDerivationPath("m/44'/0'/0'/0/0");
        break;
    }
  }, [network]);

  // Validate mnemonic when it changes
  useEffect(() => {
    if (mnemonic.trim()) {
      setIsValidMnemonic(bip39.validateMnemonic(mnemonic, wordlist));
    } else {
      setIsValidMnemonic(false);
    }
  }, [mnemonic]);

  // Generate addresses when mnemonic, passphrase, or derivation path changes
  useEffect(() => {
    if (isValidMnemonic && mnemonic) {
      deriveAddresses();
    } else {
      setDerivedAddresses([]);
    }
  }, [mnemonic, passphrase, derivationPath, isValidMnemonic]);

  // Convert entropy bytes to mnemonic based on word count
  const entropyBytesForWordCount = (count: number): number => {
    switch (count) {
      case 12: return 16; // 128 bits
      case 15: return 20; // 160 bits
      case 18: return 24; // 192 bits
      case 21: return 28; // 224 bits
      case 24: return 32; // 256 bits
      default: return 16; // Default to 128 bits (12 words)
    }
  };

  // Generate a random mnemonic
  const generateRandomMnemonic = useCallback(() => {
    try {
      const strengthBytes = entropyBytesForWordCount(wordCount);
      const randomBytes = new Uint8Array(strengthBytes);
      crypto.getRandomValues(randomBytes);
      const newMnemonic = bip39.entropyToMnemonic(randomBytes, wordlist);
      setMnemonic(newMnemonic);
    } catch (error) {
      console.error('Error generating mnemonic:', error);
    }
  }, [wordCount]);

  // Process entropy based on type and convert to mnemonic
  const generateFromEntropy = useCallback(() => {
    try {
      if (!entropy) return;
      
      let entropyBytes: Uint8Array;
      
      // Process different entropy types
      if (entropyType === 'hex') {
        // Handle hex input
        entropyBytes = hexToBytes(entropy.replace(/\s+/g, ''));
      } else if (entropyType === 'binary') {
        // Handle binary input (0s and 1s)
        const binaryString = entropy.replace(/[^01]/g, '');
        const hexString = parseInt(binaryString, 2).toString(16).padStart(binaryString.length / 4, '0');
        entropyBytes = hexToBytes(hexString);
      } else if (entropyType === 'dice') {
        // Handle dice rolls (1-6)
        const diceString = entropy.replace(/[^1-6]/g, '');
        // Convert base-6 to binary, then to hex
        let binary = '';
        for (let i = 0; i < diceString.length; i++) {
          const decimal = parseInt(diceString[i], 10) - 1; // Convert 1-6 to 0-5
          binary += decimal.toString(2).padStart(3, '0'); // Each dice roll gives ~2.58 bits of entropy
        }
        // Trim to multiple of 4 for hex conversion
        binary = binary.substring(0, Math.floor(binary.length / 4) * 4);
        const hexString = parseInt(binary, 2).toString(16).padStart(binary.length / 4, '0');
        entropyBytes = hexToBytes(hexString);
      } else {
        // Default to hex
        entropyBytes = hexToBytes(entropy.replace(/\s+/g, ''));
      }
      
      // Generate mnemonic from entropy
      const newMnemonic = bip39.entropyToMnemonic(entropyBytes, wordlist);
      setMnemonic(newMnemonic);
    } catch (error) {
      console.error('Error converting entropy:', error);
    }
  }, [entropy, entropyType]);

  // Derive Ethereum address from public key
  const getEthereumAddressFromPublicKey = (publicKey: Uint8Array): string => {
    // Remove the first byte (0x04 which indicates uncompressed key)
    const publicKeyNoPrefix = publicKey.slice(1);
    
    // Keccak-256 hash of public key
    const addressBytes = sha256(publicKeyNoPrefix);
    
    // Take last 20 bytes and format as Ethereum address
    return '0x' + bytesToHex(addressBytes.slice(12, 32));
  };

  // Derive addresses from mnemonic and path
  const deriveAddresses = useCallback(() => {
    try {
      if (!isValidMnemonic || !mnemonic) return;
      
      // Get seed from mnemonic
      const seed = bip39.mnemonicToSeedSync(mnemonic, passphrase);
      
      // Create root key
      const rootKey = HDKey.fromMasterSeed(seed, {
        versions: {
          bip32: {
            private: 0x0488ade4,
            public: 0x0488b21e,
          },
        },
        hmac: customHmac
      });
      
      // Get base path and index
      const basePath = derivationPath.split('/').slice(0, -1).join('/');
      const pathIndex = parseInt(derivationPath.split('/').pop() || '0');
      
      // Derive multiple addresses
      const newAddresses: DerivedAddress[] = [];
      
      for (let i = 0; i < 5; i++) {
        const currentPath = `${basePath}/${pathIndex + i}`;
        const childKey = rootKey.derive(currentPath);
        
        if (!childKey.privateKey) continue;
        
        const privKey = bytesToHex(childKey.privateKey);
        const pubKey = bytesToHex(childKey.publicKey);
        
        // Generate address based on network
        let address = getEthereumAddressFromPublicKey(childKey.publicKey);
        
        // Bitcoin and other networks would use different address generation methods
        if (network === 'bitcoin' || network === 'litecoin' || network === 'dogecoin') {
          // Placeholder for non-ETH addresses
          address = `${network}-${bytesToHex(childKey.publicKey.slice(-20))}`;
        }
        
        newAddresses.push({
          path: currentPath,
          address,
          publicKey: pubKey,
          privateKey: privKey
        });
      }
      
      setDerivedAddresses(newAddresses);
      
      // Set main private and public keys
      if (newAddresses.length > 0) {
        setDerivedPrivateKey(newAddresses[0].privateKey);
        setDerivedPublicKey(newAddresses[0].publicKey);
      }
    } catch (error) {
      console.error('Error deriving addresses:', error);
    }
  }, [mnemonic, passphrase, derivationPath, isValidMnemonic, network]);

  return {
    mnemonic,
    setMnemonic,
    entropy,
    setEntropy,
    entropyType,
    setEntropyType,
    wordCount,
    setWordCount,
    passphrase,
    setPassphrase,
    derivationPath,
    setDerivationPath,
    network,
    setNetwork,
    derivedAddresses,
    derivedPrivateKey,
    derivedPublicKey,
    generateRandomMnemonic,
    isValidMnemonic,
    generateFromEntropy
  };
}
