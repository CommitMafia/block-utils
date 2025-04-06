import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { formatTokenAmount, ensureHexString } from '../utils';
import { Approval } from '../types';

export function useApprovals(address?: string | null, chainId?: number | null) {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState<{ [key: string]: boolean }>({});
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
      const formattedApprovals: Approval[] = response.data.map((approval: any) => ({
        spender: ensureHexString(approval.spender),
        token: ensureHexString(approval.contract),
        amount: BigInt(approval.amount || '0'),
        tokenDecimals: approval.decimals || 18
      }));

      setApprovals(formattedApprovals);
    } catch (err) {
      console.error('Error fetching approvals:', err);
      setError('Failed to fetch token approvals');
      setApprovals([]);
    } finally {
      setLoading(false);
    }
  }, [address, chainId]);

  const handleRevoke = async (approval: Approval) => {
    if (!address || !chainId) return;

    try {
      setRevoking(prev => ({ ...prev, [approval.token]: true }));
      // Implement revoke logic here
      // This is a placeholder and should be replaced with actual wallet interaction
      console.log('Revoking approval:', approval);
      
      // After successful revoke, refresh approvals
      await fetchApprovals();
    } catch (err) {
      console.error('Error revoking approval:', err);
    } finally {
      setRevoking(prev => ({ ...prev, [approval.token]: false }));
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
