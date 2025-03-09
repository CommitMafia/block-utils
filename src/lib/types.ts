
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
