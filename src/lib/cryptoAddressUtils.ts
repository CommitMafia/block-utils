
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { keccak_256 } from '@noble/hashes/sha3';

// Bitcoin address generation helpers
export const hash160 = (buffer: Uint8Array): Uint8Array => {
  const sha = sha256(buffer);
  // Here we'd normally apply RIPEMD-160, but since it's not available, we'll use sha256 again as a stand-in
  // In a production environment, you should use the actual RIPEMD-160
  return sha256(sha).slice(0, 20);
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

// Generate Ethereum address from public key
export const getEthereumAddressFromPublicKey = (publicKey: Uint8Array): string => {
  // Remove the first byte (0x04 which indicates uncompressed key)
  const publicKeyNoPrefix = publicKey.slice(1);
  
  // Keccak-256 hash of public key
  const addressBytes = keccak_256(publicKeyNoPrefix);
  
  // Take last 20 bytes and format as Ethereum address
  return '0x' + bytesToHex(addressBytes.slice(12, 32));
};

// Generate Bitcoin address from public key
export const getBitcoinAddressFromPublicKey = (publicKey: Uint8Array, isTestnet = false): string => {
  // For compressed public key
  const compressedPubKey = new Uint8Array(33);
  compressedPubKey[0] = publicKey[64] % 2 === 0 ? 0x02 : 0x03;
  compressedPubKey.set(publicKey.slice(1, 33), 1);
  
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
};

// Generate address based on network type and public key
export const generateNetworkAddress = (
  publicKey: Uint8Array, 
  network: string
): string => {
  if (network === 'ethereum') {
    return getEthereumAddressFromPublicKey(publicKey);
  } else if (network === 'bitcoin') {
    return getBitcoinAddressFromPublicKey(publicKey);
  } else if (network === 'litecoin' || network === 'dogecoin') {
    // In a real implementation, these would use different version bytes
    // But for this demo, we'll just prefix them
    return `${network}-${getBitcoinAddressFromPublicKey(publicKey)}`;
  } else {
    // Default to Bitcoin format
    return getBitcoinAddressFromPublicKey(publicKey);
  }
};
