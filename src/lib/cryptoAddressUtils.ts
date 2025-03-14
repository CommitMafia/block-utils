
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { keccak_256 } from '@noble/hashes/sha3';
import { ripemd160 } from '@noble/hashes/ripemd160';
import * as secp from '@noble/secp256k1';

// Bitcoin address generation helpers
export const hash160 = (buffer: Uint8Array): Uint8Array => {
  const sha = sha256(buffer);
  return ripemd160(sha);
};

// Base58 encoding for Bitcoin addresses
export const base58Encode = (data: Uint8Array): string => {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  let num = BigInt(0);
  
  for (let i = 0; i < data.length; i++) {
    num = num * BigInt(256) + BigInt(data[i]);
  }
  
  while (num > BigInt(0)) {
    const mod = Number(num % BigInt(58));
    num = num / BigInt(58);
    result = ALPHABET[mod] + result;
  }
  
  // Leading zeros in the input should be preserved as leading '1's
  for (let i = 0; i < data.length; i++) {
    if (data[i] === 0) {
      result = '1' + result;
    } else {
      break;
    }
  }
  
  return result;
};

// Uncompress a compressed public key - crucial for Ethereum addresses
export const uncompressPublicKey = (publicKey: Uint8Array): Uint8Array => {
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
      const point = secp.Point.fromHex(publicKey);
      const uncompressedHex = point.toHex(false); // false means uncompressed format
      
      // Convert hex to bytes
      return hexToBytes(uncompressedHex);
    } catch (error) {
      console.error('Error uncompressing public key:', error);
      throw new Error('Failed to uncompress public key');
    }
  }
  
  throw new Error(`Invalid public key length: ${publicKey.length}`);
};

// Generate Ethereum address from public key
export const getEthereumAddressFromPublicKey = (publicKey: Uint8Array): string => {
  try {
    // For Ethereum, we need the uncompressed public key without the prefix
    let pubKeyForHashing: Uint8Array;
    
    // First ensure we have an uncompressed key
    let uncompressedKey: Uint8Array;
    
    try {
      if (publicKey.length === 33) {
        // If compressed, uncompress it
        uncompressedKey = uncompressPublicKey(publicKey);
      } else if (publicKey.length === 65) {
        // Already uncompressed
        uncompressedKey = publicKey;
      } else if (publicKey.length === 64) {
        // Already uncompressed without prefix
        const tempKey = new Uint8Array(65);
        tempKey[0] = 0x04;
        tempKey.set(publicKey, 1);
        uncompressedKey = tempKey;
      } else {
        throw new Error(`Unexpected public key length: ${publicKey.length}`);
      }
      
      // Remove the prefix byte (0x04) for Ethereum address calculation
      pubKeyForHashing = uncompressedKey.length === 65 ? uncompressedKey.slice(1) : uncompressedKey;
      
      // Apply Keccak-256 hash to the public key
      const hash = keccak_256(pubKeyForHashing);
      
      // Take the last 20 bytes of the hash
      const addressBytes = hash.slice(-20);
      
      // Format as hex with 0x prefix
      return '0x' + bytesToHex(addressBytes);
    } catch (error) {
      console.error('Error processing public key:', error);
      return 'Invalid-ETH-Address';
    }
  } catch (error) {
    console.error('Error generating Ethereum address:', error);
    return 'Invalid-ETH-Address';
  }
};

// Convert public key to compressed format for Bitcoin-like networks
export const compressPublicKey = (publicKey: Uint8Array): Uint8Array => {
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
  
  // Handle case when key might be in different format
  throw new Error(`Invalid public key length: ${publicKey.length}`);
};

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

// Generate address based on network type and public key
export const generateNetworkAddress = (
  publicKey: Uint8Array, 
  network: string
): string => {
  try {
    switch (network.toLowerCase()) {
      case 'ethereum':
        return getEthereumAddressFromPublicKey(publicKey);
      case 'bitcoin':
        return getBitcoinAddressFromPublicKey(publicKey);
      case 'litecoin':
        return getLitecoinAddressFromPublicKey(publicKey);
      case 'dogecoin':
        return getDogecoinAddressFromPublicKey(publicKey);
      case 'bip44':
      default:
        // Default to Bitcoin format
        return getBitcoinAddressFromPublicKey(publicKey);
    }
  } catch (error) {
    console.error(`Error generating ${network} address:`, error);
    return `Invalid-${network}-Address`;
  }
};
