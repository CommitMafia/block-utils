
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import TimeDisplayResults from './TimeDisplayResults';

interface DateToEpochConverterProps {
  dateValue: string;
  timeValue: string;
  epochValue: string;
  handleDateChange: (value: string) => void;
  handleTimeChange: (value: string) => void;
  errorMessage: string;
  gmtDateTime: string;
  localDateTime: string;
  localTimezoneName: string;
}

const DateToEpochConverter: React.FC<DateToEpochConverterProps> = ({
  dateValue,
  timeValue,
  epochValue,
  handleDateChange,
  handleTimeChange,
  errorMessage,
  gmtDateTime,
  localDateTime,
  localTimezoneName
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date-input" className="text-cyber-neon font-mono mb-2 block">
            Date
          </Label>
          <Input
            id="date-input"
            className="border-cyber-neon/30 bg-black/50 text-cyber-neon font-mono [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            type="date"
            value={dateValue}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="time-input" className="text-cyber-neon font-mono mb-2 block">
            Time
          </Label>
          <Input
            id="time-input"
            className="border-cyber-neon/30 bg-black/50 text-cyber-neon font-mono [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert pr-8"
            type="time"
            value={timeValue}
            onChange={(e) => handleTimeChange(e.target.value)}
            step="1"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="epoch-output" className="text-cyber-neon font-mono mb-2 block">
          Unix Timestamp (seconds)
        </Label>
        <Input
          id="epoch-output"
          className="border-cyber-neon/30 bg-black/50 text-cyber-neon font-mono w-full"
          value={epochValue}
          readOnly
          placeholder="Epoch output"
        />
        {errorMessage && (
          <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
        )}
      </div>
      
      {dateValue && !errorMessage && (
        <TimeDisplayResults 
          gmtDateTime={gmtDateTime} 
          localDateTime={localDateTime} 
          localTimezoneName={localTimezoneName} 
        />
      )}
    </>
  );
};

export default DateToEpochConverter;
