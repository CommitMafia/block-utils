
import { useState } from 'react';
import { TokenInfo } from '@/lib/types';
import { tokenAPI } from '@/lib/api';

// Hook to fetch token information
export function useToken() {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch token info
  const fetchTokenInfo = async (contractAddress: string, chainId: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const info = await tokenAPI.getTokenInfo(contractAddress, chainId);
      setTokenInfo(info);
    } catch (err) {
      console.error('Error fetching token info:', err);
      setError('Failed to fetch token information');
      setTokenInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset token info
  const resetTokenInfo = () => {
    setTokenInfo(null);
    setError(null);
  };

  return {
    tokenInfo,
    isLoading,
    error,
    fetchTokenInfo,
    resetTokenInfo
  };
}
