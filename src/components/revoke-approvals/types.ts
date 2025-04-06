
import { Chain as ViemChain } from 'viem';

export interface Approval {
  tokenAddress: `0x${string}`;
  tokenName: string;
  tokenSymbol: string;
  spenderAddress: `0x${string}`;
  spenderName: string;
  allowance: string;
}

// Common DEX and protocol addresses with their names
export const KNOWN_DEXES: Record<number, Record<string, string>> = {
  1: { // Ethereum
    '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': 'Uniswap V2',
    '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': 'Uniswap V3',
    '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f': 'SushiSwap',
    '0x881d40237659c251811cec9c364ef91dc08d300c': 'Metamask Swap',
    '0x11111112542d85b3ef69ae05771c2dccff4faa26': '1inch',
  },
  137: { // Polygon
    '0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff': 'QuickSwap',
    '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506': 'SushiSwap',
    '0xe592427a0aece92de3edee1f18e0157c05861564': 'Uniswap V3',
  },
  56: { // BSC
    '0x10ed43c718714eb63d5aa57b78b54704e256024e': 'PancakeSwap',
    '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506': 'SushiSwap',
  },
  // Add more chains and DEXes as needed
};

// ABI for ERC20 token allowance and approval functions
export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)'
];
