
import { getChainById } from '@/lib/api';

// Helper function to ensure addresses are properly formatted as hex strings
export const ensureHexString = (address: string): `0x${string}` => {
  if (!address.startsWith('0x')) {
    return `0x${address}` as `0x${string}`;
  }
  return address as `0x${string}`;
};

// Helper function to truncate an address for display
export const truncateAddress = (addr: string) => {
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

// Helper function to format token amounts with proper decimals
export const formatTokenAmount = (amount: bigint, decimals: number): string => {
  if (amount === 0n) return '0';
  
  // Convert to string and pad with zeros if needed
  let amountStr = amount.toString();
  while (amountStr.length <= decimals) {
    amountStr = '0' + amountStr;
  }
  
  // Insert decimal point
  const decimalPointIndex = amountStr.length - decimals;
  const formattedAmount = 
    amountStr.substring(0, decimalPointIndex) + 
    '.' + 
    amountStr.substring(decimalPointIndex);
  
  // Remove trailing zeros after decimal point
  return formattedAmount.replace(/\.?0+$/, '');
};

// Helper function to get a list of common tokens for the current chain
export const getTokensForChain = (chainId: number): string[] => {
  // These are just examples - in a real app you would have a more comprehensive list
  // or fetch them from an API
  switch (chainId) {
    case 1: // Ethereum
      return [
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
        '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
        '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
      ];
    case 137: // Polygon
      return [
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', // DAI
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', // WETH
      ];
    case 56: // BSC
      return [
        '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // USDC
        '0x55d398326f99059fF775485246999027B3197955', // USDT
        '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', // DAI
        '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB
      ];
    default:
      // Return some common stablecoins as fallback
      return [
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
      ];
  }
};

// Create a formatted chain object suitable for viem
export const formatChainForViem = (chainId: number) => {
  const chain = getChainById(chainId);
  if (!chain) throw new Error(`Chain with ID ${chainId} not supported`);

  return {
    id: chain.id,
    name: chain.name,
    nativeCurrency: {
      name: chain.symbol,
      symbol: chain.symbol,
      decimals: 18
    },
    rpcUrls: {
      default: {
        http: [chain.rpcUrl],
      },
    },
  };
};
