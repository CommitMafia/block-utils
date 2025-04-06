
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { KNOWN_DEXES, Approval } from '../types';

export function useApprovals(address?: string | null, chainId?: number | null) {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchApprovals = useCallback(async () => {
    // Only fetch approvals if we have a valid address and chain ID
    if (!address || !chainId) {
      setApprovals([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://api.revoke.cash/v2/approvals`, {
        params: {
          chain: chainId,
          address: address
        }
      });

      // Transform the response into our Approval type
      const formattedApprovals: Approval[] = response.data.map((approval: any) => {
        // Get spender name from our known DEXes, or use "Unknown Protocol" if not found
        const spenderName = 
          (KNOWN_DEXES[chainId] && KNOWN_DEXES[chainId][approval.spender.toLowerCase()]) || 
          approval.spenderName || 
          "Unknown Protocol";

        return {
          tokenAddress: approval.contract as `0x${string}`,
          tokenName: approval.name || "Unknown Token",
          tokenSymbol: approval.symbol || "???",
          spenderAddress: approval.spender as `0x${string}`,
          spenderName: spenderName,
          allowance: approval.amount === "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" ? 
            "Unlimited" : 
            approval.formattedAmount || "Unknown Amount"
        };
      });

      setApprovals(formattedApprovals);
    } catch (err) {
      console.error('Error fetching approvals:', err);
      setError('Failed to fetch token approvals');
      setApprovals([]);
    } finally {
      setLoading(false);
    }
  }, [address, chainId]);

  const handleRevoke = async (tokenAddress: `0x${string}`, spenderAddress: `0x${string}`) => {
    if (!address || !chainId) return;

    const approvalId = `${tokenAddress}-${spenderAddress}`;
    
    try {
      setRevoking(approvalId);
      // Implement revoke logic here
      // This is a placeholder and should be replaced with actual wallet interaction
      console.log('Revoking approval for token', tokenAddress, 'spender', spenderAddress);
      
      // After successful revoke, refresh approvals
      await fetchApprovals();
    } catch (err) {
      console.error('Error revoking approval:', err);
    } finally {
      setRevoking(null);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  return {
    approvals,
    loading,
    revoking,
    error,
    fetchApprovals,
    handleRevoke
  };
}
