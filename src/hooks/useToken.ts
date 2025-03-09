
import { useState } from 'react';
import { TokenInfo } from '@/lib/types';
import { tokenAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Hook to fetch token information
export function useToken() {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to fetch token info
  const fetchTokenInfo = async (contractAddress: string, chainId: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const info = await tokenAPI.getTokenInfo(contractAddress, chainId);
      setTokenInfo(info);
      
      // Notify user if we couldn't get complete data
      if (info.name === "Unknown Token") {
        toast({
          title: "Limited data available",
          description: "Could not retrieve complete token information. Some data may be missing.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error fetching token info:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch token information';
      setError(errorMessage);
      setTokenInfo(null);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
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
