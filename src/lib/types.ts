
// Define blockchain network information
export interface Chain {
  id: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  blockExplorerUrl: string;
  apiUrl?: string;
  apiKey?: string;
}

// Token information structure
export interface TokenInfo {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  price: string | null;
  volume24h: string | null;
  marketCap: string | null;
  holders: number | null;
  liquidity: string | null;
}

// ABI function input parameter
export interface ABIParameter {
  name: string;
  type: string;
  internalType?: string;
}

// ABI function definition
export interface ABIFunction {
  name: string;
  type: string;
  stateMutability: string;
  inputs: ABIParameter[];
  outputs: ABIParameter[];
}

// Function type (read or write)
export type FunctionType = 'read' | 'write';

// User input for function execution
export interface FunctionInput {
  name: string;
  type: string;
  value: string;
}

// Wallet connection state
export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

// Chain information from ethereum-lists/chains repository
export interface ChainInfo {
  name: string;
  chainId: string;
  shortName: string;
  networkId: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpc: string[];
  faucets: string[];
  explorers: {
    name: string;
    url: string;
    standard: string;
  }[];
  infoURL: string;
  icon?: string;
  status?: string;
}

// Note: Use 'declare global' instead of 'global' to avoid TypeScript error
declare global {
  interface Window {
    ethereum?: any; // Using 'any' type to avoid conflicts
  }
}
