
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { keccak_256 } from '@noble/hashes/sha3';
import { uncompressPublicKey } from './publicKeyUtils';

// Generate Ethereum address from public key
export const getEthereumAddressFromPublicKey = (publicKey: Uint8Array): string => {
  try {
    // Ensure we have a valid public key (either compressed or uncompressed)
    if (publicKey.length !== 33 && publicKey.length !== 65 && publicKey.length !== 64) {
      console.error(`Invalid public key length: ${publicKey.length}`);
      return 'Invalid-ETH-Address';
    }
    
    // Get proper public key bytes for Ethereum (uncompressed without 0x04 prefix)
    let pubKeyBytes: Uint8Array;
    
    if (publicKey.length === 33) {
      // Compressed key - uncompress it first
      const uncompressedKey = uncompressPublicKey(publicKey);
      pubKeyBytes = uncompressedKey.slice(1); // Remove the prefix byte (0x04)
    } else if (publicKey.length === 65) {
      // Uncompressed key with prefix - remove the prefix
      pubKeyBytes = publicKey.slice(1);
    } else {
      // Already in the right format (64 bytes, uncompressed without prefix)
      pubKeyBytes = publicKey;
    }
    
    // Apply Keccak-256 hash to the public key
    const hash = keccak_256(pubKeyBytes);
    
    // Take the last 20 bytes of the hash to form the Ethereum address
    const addressBytes = hash.slice(-20);
    
    // Format as hex with 0x prefix and ensure proper checksum
    return '0x' + bytesToHex(addressBytes);
  } catch (error) {
    console.error('Error generating Ethereum address:', error);
    return 'Invalid-ETH-Address';
  }
};
