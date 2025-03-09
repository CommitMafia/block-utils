/**
 * Utility functions for Ethereum unit conversions
 */

// Format a value from one ETH unit to another
export const formatValue = (value: number, fromFactor: number, toFactor: number): string => {
  if (value === 0) return '0';
  
  // Convert from source unit to target unit directly
  const conversion = value * Math.pow(10, fromFactor - toFactor);
  
  // For very large or very small numbers
  if (Math.abs(conversion) < 1e-6 || Math.abs(conversion) > 1e16) {
    // Instead of scientific notation, format with actual zeros
    return formatWithZeros(conversion);
  }
  
  // For normal values, display with appropriate precision
  const precision = Math.max(0, 6 - Math.floor(Math.log10(Math.abs(conversion))));
  return conversion.toFixed(precision).replace(/\.?0+$/, '');
};

// Format a number with actual zeros instead of scientific notation
const formatWithZeros = (num: number): string => {
  if (num === 0) return '0';
  
  // Handle small numbers that would normally use scientific notation
  if (Math.abs(num) < 1) {
    const str = num.toFixed(40); // Use plenty of decimal places
    // Remove trailing zeros but keep necessary zeros after decimal point
    return str.replace(/\.?0+$/, '');
  }
  
  // Handle large numbers
  if (num > 1e16) {
    // Convert to string with full representation
    return num.toLocaleString('fullwide', { useGrouping: false });
  }
  
  return num.toString();
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
  return formatWithZeros(result);
};
