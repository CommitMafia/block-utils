
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CurrentTimeDisplay from './CurrentTimeDisplay';
import ConversionModeSelector from './ConversionModeSelector';
import EpochToDateConverter from './EpochToDateConverter';
import DateToEpochConverter from './DateToEpochConverter';
import TimeDisplayResults from './TimeDisplayResults';
import EpochConverterHeader from './EpochConverterHeader';
import EpochConverterActions from './EpochConverterActions';
import { useEpochConverter } from './useEpochConverter';
import TimeResults from './TimeResults';

const EpochConverter: React.FC = () => {
  const {
    mode,
    setMode,
    epochValue,
    dateValue,
    timeValue,
    localTimezoneName,
    gmtDateTime,
    localDateTime,
    errorMessage,
    currentEpoch,
    handleReset,
    handleUseCurrentTime,
    handleEpochChange,
    handleDateChange,
    handleTimeChange
  } = useEpochConverter();

  return (
    <Card className="cyber-card overflow-hidden border-cyber-neon/50 shadow-[0_0_10px_rgba(15,255,80,0.3)] mb-8">
      <EpochConverterHeader handleReset={handleReset} />
      
      <CardContent className="p-6">
        <CurrentTimeDisplay />
        
        <ConversionModeSelector 
          mode={mode} 
          setMode={setMode} 
          handleReset={handleReset}
        />
        
        <p className="text-cyber-neon/70 text-xs mb-4 font-mono">Current Epoch: {currentEpoch}</p>
        
        <div className="space-y-4">
          <EpochConverterActions
            mode={mode}
            handleReset={handleReset}
            handleUseCurrentTime={handleUseCurrentTime}
          />

          {mode === 'epoch-to-date' ? (
            <>
              <EpochToDateConverter 
                epochValue={epochValue}
                handleEpochChange={handleEpochChange}
                errorMessage={errorMessage}
                gmtDateTime={gmtDateTime}
                localDateTime={localDateTime}
                localTimezoneName={localTimezoneName}
              />
            </>
          ) : (
            <>
              <DateToEpochConverter 
                dateValue={dateValue}
                timeValue={timeValue}
                epochValue={epochValue}
                handleDateChange={handleDateChange}
                handleTimeChange={handleTimeChange}
                errorMessage={errorMessage}
                gmtDateTime={gmtDateTime}
                localDateTime={localDateTime}
                localTimezoneName={localTimezoneName}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EpochConverter;
