
import { Chain, TokenInfo, ABIFunction } from './types';

// List of supported chains
export const supportedChains: Chain[] = [
  {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorerUrl: 'https://etherscan.io'
  },
  {
    id: 56,
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    blockExplorerUrl: 'https://bscscan.com'
  },
  {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com/',
    blockExplorerUrl: 'https://polygonscan.com'
  },
  {
    id: 42161,
    name: 'Arbitrum',
    symbol: 'ARB',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorerUrl: 'https://arbiscan.io'
  },
  {
    id: 10,
    name: 'Optimism',
    symbol: 'OP',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorerUrl: 'https://optimistic.etherscan.io'
  },
  {
    id: 43114,
    name: 'Avalanche',
    symbol: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    blockExplorerUrl: 'https://snowtrace.io'
  }
];

// Helper to get chain by ID
export function getChainById(chainId: number): Chain | undefined {
  return supportedChains.find(chain => chain.id === chainId);
}

// Mock API service (in a real app, this would call your backend)
class TokenAPI {
  // Fetch token information
  async getTokenInfo(contractAddress: string, chainId: number): Promise<TokenInfo> {
    // In a real implementation, this would make an API call to your backend
    console.log(`Fetching token info for ${contractAddress} on chain ${chainId}`);
    
    // Return mock data for now
    return {
      name: "Example Token",
      symbol: "EXT",
      totalSupply: "1000000000",
      decimals: 18,
      price: "0.025",
      volume24h: "1240000",
      marketCap: "25000000",
      holders: 1500,
      liquidity: "500000"
    };
  }

  // Fetch token ABI
  async getTokenABI(contractAddress: string, chainId: number): Promise<ABIFunction[]> {
    // In a real implementation, this would make an API call to your backend
    console.log(`Fetching ABI for ${contractAddress} on chain ${chainId}`);
    
    // Return mock ABI for now
    return [
      {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address", internalType: "address" }],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }]
      },
      {
        name: "transfer",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { name: "recipient", type: "address", internalType: "address" },
          { name: "amount", type: "uint256", internalType: "uint256" }
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }]
      },
      {
        name: "allowance",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "owner", type: "address", internalType: "address" },
          { name: "spender", type: "address", internalType: "address" }
        ],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }]
      },
      {
        name: "approve",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { name: "spender", type: "address", internalType: "address" },
          { name: "amount", type: "uint256", internalType: "uint256" }
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }]
      }
    ];
  }
}

export const tokenAPI = new TokenAPI();
