
import { Chain, TokenInfo, ABIFunction } from './types';

// List of supported chains
export const supportedChains: Chain[] = [
  {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorerUrl: 'https://etherscan.io',
    apiUrl: 'https://api.etherscan.io/api',
    apiKey: 'YourEtherscanAPIKey' // This is a placeholder - ideally should be using environment variables
  },
  {
    id: 56,
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    blockExplorerUrl: 'https://bscscan.com',
    apiUrl: 'https://api.bscscan.com/api',
    apiKey: 'YourBscscanAPIKey'
  },
  {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com/',
    blockExplorerUrl: 'https://polygonscan.com',
    apiUrl: 'https://api.polygonscan.com/api',
    apiKey: 'YourPolygonscanAPIKey'
  },
  {
    id: 42161,
    name: 'Arbitrum',
    symbol: 'ARB',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorerUrl: 'https://arbiscan.io',
    apiUrl: 'https://api.arbiscan.io/api',
    apiKey: 'YourArbiscanAPIKey'
  },
  {
    id: 10,
    name: 'Optimism',
    symbol: 'OP',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorerUrl: 'https://optimistic.etherscan.io',
    apiUrl: 'https://api-optimistic.etherscan.io/api',
    apiKey: 'YourOptimisticEtherscanAPIKey'
  },
  {
    id: 43114,
    name: 'Avalanche',
    symbol: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    blockExplorerUrl: 'https://snowtrace.io',
    apiUrl: 'https://api.snowtrace.io/api',
    apiKey: 'YourSnowtracehereAPIKey'
  }
];

// Helper to get chain by ID
export function getChainById(chainId: number): Chain | undefined {
  return supportedChains.find(chain => chain.id === chainId);
}

// Fetch ABI from blockchain explorer API (Etherscan, BSCScan, etc.)
async function fetchAbiFromExplorer(contractAddress: string, chain: Chain): Promise<string> {
  try {
    const url = `${chain.apiUrl}?module=contract&action=getabi&address=${contractAddress}&apikey=${chain.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === '1' && data.result) {
      return data.result;
    }
    
    throw new Error(data.result || 'Failed to fetch ABI');
  } catch (error) {
    console.error('Error fetching ABI from explorer:', error);
    throw error;
  }
}

// Parse ABI JSON into structured format
function parseAbi(abiJson: string): ABIFunction[] {
  try {
    const abi = JSON.parse(abiJson);
    return abi.filter((item: any) => 
      item.type === 'function' && 
      (item.stateMutability === 'view' || 
       item.stateMutability === 'pure' || 
       item.stateMutability === 'nonpayable' || 
       item.stateMutability === 'payable')
    );
  } catch (error) {
    console.error('Error parsing ABI:', error);
    return [];
  }
}

// Fetch token metadata using web3 calls
async function fetchTokenMetadata(contractAddress: string, chain: Chain): Promise<any> {
  try {
    // This would typically use ethers.js or web3.js to make RPC calls
    // For this example, we'll simulate the response
    const abiERC20 = [
      { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "type": "function" },
      { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "type": "function" },
      { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "type": "function" },
      { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" }
    ];
    
    // For demonstration, return mock data
    // In a real implementation, you would use ethers.js to call these methods
    return {
      name: "Sample Token",
      symbol: "STKN",
      decimals: 18,
      totalSupply: "1000000000000000000000000000" // 1 billion tokens
    };
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    throw error;
  }
}

// Fetch token price data from a market API
async function fetchTokenPrice(contractAddress: string, chain: Chain): Promise<any> {
  try {
    // This would typically call a price API like CoinGecko
    // For this example, we'll simulate the response
    return {
      price: 1.23,
      marketCap: 123000000,
      volume24h: 5600000
    };
  } catch (error) {
    console.error('Error fetching token price:', error);
    return {
      price: null,
      marketCap: null,
      volume24h: null
    };
  }
}

// Mock API service (in a real app, this would call your backend)
class TokenAPI {
  // Fetch token information
  async getTokenInfo(contractAddress: string, chainId: number): Promise<TokenInfo> {
    // Get the chain details
    const chain = getChainById(chainId);
    if (!chain) {
      throw new Error(`Chain with ID ${chainId} not supported`);
    }
    
    try {
      // Fetch token metadata and price in parallel
      const [metadata, priceData] = await Promise.all([
        fetchTokenMetadata(contractAddress, chain),
        fetchTokenPrice(contractAddress, chain)
      ]);
      
      // Combine the data
      return {
        name: metadata.name,
        symbol: metadata.symbol,
        totalSupply: metadata.totalSupply,
        decimals: metadata.decimals,
        price: priceData.price?.toString() || null,
        volume24h: priceData.volume24h?.toString() || null,
        marketCap: priceData.marketCap?.toString() || null,
        holders: 1500, // Mock data
        liquidity: "500000" // Mock data
      };
    } catch (error) {
      console.error('Error in getTokenInfo:', error);
      // Return fallback data on error
      return {
        name: "Unknown Token",
        symbol: "???",
        totalSupply: "0",
        decimals: 18,
        price: null,
        volume24h: null,
        marketCap: null,
        holders: null,
        liquidity: null
      };
    }
  }

  // Fetch token ABI using blockchain explorer API
  async getTokenABI(contractAddress: string, chainId: number): Promise<ABIFunction[]> {
    // Get the chain details
    const chain = getChainById(chainId);
    if (!chain) {
      throw new Error(`Chain with ID ${chainId} not supported`);
    }
    
    try {
      // Fetch ABI from explorer
      const abiJson = await fetchAbiFromExplorer(contractAddress, chain);
      
      // Parse the ABI
      return parseAbi(abiJson);
    } catch (error) {
      console.error('Error in getTokenABI:', error);
      // Return fallback mock ABI on error for testing
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
}

export const tokenAPI = new TokenAPI();
