
import { formatInTimeZone } from 'date-fns-tz';

export const isValidDate = (date: Date): boolean => {
  return !isNaN(date.getTime());
};

export const detectUserTimeZone = (): string => {
  try {
    // Force re-evaluation of timezone
    const date = new Date();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Verify timezone is valid by trying to format with it
    try {
      formatInTimeZone(date, timezone, 'z');
      console.log('Current timezone detected:', timezone);
      return timezone || 'Local';
    } catch (e) {
      console.warn('Invalid timezone detected:', timezone);
      return 'Local';
    }
  } catch (error) {
    console.error('Error detecting timezone:', error);
    return 'Local';
  }
};
