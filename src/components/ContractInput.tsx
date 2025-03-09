
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
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Enter Contract Address (0x...)"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          className="w-full cyber-input"
          disabled={isLoading}
          spellCheck={false}
        />
      </div>
      
      <div className="space-y-2">
        <ChainSelector
          selectedChainId={chainId}
          onChainChange={setChainId}
          disabled={isLoading}
        />
      </div>
      
      <Button
        type="submit"
        className="w-full cyber-button"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Get Token Info'}
      </Button>
    </form>
  );
};

export default ContractInput;
