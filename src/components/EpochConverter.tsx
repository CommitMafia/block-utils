import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, RefreshCw, X, ArrowRightLeft, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

type EpochConverterMode = 'epoch-to-date' | 'date-to-epoch';

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
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  useEffect(() => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setLocalTimezoneName(timezone || 'Local');
    } catch (error) {
      setLocalTimezoneName('Local');
    }
  }, []);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentEpoch(Math.floor(now.getTime() / 1000));
      setCurrentDateTime(format(now, 'yyyy-MM-dd HH:mm:ss'));
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

  const handleSwapMode = () => {
    setMode(prev => prev === 'epoch-to-date' ? 'date-to-epoch' : 'epoch-to-date');
    handleReset();
    toast.success('Conversion mode swapped');
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
      setTimeValue(format(date, 'HH:mm:ss'));
      
      const gmtFormattedDate = formatInTimeZone(date, 'UTC', 'yyyy-MM-dd HH:mm:ss zzz');
      setGmtDateTime(gmtFormattedDate);
      
      const localFormattedDate = formatInTimeZone(date, Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', 'yyyy-MM-dd HH:mm:ss zzz');
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
      
      const gmtFormattedDate = formatInTimeZone(dateObj, 'UTC', 'yyyy-MM-dd HH:mm:ss zzz');
      setGmtDateTime(gmtFormattedDate);
      
      const localFormattedDate = formatInTimeZone(dateObj, Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', 'yyyy-MM-dd HH:mm:ss zzz');
      setLocalDateTime(localFormattedDate);
    } catch (error) {
      setErrorMessage('Invalid date or time');
      setEpochValue('');
      setGmtDateTime('');
      setLocalDateTime('');
    }
  };

  const isValidDate = (date: Date) => {
    return !isNaN(date.getTime());
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
        <div className="bg-black/40 border border-cyber-neon/20 rounded-md p-3 mb-6">
          <div className="flex items-center justify-center mb-1">
            <Clock className="h-4 w-4 text-cyber-neon mr-2" />
            <span className="text-cyber-neon font-mono text-sm">CURRENT_TIME</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-cyber-neon/90 font-mono text-xs mb-1">Date</p>
              <p className="text-cyber-neon/90 font-mono text-lg">{format(new Date(), 'yyyy-MM-dd')}</p>
            </div>
            <div>
              <p className="text-cyber-neon/90 font-mono text-xs mb-1">Time</p>
              <p className="text-cyber-neon/90 font-mono text-lg">{format(new Date(), 'HH:mm:ss')}</p>
            </div>
          </div>
        </div>
        
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
        
        <p className="text-cyber-neon/70 text-xs mb-4 font-mono">Current Epoch: {currentEpoch}</p>
        
        <div className="space-y-4">
          {mode === 'epoch-to-date' ? (
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
              
              {/* Timezone displays */}
              {epochValue && !errorMessage && (
                <div className="mt-4 space-y-3">
                  <div className="p-3 border border-cyber-neon/20 rounded-md bg-black/50">
                    <div className="flex items-center mb-2">
                      <Globe className="h-4 w-4 text-cyber-neon mr-2" />
                      <Label className="text-cyber-neon font-mono text-sm">GMT / UTC Time</Label>
                    </div>
                    <p className="text-cyber-neon/90 font-mono text-sm pl-6">{gmtDateTime}</p>
                  </div>
                  
                  <div className="p-3 border border-cyber-neon/20 rounded-md bg-black/50">
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 text-cyber-neon mr-2" />
                      <Label className="text-cyber-neon font-mono text-sm">{localTimezoneName} Time</Label>
                    </div>
                    <p className="text-cyber-neon/90 font-mono text-sm pl-6">{localDateTime}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date-input" className="text-cyber-neon font-mono mb-2 block">
                    Date
                  </Label>
                  <Input
                    id="date-input"
                    className="border-cyber-neon/30 bg-black/50 text-cyber-neon font-mono"
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
                    className="border-cyber-neon/30 bg-black/50 text-cyber-neon font-mono"
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
              
              {/* Timezone displays */}
              {dateValue && !errorMessage && (
                <div className="mt-4 space-y-3">
                  <div className="p-3 border border-cyber-neon/20 rounded-md bg-black/50">
                    <div className="flex items-center mb-2">
                      <Globe className="h-4 w-4 text-cyber-neon mr-2" />
                      <Label className="text-cyber-neon font-mono text-sm">GMT / UTC Time</Label>
                    </div>
                    <p className="text-cyber-neon/90 font-mono text-sm pl-6">{gmtDateTime}</p>
                  </div>
                  
                  <div className="p-3 border border-cyber-neon/20 rounded-md bg-black/50">
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 text-cyber-neon mr-2" />
                      <Label className="text-cyber-neon font-mono text-sm">{localTimezoneName} Time</Label>
                    </div>
                    <p className="text-cyber-neon/90 font-mono text-sm pl-6">{localDateTime}</p>
                  </div>
                </div>
              )}
            </>
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
