
import React from 'react';
import TimeDisplayResults from './TimeDisplayResults';

interface TimeResultsProps {
  errorMessage: string;
  gmtDateTime: string;
  localDateTime: string;
  localTimezoneName: string;
  dateValue?: string;
  epochValue?: string;
  mode: 'epoch-to-date' | 'date-to-epoch';
}

const TimeResults: React.FC<TimeResultsProps> = ({
  errorMessage,
  gmtDateTime,
  localDateTime,
  localTimezoneName,
  dateValue,
  epochValue,
  mode
}) => {
  // Return empty if there's an error or no input
  if (errorMessage || (mode === 'epoch-to-date' && !epochValue) || (mode === 'date-to-epoch' && !dateValue)) {
    return null;
  }

  return (
    <TimeDisplayResults 
      gmtDateTime={gmtDateTime} 
      localDateTime={localDateTime} 
      localTimezoneName={localTimezoneName} 
    />
  );
};

export default TimeResults;
