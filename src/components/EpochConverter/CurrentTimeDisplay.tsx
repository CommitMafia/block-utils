
import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

const CurrentTimeDisplay: React.FC = () => {
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

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

  return (
    <div className="bg-black/40 border border-cyber-neon/20 rounded-md p-3 mb-6">
      <div className="flex items-center justify-center mb-2">
        <Clock className="h-4 w-4 text-cyber-neon mr-2" />
        <span className="text-cyber-neon font-mono text-sm">CURRENT_TIME</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-cyber-neon/90 font-mono text-xs mb-1">Date</p>
          <p className="text-cyber-neon/90 font-mono text-base">{format(new Date(), 'yyyy-MM-dd')}</p>
        </div>
        <div>
          <p className="text-cyber-neon/90 font-mono text-xs mb-1">Time</p>
          <p className="text-cyber-neon/90 font-mono text-base pr-6">{format(new Date(), 'hh:mm:ss a')}</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentTimeDisplay;
