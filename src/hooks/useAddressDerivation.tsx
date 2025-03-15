
import { useState, useCallback } from 'react';
import { HDKey } from '@scure/bip32';
import { bytesToHex } from '@noble/hashes/utils';
import { customHmac } from '@/lib/bip39Utils';
import { generateNetworkAddress } from '@/lib/crypto';
import { sha512 } from '@noble/hashes/sha512';

export interface DerivedAddress {
  path: string;
  address: string;
  publicKey: string;
  privateKey: string;
}

export interface AddressDerivationReturn {
  derivationPath: string;
  setDerivationPath: (value: string) => void;
  network: string;
  setNetwork: (value: string) => void;
  deriveAddresses: (seed: Uint8Array) => DerivedAddress[];
  derivedAddresses: DerivedAddress[];
  derivedPrivateKey: string;
  derivedPublicKey: string;
}

export function useAddressDerivation(): AddressDerivationReturn {
  const [derivationPath, setDerivationPath] = useState<string>("m/44'/60'/0'/0/0");
  const [network, setNetwork] = useState<string>('ethereum');
  const [derivedAddresses, setDerivedAddresses] = useState<DerivedAddress[]>([]);
  const [derivedPrivateKey, setDerivedPrivateKey] = useState<string>('');
  const [derivedPublicKey, setDerivedPublicKey] = useState<string>('');

  // Update derivation path when network changes
  const updatePathForNetwork = useCallback((newNetwork: string) => {
    setNetwork(newNetwork);
    switch (newNetwork) {
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
  }, []);

  // Derive addresses from seed and path
  const deriveAddresses = useCallback((seed: Uint8Array): DerivedAddress[] => {
    try {
      if (!seed || seed.length === 0) return [];
      
      // Create HDKey instance with seed
      const hdkey = HDKey.fromMasterSeed(seed);
      
      // Get base path and index
      const basePath = derivationPath.split('/').slice(0, -1).join('/');
      const pathIndex = parseInt(derivationPath.split('/').pop() || '0');
      
      // Derive multiple addresses
      const newAddresses: DerivedAddress[] = [];
      
      for (let i = 0; i < 5; i++) {
        const currentPath = `${basePath}/${pathIndex + i}`;
        const childKey = hdkey.derive(currentPath);
        
        if (!childKey.privateKey) continue;
        
        const privKey = bytesToHex(childKey.privateKey);
        const pubKey = bytesToHex(childKey.publicKey);
        
        // Generate address based on network
        const address = generateNetworkAddress(childKey.publicKey, network);
        
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
      
      return newAddresses;
    } catch (error) {
      console.error('Error deriving addresses:', error);
      return [];
    }
  }, [derivationPath, network]);

  return {
    derivationPath,
    setDerivationPath,
    network,
    setNetwork: updatePathForNetwork,
    deriveAddresses,
    derivedAddresses,
    derivedPrivateKey,
    derivedPublicKey
  };
}
