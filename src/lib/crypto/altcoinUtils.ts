
import { sha256 } from '@noble/hashes/sha256';
import { hash160, base58Encode } from './cryptoBaseUtils';
import { compressPublicKey } from './publicKeyUtils';

// Litecoin address generation (similar to Bitcoin but with different version byte)
export const getLitecoinAddressFromPublicKey = (publicKey: Uint8Array, isTestnet = false): string => {
  try {
    const compressedPubKey = compressPublicKey(publicKey);
    const hash = hash160(compressedPubKey);
    
    // Litecoin version byte (0x30 for mainnet, 0x6f for testnet)
    const versionedHash = new Uint8Array(21);
    versionedHash[0] = isTestnet ? 0x6f : 0x30;
    versionedHash.set(hash, 1);
    
    const checksum = sha256(sha256(versionedHash)).slice(0, 4);
    const addressBytes = new Uint8Array(25);
    addressBytes.set(versionedHash);
    addressBytes.set(checksum, 21);
    
    // Base58 encode
    return base58Encode(addressBytes);
  } catch (error) {
    console.error('Error generating Litecoin address:', error);
    return 'Invalid-LTC-Address';
  }
};

// Dogecoin address generation
export const getDogecoinAddressFromPublicKey = (publicKey: Uint8Array, isTestnet = false): string => {
  try {
    const compressedPubKey = compressPublicKey(publicKey);
    const hash = hash160(compressedPubKey);
    
    // Dogecoin version byte (0x1E for mainnet, 0x71 for testnet)
    const versionedHash = new Uint8Array(21);
    versionedHash[0] = isTestnet ? 0x71 : 0x1E;
    versionedHash.set(hash, 1);
    
    const checksum = sha256(sha256(versionedHash)).slice(0, 4);
    const addressBytes = new Uint8Array(25);
    addressBytes.set(versionedHash);
    addressBytes.set(checksum, 21);
    
    // Base58 encode
    return base58Encode(addressBytes);
  } catch (error) {
    console.error('Error generating Dogecoin address:', error);
    return 'Invalid-DOGE-Address';
  }
};
