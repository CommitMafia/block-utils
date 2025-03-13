
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';

interface EntropyConverterProps {
  entropy: string;
  setEntropy: (value: string) => void;
  entropyType: string;
  setEntropyType: (value: string) => void;
  generateFromEntropy: () => void;
}

const EntropyConverter: React.FC<EntropyConverterProps> = ({
  entropy,
  setEntropy,
  entropyType,
  setEntropyType,
  generateFromEntropy
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="entropy" className="text-cyber-neon">Entropy</Label>
          <Select
            value={entropyType}
            onValueChange={setEntropyType}
          >
            <SelectTrigger className="w-[120px] cyber-input">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hex">Hexadecimal</SelectItem>
              <SelectItem value="binary">Binary</SelectItem>
              <SelectItem value="dice">Dice Rolls</SelectItem>
              <SelectItem value="base6">Base 6</SelectItem>
              <SelectItem value="cards">Playing Cards</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Textarea
          id="entropy"
          className="cyber-input h-20 terminal-text"
          value={entropy}
          onChange={(e) => setEntropy(e.target.value)}
          placeholder="Enter entropy value"
        />
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={generateFromEntropy}
        >
          <RefreshCw className="h-4 w-4" /> Convert
        </Button>
      </div>
    </div>
  );
};

export default EntropyConverter;
