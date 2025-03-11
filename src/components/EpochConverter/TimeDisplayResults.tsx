
import React from 'react';
import { Label } from '@/components/ui/label';
import { Globe, Clock } from 'lucide-react';

interface TimeDisplayResultsProps {
  gmtDateTime: string;
  localDateTime: string;
  localTimezoneName: string;
}

const TimeDisplayResults: React.FC<TimeDisplayResultsProps> = ({
  gmtDateTime,
  localDateTime,
  localTimezoneName
}) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="p-4 border border-cyber-neon/20 rounded-md bg-black/50">
        <div className="flex items-center mb-2">
          <Globe className="h-4 w-4 text-cyber-neon mr-2" />
          <Label className="text-cyber-neon font-mono text-sm">GMT / UTC Time</Label>
        </div>
        <p className="text-cyber-neon/90 font-mono text-sm pl-6 break-words">{gmtDateTime}</p>
      </div>
      
      <div className="p-4 border border-cyber-neon/20 rounded-md bg-black/50">
        <div className="flex items-center mb-2">
          <Clock className="h-4 w-4 text-cyber-neon mr-2" />
          <Label className="text-cyber-neon font-mono text-sm">{localTimezoneName} Time</Label>
        </div>
        <p className="text-cyber-neon/90 font-mono text-sm pl-6 break-words">{localDateTime}</p>
      </div>
    </div>
  );
};

export default TimeDisplayResults;
