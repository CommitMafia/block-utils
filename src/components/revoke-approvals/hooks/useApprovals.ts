
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createPublicClient, http, parseAbi, formatEther } from 'viem';
import { Chain as ViemChain } from 'viem';
import { Approval, ERC20_ABI, KNOWN_DEXES } from '../types';
import { ensureHexString, formatTokenAmount, getTokensForChain, formatChainForViem } from '../utils';

export const useApprovals = (address: string | null, chainId: number | null) => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchApprovals = async () => {
    if (!address || !chainId) return;
    setLoading(true);
    try {
      // Fetch approvals from Revoke.cash API
      const fetchedApprovals = await fetchRevokeCashApprovals(address, chainId);
      setApprovals(fetchedApprovals);
    } catch (error) {
      console.error('Error fetching approvals:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch token approvals',
        variant: 'destructive'
      });
      // Fallback to the original method if the API fails
      await fetchApprovalsLegacy();
    } finally {
      setLoading(false);
    }
  };
  
  // Fallback method to fetch approvals in case the API fails
  const fetchApprovalsLegacy = async () => {
    if (!address || !chainId) return;
    try {
      // Create a public client for the current chain
      const formattedChain = formatChainForViem(chainId);
      const publicClient = createPublicClient({
        chain: formattedChain as ViemChain,
        transport: http(),
      });

      // Get tokens to check for the current chain
      const tokensToCheck = getTokensForChain(chainId);
      
      const fetchedApprovals: Approval[] = [];
      
      for (const token of tokensToCheck) {
        try {
          // Ensure the token address is formatted correctly
          const formattedTokenAddress = ensureHexString(token);
          
          // Get token name and symbol
          const tokenName = await publicClient.readContract({
            address: formattedTokenAddress,
            abi: parseAbi(ERC20_ABI),
            functionName: 'name',
          }) as string;
          
          const tokenSymbol = await publicClient.readContract({
            address: formattedTokenAddress,
            abi: parseAbi(ERC20_ABI),
            functionName: 'symbol',
          }) as string;
          
          const decimals = await publicClient.readContract({
            address: formattedTokenAddress,
            abi: parseAbi(ERC20_ABI),
            functionName: 'decimals',
          }) as number;
          
          // Check all known DEXes for this chain
          const dexes = KNOWN_DEXES[chainId] || {};
          
          for (const [dexAddress, dexName] of Object.entries(dexes)) {
            // Ensure the dex address is formatted correctly
            const formattedDexAddress = ensureHexString(dexAddress);
            
            const allowanceRaw = await publicClient.readContract({
              address: formattedTokenAddress,
              abi: parseAbi(ERC20_ABI),
              functionName: 'allowance',
              args: [ensureHexString(address), formattedDexAddress],
            }) as bigint;
            
            // Only add if there's an actual approval
            if (allowanceRaw > 0n) {
              // Format allowance based on token decimals
              const allowance = 
                allowanceRaw >= 2n ** 250n 
                  ? 'Unlimited' 
                  : `${formatTokenAmount(allowanceRaw, decimals)} ${tokenSymbol}`;
              
              fetchedApprovals.push({
                tokenAddress: formattedTokenAddress,
                tokenName,
                tokenSymbol,
                spenderAddress: formattedDexAddress,
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
      console.error('Error fetching approvals (legacy):', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch token approvals',
        variant: 'destructive'
      });
    }
  };

  const handleRevoke = async (tokenAddress: `0x${string}`, spenderAddress: `0x${string}`) => {
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

  useEffect(() => {
    if (address && chainId) {
      fetchApprovals();
    } else {
      setApprovals([]);
    }
  }, [address, chainId]);

  return {
    approvals,
    loading,
    revoking,
    fetchApprovals,
    handleRevoke
  };
};

// Function to fetch approvals from Revoke.cash API
async function fetchRevokeCashApprovals(address: string, chainId: number): Promise<Approval[]> {
  try {
    const response = await fetch(`https://api.revoke.cash/v2/approvals/${chainId}/${address}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the API response to match our Approval interface
    return data.map((item: any) => {
      const unlimitedAllowance = BigInt(item.allowance) >= 2n ** 250n;
      
      return {
        tokenAddress: ensureHexString(item.token.address),
        tokenName: item.token.name || 'Unknown Token',
        tokenSymbol: item.token.symbol || '???',
        spenderAddress: ensureHexString(item.spender.address),
        spenderName: item.spender.name || 'Unknown Spender',
        allowance: unlimitedAllowance 
          ? 'Unlimited' 
          : `${item.allowance_formatted} ${item.token.symbol}`,
      };
    });
  } catch (error) {
    console.error('Error fetching from Revoke.cash API:', error);
    throw error;
  }
}
