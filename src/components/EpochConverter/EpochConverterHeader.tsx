
import React from 'react';
import { Clock, X } from 'lucide-react';

interface EpochConverterHeaderProps {
  handleReset: () => void;
}

const EpochConverterHeader: React.FC<EpochConverterHeaderProps> = ({ handleReset }) => {
  return (
    <div className="border-b border-cyber-neon/20 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Clock className="h-4 w-4 text-cyber-neon mr-2" />
        <span className="text-cyber-neon font-mono text-sm">EPOCH_CONVERTER</span>
      </div>
    </div>
  );
};

export default EpochConverterHeader;
