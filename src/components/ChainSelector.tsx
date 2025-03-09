
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
      <SelectTrigger className="w-full cyber-input">
        <SelectValue placeholder="Select Chain" />
      </SelectTrigger>
      <SelectContent>
        {supportedChains.map((chain: Chain) => (
          <SelectItem 
            key={chain.id} 
            value={chain.id.toString()}
            className="cursor-pointer"
          >
            {chain.name} ({chain.symbol})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ChainSelector;
