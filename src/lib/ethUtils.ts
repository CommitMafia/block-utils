/**
 * Utility functions for Ethereum unit conversions
 */

// Format a value from one ETH unit to another
export const formatValue = (value: number, fromFactor: number, toFactor: number): string => {
  if (value === 0) return '0';
  
  // Calculate the power difference for conversion
  const diffFactor = fromFactor - toFactor;
  
  // Handle special case for wei to gwei conversion (most common precision issue)
  if (fromFactor === 0 && toFactor === 9) {
    // Exact conversion: 1 wei = 0.000000001 gwei
    return (value * 0.000000001).toFixed(9).replace(/\.?0+$/, '');
  }
  
  // Convert from source unit to target unit directly
  const conversion = value * Math.pow(10, diffFactor);
  
  // For very large or very small numbers
  if (Math.abs(conversion) < 1e-6 || Math.abs(conversion) > 1e16) {
    // Instead of scientific notation, format with actual zeros
    return formatWithZeros(conversion);
  }
  
  // For normal values, display with appropriate precision
  return formatWithPrecision(conversion);
};

// Format a number with actual zeros instead of scientific notation
const formatWithZeros = (num: number): string => {
  if (num === 0) return '0';
  
  // Convert to string without scientific notation
  let str = '';
  
  // Handle small numbers that would normally use scientific notation
  if (Math.abs(num) < 1) {
    // Convert small number to string with fixed decimals
    str = num.toFixed(20);
    
    // Find the first non-zero digit after decimal
    const firstNonZeroIndex = str.substring(2).search(/[1-9]/);
    
    if (firstNonZeroIndex >= 0) {
      // Keep a few more digits after the first non-zero digit
      const significantDigits = firstNonZeroIndex + 8;
      str = num.toFixed(significantDigits);
    }
  } else {
    // Handle large numbers
    str = num.toLocaleString('fullwide', { useGrouping: false, maximumFractionDigits: 20 });
  }
  
  // Remove trailing zeros after decimal point
  return str.replace(/\.?0+$/, '');
};

// Format with appropriate precision based on number size
const formatWithPrecision = (num: number): string => {
  if (num === 0) return '0';
  
  // Determine appropriate precision based on the magnitude
  const absNum = Math.abs(num);
  let precision = 6;
  
  if (absNum < 0.1) precision = 10;
  else if (absNum < 1) precision = 8;
  else if (absNum < 10) precision = 6;
  else if (absNum < 100) precision = 4;
  else precision = 2;
  
  const result = num.toFixed(precision);
  
  // Remove trailing zeros after decimal point
  return result.replace(/\.?0+$/, '');
};

// Utility function to convert between any two Ethereum units
export const convertEthUnit = (
  amount: string | number, 
  fromUnit: number, 
  toUnit: number
): string => {
  if (amount === '' || isNaN(Number(amount))) return '';
  
  const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Special case for wei to gwei conversion to avoid floating point precision issues
  if (fromUnit === 0 && toUnit === 9) {
    const result = amountNum * 0.000000001;
    return result.toFixed(9).replace(/\.?0+$/, '') || '0';
  }
  
  // Special case for gwei to wei conversion
  if (fromUnit === 9 && toUnit === 0) {
    const result = amountNum * 1000000000;
    return result.toString();
  }
  
  const diffFactor = fromUnit - toUnit;
  
  if (diffFactor === 0) return amountNum.toString();
  
  const result = amountNum * Math.pow(10, diffFactor);
  
  // For very small or very large results, use the special formatter
  if (Math.abs(result) < 1e-6 || Math.abs(result) > 1e16) {
    return formatWithZeros(result);
  }
  
  return formatWithPrecision(result);
};
