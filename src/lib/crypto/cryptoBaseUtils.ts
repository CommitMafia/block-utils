
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { ripemd160 } from '@noble/hashes/ripemd160';

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
