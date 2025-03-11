
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';

export type EpochConverterMode = 'epoch-to-date' | 'date-to-epoch';

interface ConversionModeSelectorProps {
  mode: EpochConverterMode;
  setMode: (mode: EpochConverterMode) => void;
  handleReset: () => void;
}

const ConversionModeSelector: React.FC<ConversionModeSelectorProps> = ({ 
  mode, 
  setMode, 
  handleReset 
}) => {
  const handleSwapMode = () => {
    setMode(mode === 'epoch-to-date' ? 'date-to-epoch' : 'epoch-to-date');
    handleReset();
    toast.success('Conversion mode swapped');
  };

  return (
    <div className="mb-6">
      <Label htmlFor="conversion-mode" className="text-cyber-neon font-mono mb-2 block">Conversion Mode</Label>
      <div className="flex items-center space-x-2">
        <Select value={mode} onValueChange={(value) => setMode(value as EpochConverterMode)}>
          <SelectTrigger 
            id="conversion-mode" 
            className="border-cyber-neon/30 bg-black/50 text-cyber-neon font-mono flex-1"
          >
            <SelectValue placeholder="Select conversion mode" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-cyber-neon/30">
            <SelectItem value="epoch-to-date" className="text-cyber-neon font-mono">Epoch to Date</SelectItem>
            <SelectItem value="date-to-epoch" className="text-cyber-neon font-mono">Date to Epoch</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          onClick={handleSwapMode}
          className="border-cyber-neon/50 text-cyber-neon hover:bg-cyber-neon/10"
        >
          <ArrowRightLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ConversionModeSelector;
