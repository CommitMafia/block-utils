
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ChainSelector from './ChainSelector';
import { useToast } from '@/hooks/use-toast';

interface ContractInputProps {
  onSubmit: (contractAddress: string, chainId: number) => void;
  isLoading: boolean;
}

// Contract address input and chain selector component
const ContractInput: React.FC<ContractInputProps> = ({ onSubmit, isLoading }) => {
  const [contractAddress, setContractAddress] = useState('');
  const [chainId, setChainId] = useState(1); // Default to Ethereum
  const { toast } = useToast();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!contractAddress.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a contract address',
        variant: 'destructive',
      });
      return;
    }
    
    // Basic address format validation (0x followed by 40 hex chars)
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(contractAddress)) {
      toast({
        title: 'Invalid Address',
        description: 'Please enter a valid contract address',
        variant: 'destructive',
      });
      return;
    }
    
    onSubmit(contractAddress, chainId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="relative">
          <Input
            type="text"
            placeholder="0x..."
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="w-full cyber-input font-mono text-cyber-neon"
            disabled={isLoading}
            spellCheck={false}
          />
        </div>
        
        <ChainSelector
          selectedChainId={chainId}
          onChainChange={setChainId}
          disabled={isLoading}
        />
      </div>
      
      <Button
        type="submit"
        className="w-full bg-green-800 text-cyber-neon hover:bg-green-700 font-mono"
        disabled={isLoading}
      >
        {isLoading ? '>> PROCESSING...' : '>> EXECUTE_QUERY'}
      </Button>
    </form>
  );
};

export default ContractInput;
