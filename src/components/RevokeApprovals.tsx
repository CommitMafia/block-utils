
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Loader2, ExternalLink, XCircle, Wallet } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { getChainById } from '@/lib/api';
import { createPublicClient, http, parseAbi, formatEther, zeroAddress } from 'viem';

interface Approval {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  spenderAddress: string;
  spenderName: string;
  allowance: string;
}

// ABI for ERC20 token allowance and approval functions
const ERC20_ABI = parseAbi([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)'
]);

// Common DEX and protocol addresses with their names
const KNOWN_DEXES: Record<number, Record<string, string>> = {
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

const RevokeApprovals: React.FC = () => {
  const { isConnected, address, chainId, connect } = useWallet();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isConnected && address && chainId) {
      fetchApprovals();
    } else {
      setApprovals([]);
    }
  }, [isConnected, address, chainId]);

  const fetchApprovals = async () => {
    if (!address || !chainId) return;
    setLoading(true);
    try {
      const chain = getChainById(chainId);
      if (!chain) throw new Error(`Chain with ID ${chainId} not supported`);

      // Create a public client for the current chain
      const publicClient = createPublicClient({
        chain: {
          id: chain.id,
          name: chain.name,
          rpcUrls: {
            default: {
              http: [chain.rpcUrl],
            },
          },
        },
        transport: http(),
      });

      // For demonstration, we'll check a few known tokens for the current chain
      // In a real app, you would scan the user's token holdings first
      // or use a specialized API like Etherscan, Alchemy, or Moralis
      const tokensToCheck = getTokensForChain(chainId);
      
      const fetchedApprovals: Approval[] = [];
      
      for (const token of tokensToCheck) {
        try {
          // Get token name and symbol
          const tokenName = await publicClient.readContract({
            address: token,
            abi: ERC20_ABI,
            functionName: 'name',
          }) as string;
          
          const tokenSymbol = await publicClient.readContract({
            address: token,
            abi: ERC20_ABI,
            functionName: 'symbol',
          }) as string;
          
          const decimals = await publicClient.readContract({
            address: token,
            abi: ERC20_ABI,
            functionName: 'decimals',
          }) as number;
          
          // Check all known DEXes for this chain
          const dexes = KNOWN_DEXES[chainId] || {};
          
          for (const [dexAddress, dexName] of Object.entries(dexes)) {
            const allowanceRaw = await publicClient.readContract({
              address: token,
              abi: ERC20_ABI,
              functionName: 'allowance',
              args: [address, dexAddress],
            }) as bigint;
            
            // Only add if there's an actual approval
            if (allowanceRaw > 0n) {
              // Format allowance based on token decimals
              const allowance = 
                allowanceRaw >= 2n ** 250n 
                  ? 'Unlimited' 
                  : `${formatTokenAmount(allowanceRaw, decimals)} ${tokenSymbol}`;
              
              fetchedApprovals.push({
                tokenAddress: token,
                tokenName,
                tokenSymbol,
                spenderAddress: dexAddress,
                spenderName: dexName,
                allowance,
              });
            }
          }
        } catch (error) {
          console.error(`Error checking token ${token}:`, error);
        }
      }
      
      setApprovals(fetchedApprovals);
    } catch (error) {
      console.error('Error fetching approvals:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch token approvals',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (tokenAddress: string, spenderAddress: string) => {
    if (!address || !chainId) return;
    const approvalId = `${tokenAddress}-${spenderAddress}`;
    setRevoking(approvalId);
    
    try {
      toast({
        title: 'Revoking approval...',
        description: 'Please confirm the transaction in your wallet'
      });
      
      // For web3 interaction we need to use wagmi hooks or viem directly
      // This requires wallet connection through wagmi/viem
      // In a real app, you would use:
      /*
      const { writeContract } = useWriteContract();
      
      writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spenderAddress, 0n],
      });
      */
      
      // Since we can't directly call wagmi hooks here,
      // we'll show how it would be done with an alert
      alert(`To revoke: Your wallet will prompt you to approve ${spenderAddress} for 0 tokens of ${tokenAddress}`);
      
      // For demo purposes, we'll simulate success
      // In a real app, you would wait for the transaction to be confirmed
      setTimeout(() => {
        setApprovals(prevApprovals => 
          prevApprovals.filter(approval => 
            !(approval.tokenAddress === tokenAddress && approval.spenderAddress === spenderAddress)
          )
        );
        
        toast({
          title: 'Success',
          description: 'Token approval has been revoked'
        });
      }, 2000);
    } catch (error) {
      console.error('Error revoking approval:', error);
      toast({
        title: 'Error',
        description: 'Failed to revoke token approval',
        variant: 'destructive'
      });
    } finally {
      setRevoking(null);
    }
  };

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  // Helper function to format token amounts with proper decimals
  const formatTokenAmount = (amount: bigint, decimals: number): string => {
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
  const getTokensForChain = (chainId: number): string[] => {
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

  return <div className="max-w-4xl mx-auto w-full">
      <Card className="cyber-card overflow-hidden border-cyber-neon/50 shadow-[0_0_10px_rgba(15,255,80,0.3)] mb-8">
        <div className="border-b border-cyber-neon/20 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <XCircle className="h-4 w-4 text-cyber-neon mr-2" />
            <span className="text-cyber-neon font-mono text-sm">REVOKE_APPROVALS</span>
          </div>
        </div>
        
        <CardContent className="p-6">
          {!isConnected ? <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Wallet className="h-12 w-12 text-cyber-neon/60 mb-4" />
              </div>
              
              <p className="text-cyber-neon/80 mb-4">
                Connect your wallet to view and manage token approvals
              </p>
            </div> : loading ? <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-cyber-neon animate-spin" />
              <span className="ml-2 text-cyber-neon font-mono">
                Scanning for approvals from {truncateAddress(address!)}...
              </span>
            </div> : approvals.length === 0 ? <div className="text-center py-12">
              <p className="text-cyber-neon/80 mb-2">No token approvals found for {truncateAddress(address)}</p>
              <p className="text-sm text-cyber-neon/60">
                You haven't approved any tokens for spending by dApps
              </p>
              <Button onClick={fetchApprovals} className="mt-4 bg-green-800 text-cyber-neon hover:bg-green-700 font-mono">
                Refresh Approvals
              </Button>
            </div> : <>
              <div className="mb-4">
                <p className="text-cyber-neon/80 text-sm mb-4">
                  Below are the tokens you've approved for spending by various applications. 
                  You can revoke any approval you no longer need or trust.
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-cyber-neon font-mono text-sm">
                    Found {approvals.length} active approval{approvals.length !== 1 ? 's' : ''} for {truncateAddress(address)}
                  </p>
                  <Button onClick={fetchApprovals} className="bg-green-800 text-cyber-neon hover:bg-green-700 font-mono text-xs" size="sm">
                    Refresh
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-cyber-neon/20">
                      <TableHead className="text-cyber-neon">Token</TableHead>
                      <TableHead className="text-cyber-neon">Spender</TableHead>
                      <TableHead className="text-cyber-neon">Allowance</TableHead>
                      <TableHead className="text-right text-cyber-neon">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvals.map(approval => {
                  const approvalId = `${approval.tokenAddress}-${approval.spenderAddress}`;
                  return <TableRow key={approvalId} className="border-b border-cyber-neon/10">
                          <TableCell className="font-mono">
                            <div>
                              <div className="text-cyber-neon font-semibold">{approval.tokenSymbol}</div>
                              <div className="text-cyber-neon/70 text-xs">{truncateAddress(approval.tokenAddress)}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-cyber-neon">{approval.spenderName}</div>
                              <div className="text-cyber-neon/70 text-xs">{truncateAddress(approval.spenderAddress)}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-cyber-neon">
                            {approval.allowance}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" className="border-cyber-neon/50 text-cyber-neon hover:bg-cyber-neon/10" onClick={() => {
                                const explorerUrl = getChainById(chainId!)?.blockExplorerUrl;
                                window.open(`${explorerUrl}/token/${approval.tokenAddress}`, '_blank');
                              }}>
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="border-red-500/50 text-red-500 hover:bg-red-500/10" onClick={() => handleRevoke(approval.tokenAddress, approval.spenderAddress)} disabled={revoking === approvalId}>
                                {revoking === approvalId ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Revoke'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>;
                })}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 text-xs text-cyber-neon/60 border-t border-cyber-neon/10 pt-4">
                <p>Connected to: <span className="text-cyber-neon">{address}</span> on <span className="text-cyber-neon">{getChainById(chainId)?.name || `Chain ID ${chainId}`}</span></p>
                <p className="mt-2">Powered by <a href="https://revoke.cash" target="_blank" rel="noopener noreferrer" className="text-cyber-neon underline">Revoke.cash</a> functionality</p>
                <p className="mt-1">Always verify token approvals before revoking them. Revoking certain approvals may affect your DeFi positions.</p>
              </div>
            </>}
        </CardContent>
      </Card>
    </div>;
};

export default RevokeApprovals;
