
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { hash160, base58Encode } from './cryptoBaseUtils';
import { compressPublicKey } from './publicKeyUtils';

// Generate Bitcoin address from public key
export const getBitcoinAddressFromPublicKey = (publicKey: Uint8Array, isTestnet = false): string => {
  try {
    // For compressed public key
    const compressedPubKey = compressPublicKey(publicKey);
    
    // Apply HASH160 (SHA256 + RIPEMD160)
    const hash = hash160(compressedPubKey);
    
    // Add version byte (0x00 for mainnet, 0x6f for testnet)
    const versionedHash = new Uint8Array(21);
    versionedHash[0] = isTestnet ? 0x6f : 0x00;
    versionedHash.set(hash, 1);
    
    // Add checksum (first 4 bytes of double SHA256)
    const checksum = sha256(sha256(versionedHash)).slice(0, 4);
    
    // Combine versioned hash and checksum
    const addressBytes = new Uint8Array(25);
    addressBytes.set(versionedHash);
    addressBytes.set(checksum, 21);
    
    // Base58 encode
    return base58Encode(addressBytes);
  } catch (error) {
    console.error('Error generating Bitcoin address:', error);
    return 'Invalid-BTC-Address';
  }
};

// Convert private key to WIF format
export const privateKeyToWIF = (privateKey: Uint8Array | string, compressed = true, isTestnet = false): string => {
  try {
    // Convert hex string to Uint8Array if needed
    const privateKeyBytes = typeof privateKey === 'string' ? 
      hexToBytes(privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey) : 
      privateKey;
    
    // Create a new buffer with version byte (0x80 for mainnet, 0xef for testnet)
    const extendedKeyBytes = new Uint8Array(compressed ? 34 : 33);
    extendedKeyBytes[0] = isTestnet ? 0xef : 0x80;  // Version byte
    extendedKeyBytes.set(privateKeyBytes, 1);
    
    // Add compression flag if needed
    if (compressed) {
      extendedKeyBytes[33] = 0x01;  // Compression flag
    }
    
    // Calculate checksum (first 4 bytes of double SHA256)
    const checksum = sha256(sha256(extendedKeyBytes)).slice(0, 4);
    
    // Combine extended key and checksum
    const wifBytes = new Uint8Array(compressed ? 38 : 37);
    wifBytes.set(extendedKeyBytes);
    wifBytes.set(checksum, compressed ? 34 : 33);
    
    // Base58 encode
    return base58Encode(wifBytes);
  } catch (error) {
    console.error('Error converting to WIF format:', error);
    return 'Invalid-WIF';
  }
};
