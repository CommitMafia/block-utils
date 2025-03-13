
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { hmac } from '@noble/hashes/hmac';
import { sha512 } from '@noble/hashes/sha512';
import { hexToBytes } from '@noble/hashes/utils';

// Custom HMAC function for BIP32
export const customHmac = (key: Uint8Array, ...messages: Uint8Array[]): Uint8Array => {
  const message = new Uint8Array(messages.reduce((acc, m) => acc + m.length, 0));
  let offset = 0;
  for (const m of messages) {
    message.set(m, offset);
    offset += m.length;
  }
  return hmac(sha512, key, message);
};

// Convert entropy bytes to mnemonic based on word count
export const entropyBytesForWordCount = (count: number): number => {
  switch (count) {
    case 12: return 16; // 128 bits
    case 15: return 20; // 160 bits
    case 18: return 24; // 192 bits
    case 21: return 28; // 224 bits
    case 24: return 32; // 256 bits
    default: return 16; // Default to 128 bits (12 words)
  }
};

// Validate a mnemonic phrase
export const validateMnemonic = (phrase: string): boolean => {
  return bip39.validateMnemonic(phrase.trim(), wordlist);
};

// Generate a random mnemonic
export const generateRandomMnemonic = (wordCount: number): string => {
  try {
    const strengthBytes = entropyBytesForWordCount(wordCount);
    const randomBytes = new Uint8Array(strengthBytes);
    crypto.getRandomValues(randomBytes);
    return bip39.entropyToMnemonic(randomBytes, wordlist);
  } catch (error) {
    console.error('Error generating mnemonic:', error);
    return '';
  }
};

// Process entropy based on type and convert to mnemonic
export const entropyToMnemonic = (entropy: string, entropyType: string): string => {
  try {
    if (!entropy) return '';
    
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
    return bip39.entropyToMnemonic(entropyBytes, wordlist);
  } catch (error) {
    console.error('Error converting entropy:', error);
    return '';
  }
};

// Get the seed from a mnemonic
export const mnemonicToSeed = (mnemonic: string, passphrase: string = ''): Uint8Array => {
  return bip39.mnemonicToSeedSync(mnemonic, passphrase);
};
