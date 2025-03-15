
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { ProjectivePoint } from '@noble/secp256k1';

// Uncompress a compressed public key - crucial for Ethereum addresses
export const uncompressPublicKey = (publicKey: Uint8Array): Uint8Array => {
  try {
    // If already uncompressed (65 bytes), return as is
    if (publicKey.length === 65) return publicKey;
    
    // If already uncompressed without prefix (64 bytes), add the prefix
    if (publicKey.length === 64) {
      const uncompressedKey = new Uint8Array(65);
      uncompressedKey[0] = 0x04; // Uncompressed key prefix
      uncompressedKey.set(publicKey, 1);
      return uncompressedKey;
    }
    
    // If compressed (33 bytes), uncompress it
    if (publicKey.length === 33) {
      try {
        // Use the secp256k1 library to uncompress
        const point = ProjectivePoint.fromHex(publicKey);
        // Convert from point to uncompressed format (includes 0x04 prefix)
        const uncompressedHex = point.toHex(false); // false means uncompressed format
        
        return hexToBytes(uncompressedHex);
      } catch (error) {
        console.error('Error uncompressing public key:', error);
        throw new Error('Failed to uncompress public key');
      }
    }
    
    throw new Error(`Invalid public key length: ${publicKey.length}`);
  } catch (error) {
    console.error('Error in uncompressPublicKey:', error);
    throw error;
  }
};

// Convert public key to compressed format for Bitcoin-like networks
export const compressPublicKey = (publicKey: Uint8Array): Uint8Array => {
  try {
    // If already compressed (33 bytes), return as is
    if (publicKey.length === 33) return publicKey;
    
    // If standard uncompressed key (65 bytes)
    if (publicKey.length === 65) {
      const prefix = publicKey[64] % 2 === 0 ? 0x02 : 0x03;
      const compressedKey = new Uint8Array(33);
      compressedKey[0] = prefix;
      compressedKey.set(publicKey.slice(1, 33), 1);
      return compressedKey;
    }
    
    // If uncompressed without prefix (64 bytes), we need to determine parity
    if (publicKey.length === 64) {
      // Reconstruct point to determine parity
      const point = ProjectivePoint.fromAffine({
        x: BigInt('0x' + bytesToHex(publicKey.slice(0, 32))),
        y: BigInt('0x' + bytesToHex(publicKey.slice(32, 64)))
      });
      
      // Get compressed hex and convert to bytes
      const compressedHex = point.toHex(true); // true for compressed format
      return hexToBytes(compressedHex);
    }
    
    // Handle case when key might be in different format
    throw new Error(`Invalid public key length: ${publicKey.length}`);
  } catch (error) {
    console.error('Error in compressPublicKey:', error);
    throw error;
  }
};
