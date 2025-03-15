
import { bytesToHex } from '@noble/hashes/utils';
import { keccak_256 } from '@noble/hashes/sha3';
import { uncompressPublicKey } from './publicKeyUtils';

// Generate Ethereum address from public key
export const getEthereumAddressFromPublicKey = (publicKey: Uint8Array): string => {
  try {
    // Ensure we have a valid public key
    if (publicKey.length !== 33 && publicKey.length !== 65 && publicKey.length !== 64) {
      console.error(`Invalid public key length: ${publicKey.length}`);
      throw new Error(`Invalid public key length: ${publicKey.length}`);
    }
    
    // Process public key to prepare for Ethereum address generation
    let pubKeyBytes: Uint8Array;
    
    if (publicKey.length === 33) {
      // Compressed key - uncompress it first
      const uncompressedKey = uncompressPublicKey(publicKey);
      // For Ethereum: Remove 0x04 prefix if present
      pubKeyBytes = uncompressedKey.length === 65 ? uncompressedKey.slice(1) : uncompressedKey;
    } else if (publicKey.length === 65) {
      // Uncompressed key with 0x04 prefix - remove the prefix
      pubKeyBytes = publicKey.slice(1);
    } else {
      // Already in the right format (64 bytes, uncompressed without prefix)
      pubKeyBytes = publicKey;
    }
    
    // Verify we have 64 bytes for hashing
    if (pubKeyBytes.length !== 64) {
      console.error(`Unexpected public key byte length: ${pubKeyBytes.length}`);
      throw new Error(`Unexpected public key byte length: ${pubKeyBytes.length}`);
    }
    
    // Apply Keccak-256 hash to the 64-byte public key
    const hash = keccak_256(pubKeyBytes);
    
    // Take the last 20 bytes of the Keccak hash
    const addressBytes = hash.slice(-20);
    
    // Format as hex with 0x prefix
    return '0x' + bytesToHex(addressBytes);
  } catch (error) {
    console.error('Error generating Ethereum address:', error);
    throw error; // Re-throw to be caught by the parent function
  }
};
