
// Re-export all crypto utility functions
export * from './cryptoBaseUtils';
export * from './publicKeyUtils';
export * from './ethereumUtils';
export * from './bitcoinUtils';
export * from './altcoinUtils';

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
