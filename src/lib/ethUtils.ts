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
    // Start with a high precision
    const strWithDecimals = num.toFixed(30);
    
    // Find the first non-zero digit after decimal
    const parts = strWithDecimals.split('.');
    if (parts.length > 1) {
      const decimalPart = parts[1];
      let firstNonZeroIndex = -1;
      
      for (let i = 0; i < decimalPart.length; i++) {
        if (decimalPart[i] !== '0') {
          firstNonZeroIndex = i;
          break;
        }
      }
      
      if (firstNonZeroIndex >= 0) {
        // Keep a few more digits after the first non-zero digit for precision
        const significantDigits = firstNonZeroIndex + 8;
        str = num.toFixed(Math.min(significantDigits, 30));
      } else {
        str = '0';  // All zeros after decimal point
      }
    }
  } else {
    // Handle large numbers
    str = num.toLocaleString('fullwide', { useGrouping: false, maximumFractionDigits: 20 });
  }
  
  // Remove trailing zeros after decimal point but keep at least one digit
  return str.replace(/\.0+$|(\.\d*[1-9])0+$/, '$1');
};

// Format with appropriate precision based on number size
const formatWithPrecision = (num: number): string => {
  if (num === 0) return '0';
  
  // Determine appropriate precision based on the magnitude
  const absNum = Math.abs(num);
  let precision = 6;
  
  if (absNum < 0.000001) precision = 18;
  else if (absNum < 0.00001) precision = 15;
  else if (absNum < 0.0001) precision = 12;
  else if (absNum < 0.001) precision = 10;
  else if (absNum < 0.01) precision = 8;
  else if (absNum < 0.1) precision = 8;
  else if (absNum < 1) precision = 8;
  else if (absNum < 10) precision = 6;
  else if (absNum < 100) precision = 4;
  else if (absNum < 1000) precision = 2;
  else precision = 0;
  
  const result = num.toFixed(precision);
  
  // Remove trailing zeros after decimal point, but leave at least one digit
  return result.replace(/\.0+$|(\.\d*[1-9])0+$/, '$1');
};

// Utility function to convert between any two Ethereum units
export const convertEthUnit = (
  amount: string | number, 
  fromUnit: number, 
  toUnit: number
): string => {
  if (amount === '' || isNaN(Number(amount))) return '';
  
  const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (amountNum === 0) return '0';
  
  // Handle wei to gwei conversion specifically (common problem case)
  if (fromUnit === 0 && toUnit === 9) {
    return (amountNum * 0.000000001).toFixed(9).replace(/\.?0+$/, '');
  }
  
  // Handle gwei to wei conversion specifically
  if (fromUnit === 9 && toUnit === 0) {
    return (amountNum * 1000000000).toString();
  }
  
  // Handle other special cases with fixed conversion ratios
  if (fromUnit === 0 && toUnit === 18) {
    // Wei to Ether: 1 wei = 0.000000000000000001 ether
    return (amountNum * 0.000000000000000001).toFixed(18).replace(/\.?0+$/, '');
  }
  
  if (fromUnit === 18 && toUnit === 0) {
    // Ether to Wei: 1 ether = 1,000,000,000,000,000,000 wei
    return (amountNum * 1000000000000000000).toString();
  }
  
  const diffFactor = fromUnit - toUnit;
  
  if (diffFactor === 0) return amountNum.toString();
  
  // Use basic Math.pow for the conversion
  const result = amountNum * Math.pow(10, diffFactor);
  
  // For very small or very large results, use the special formatter
  if (Math.abs(result) < 1e-6 || Math.abs(result) > 1e16) {
    return formatWithZeros(result);
  }
  
  return formatWithPrecision(result);
};
