
import { useState } from 'react';
import { ABIFunction } from '@/lib/types';
import { tokenAPI } from '@/lib/api';

// Hook to fetch and manage ABI functions
export function useAbi() {
  const [abiFunctions, setAbiFunctions] = useState<ABIFunction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get readable and writable functions
  const getReadFunctions = () => abiFunctions.filter(func => 
    func.stateMutability === 'view' || func.stateMutability === 'pure'
  );
  
  const getWriteFunctions = () => abiFunctions.filter(func => 
    func.stateMutability !== 'view' && func.stateMutability !== 'pure'
  );

  // Function to fetch ABI
  const fetchAbi = async (contractAddress: string, chainId: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const abi = await tokenAPI.getTokenABI(contractAddress, chainId);
      setAbiFunctions(abi);
    } catch (err) {
      console.error('Error fetching ABI:', err);
      setError('Failed to fetch contract ABI');
      setAbiFunctions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset ABI functions
  const resetAbi = () => {
    setAbiFunctions([]);
    setError(null);
  };

  return {
    abiFunctions,
    readFunctions: getReadFunctions(),
    writeFunctions: getWriteFunctions(),
    isLoading,
    error,
    fetchAbi,
    resetAbi
  };
}
