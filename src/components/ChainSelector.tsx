
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Chain } from '@/lib/types';
import { supportedChains } from '@/lib/api';
import { ChevronDown } from 'lucide-react';

interface ChainSelectorProps {
  selectedChainId: number;
  onChainChange: (chainId: number) => void;
  disabled?: boolean;
}

// Chain selection dropdown component
const ChainSelector: React.FC<ChainSelectorProps> = ({
  selectedChainId,
  onChainChange,
  disabled = false
}) => {
  const handleChainChange = (value: string) => {
    onChainChange(parseInt(value, 10));
  };

  return (
    <Select
      value={selectedChainId.toString()}
      onValueChange={handleChainChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full cyber-input font-mono text-cyber-neon">
        <div className="flex justify-between items-center w-full">
          <SelectValue placeholder="SELECT_NETWORK" />
          <ChevronDown className="h-4 w-4 text-cyber-neon opacity-70" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-black border border-cyber-neon/50">
        {supportedChains.map((chain: Chain) => (
          <SelectItem 
            key={chain.id} 
            value={chain.id.toString()}
            className="cursor-pointer text-cyber-neon font-mono hover:bg-cyber-neon/10"
          >
            {chain.name} ({chain.symbol})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ChainSelector;
