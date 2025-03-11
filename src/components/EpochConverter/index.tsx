
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import CurrentTimeDisplay from './CurrentTimeDisplay';
import ConversionModeSelector, { EpochConverterMode } from './ConversionModeSelector';
import EpochToDateConverter from './EpochToDateConverter';
import DateToEpochConverter from './DateToEpochConverter';
import { isValidDate, detectUserTimeZone } from './utils';

const EpochConverter: React.FC = () => {
  const [mode, setMode] = useState<EpochConverterMode>('epoch-to-date');
  const [epochValue, setEpochValue] = useState<string>('');
  const [dateValue, setDateValue] = useState<string>('');
  const [timeValue, setTimeValue] = useState<string>('');
  const [localTimezoneName, setLocalTimezoneName] = useState<string>('');
  const [gmtDateTime, setGmtDateTime] = useState<string>('');
  const [localDateTime, setLocalDateTime] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);

  // Get the user's timezone name and ensure it updates if browser data changes
  useEffect(() => {
    const updateTimeZone = () => {
      setLocalTimezoneName(detectUserTimeZone());
    };

    // Detect immediately on mount
    updateTimeZone();

    // Also check when visibility changes (user might switch VPN)
    document.addEventListener('visibilitychange', updateTimeZone);
    
    return () => {
      document.removeEventListener('visibilitychange', updateTimeZone);
    };
  }, []);

  // Update current time display
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentEpoch(Math.floor(now.getTime() / 1000));
    };
    
    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleReset = () => {
    setEpochValue('');
    setDateValue('');
    setTimeValue('');
    setGmtDateTime('');
    setLocalDateTime('');
    setErrorMessage('');
    toast.success('Values reset');
  };

  const handleUseCurrentTime = () => {
    if (mode === 'epoch-to-date') {
      setEpochValue(currentEpoch.toString());
      convertEpochToDate(currentEpoch.toString());
    } else {
      const now = new Date();
      setDateValue(format(now, 'yyyy-MM-dd'));
      setTimeValue(format(now, 'HH:mm:ss'));
      convertDateToEpoch(format(now, 'yyyy-MM-dd'), format(now, 'HH:mm:ss'));
    }
    toast.success('Current time applied');
  };

  const convertEpochToDate = (value: string) => {
    if (!value) {
      setDateValue('');
      setTimeValue('');
      setGmtDateTime('');
      setLocalDateTime('');
      setErrorMessage('');
      return;
    }

    try {
      setErrorMessage('');
      const timestamp = parseInt(value, 10);
      
      if (isNaN(timestamp)) {
        throw new Error('Invalid epoch timestamp');
      }
      
      const date = new Date(timestamp * 1000);
      
      if (!isValidDate(date)) {
        throw new Error('Invalid date result');
      }
      
      setDateValue(format(date, 'yyyy-MM-dd'));
      setTimeValue(format(date, 'hh:mm:ss a'));
      
      // Format the GMT time
      const gmtFormattedDate = formatInTimeZone(date, 'UTC', 'yyyy-MM-dd HH:mm:ss zzz');
      setGmtDateTime(gmtFormattedDate);
      
      // Get the current timezone directly from the browser each time we format
      // This ensures we always use the most up-to-date timezone information
      const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log('Using timezone for formatting:', currentTimezone);
      
      const localFormattedDate = formatInTimeZone(
        date, 
        currentTimezone || 'UTC', 
        'yyyy-MM-dd HH:mm:ss zzz'
      );
      setLocalDateTime(localFormattedDate);
    } catch (error) {
      setErrorMessage('Invalid epoch timestamp');
      setDateValue('');
      setTimeValue('');
      setGmtDateTime('');
      setLocalDateTime('');
    }
  };

  const convertDateToEpoch = (date: string, time: string) => {
    if (!date) {
      setEpochValue('');
      setGmtDateTime('');
      setLocalDateTime('');
      setErrorMessage('');
      return;
    }

    try {
      setErrorMessage('');
      const timeString = time || '00:00:00';
      const dateTimeString = `${date}T${timeString}`;
      const dateObj = new Date(dateTimeString);
      
      if (!isValidDate(dateObj)) {
        throw new Error('Invalid date');
      }
      
      const epochTimestamp = Math.floor(dateObj.getTime() / 1000);
      setEpochValue(epochTimestamp.toString());
      
      // Format the GMT time
      const gmtFormattedDate = formatInTimeZone(dateObj, 'UTC', 'yyyy-MM-dd HH:mm:ss zzz');
      setGmtDateTime(gmtFormattedDate);
      
      // Get the current timezone directly from the browser each time we format
      // This ensures we always use the most up-to-date timezone information
      const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const localFormattedDate = formatInTimeZone(
        dateObj, 
        currentTimezone || 'UTC', 
        'yyyy-MM-dd HH:mm:ss zzz'
      );
      setLocalDateTime(localFormattedDate);
    } catch (error) {
      setErrorMessage('Invalid date or time');
      setEpochValue('');
      setGmtDateTime('');
      setLocalDateTime('');
    }
  };

  const handleEpochChange = (value: string) => {
    setEpochValue(value);
    
    if (mode === 'epoch-to-date') {
      convertEpochToDate(value);
    }
  };

  const handleDateChange = (value: string) => {
    setDateValue(value);
    
    if (mode === 'date-to-epoch') {
      convertDateToEpoch(value, timeValue);
    }
  };

  const handleTimeChange = (value: string) => {
    setTimeValue(value);
    
    if (mode === 'date-to-epoch' && dateValue) {
      convertDateToEpoch(dateValue, value);
    }
  };

  return (
    <Card className="cyber-card overflow-hidden border-cyber-neon/50 shadow-[0_0_10px_rgba(15,255,80,0.3)] mb-8">
      <div className="border-b border-cyber-neon/20 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Clock className="h-4 w-4 text-cyber-neon mr-2" />
          <span className="text-cyber-neon font-mono text-sm">EPOCH_CONVERTER</span>
        </div>
        <div className="flex space-x-2">
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
      </div>
      
      <CardContent className="p-6">
        <CurrentTimeDisplay />
        
        <ConversionModeSelector 
          mode={mode} 
          setMode={setMode} 
          handleReset={handleReset}
        />
        
        <p className="text-cyber-neon/70 text-xs mb-4 font-mono">Current Epoch: {currentEpoch}</p>
        
        <div className="space-y-4">
          {mode === 'epoch-to-date' ? (
            <EpochToDateConverter 
              epochValue={epochValue}
              handleEpochChange={handleEpochChange}
              errorMessage={errorMessage}
              gmtDateTime={gmtDateTime}
              localDateTime={localDateTime}
              localTimezoneName={localTimezoneName}
            />
          ) : (
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
          )}
          
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
      </CardContent>
    </Card>
  );
};

export default EpochConverter;
