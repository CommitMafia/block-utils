
import { sha256 } from '@noble/hashes/sha256';
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
