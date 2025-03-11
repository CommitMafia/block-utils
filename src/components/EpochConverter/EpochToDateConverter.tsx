
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatInTimeZone } from 'date-fns-tz';
import { format } from 'date-fns';
import { isValidDate } from './utils';
import TimeDisplayResults from './TimeDisplayResults';

interface EpochToDateConverterProps {
  epochValue: string;
  handleEpochChange: (value: string) => void;
  errorMessage: string;
  gmtDateTime: string;
  localDateTime: string;
  localTimezoneName: string;
}

const EpochToDateConverter: React.FC<EpochToDateConverterProps> = ({
  epochValue,
  handleEpochChange,
  errorMessage,
  gmtDateTime,
  localDateTime,
  localTimezoneName
}) => {
  return (
    <>
      <div>
        <Label htmlFor="epoch-input" className="text-cyber-neon font-mono mb-2 block">
          Unix Timestamp (seconds)
        </Label>
        <Input
          id="epoch-input"
          className="border-cyber-neon/30 bg-black/50 text-cyber-neon font-mono w-full"
          value={epochValue}
          onChange={(e) => handleEpochChange(e.target.value)}
          placeholder="Enter epoch timestamp"
        />
        {errorMessage && (
          <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
        )}
      </div>
      
      {epochValue && !errorMessage && (
        <TimeDisplayResults 
          gmtDateTime={gmtDateTime} 
          localDateTime={localDateTime} 
          localTimezoneName={localTimezoneName} 
        />
      )}
    </>
  );
};

export default EpochToDateConverter;
