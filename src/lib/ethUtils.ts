
/**
 * Utility functions for Ethereum unit conversions
 */

// Format a value from one ETH unit to another
export const formatValue = (value: number, fromFactor: number, toFactor: number): string => {
  if (value === 0) return '0';
  
  // Convert to wei (smallest unit) first
  const valueInWei = value * Math.pow(10, fromFactor);
  
  // Then convert from wei to target unit
  const convertedValue = valueInWei / Math.pow(10, toFactor);
  
  // Format the value based on size
  if (convertedValue < 0.000001 && convertedValue > 0) {
    return convertedValue.toExponential(6);
  }
  
  // For very large numbers, use scientific notation
  if (convertedValue > 1e16) {
    return convertedValue.toExponential(6);
  }
  
  // For values with many decimal places
  if (toFactor > fromFactor && toFactor - fromFactor > 6) {
    return convertedValue.toString();
  }
  
  // For normal values, display with appropriate precision
  const precision = Math.max(0, 6 - Math.floor(Math.log10(convertedValue)));
  return convertedValue.toFixed(precision).replace(/\.?0+$/, '');
};

// Utility function to convert between any two Ethereum units
export const convertEthUnit = (
  amount: string | number, 
  fromUnit: number, 
  toUnit: number
): string => {
  if (amount === '' || isNaN(Number(amount))) return '';
  
  const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
  const diffFactor = fromUnit - toUnit;
  
  if (diffFactor === 0) return amountNum.toString();
  
  const result = amountNum * Math.pow(10, diffFactor);
  return result.toString();
};
