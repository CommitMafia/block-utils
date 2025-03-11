
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { EpochConverterMode } from './ConversionModeSelector';

interface EpochConverterActionsProps {
  mode: EpochConverterMode;
  handleReset: () => void;
  handleUseCurrentTime: () => void;
}

const EpochConverterActionsProps: React.FC<EpochConverterActionsProps> = ({
  mode,
  handleReset,
  handleUseCurrentTime
}) => {
  return (
    <div className="w-full">
      <div className="flex mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleUseCurrentTime}
          className="border-cyber-neon/50 text-cyber-neon hover:bg-cyber-neon/10 h-8"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Use Current Time
        </Button>
      </div>
      
      <div className="flex justify-center mt-6">
        <Button 
          onClick={handleReset}
          variant="outline" 
          className="border-cyber-neon/50 text-cyber-neon hover:bg-cyber-neon/10"
        >
          <X className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default EpochConverterActionsProps;
