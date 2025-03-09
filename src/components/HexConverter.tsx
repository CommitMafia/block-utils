
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Equal, X, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';

type ConversionType = 'hex' | 'decimal';

const HexConverter: React.FC = () => {
  const [inputType, setInputType] = useState<ConversionType>('hex');
  const [outputType, setOutputType] = useState<ConversionType>('decimal');
  const [inputValue, setInputValue] = useState<string>('');
  const [outputValue, setOutputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Validate input based on the selected type
  const validateInput = (value: string, type: ConversionType): boolean => {
    if (value.trim() === '') return true;
    
    if (type === 'hex') {
      // Remove '0x' prefix if present for validation
      const hexValue = value.toLowerCase().startsWith('0x') ? value.slice(2) : value;
      return /^[0-9A-Fa-f]+$/.test(hexValue);
    } else {
      return /^[0-9]+$/.test(value);
    }
  };

  // Convert values based on input and output types
  const convertValue = () => {
    if (inputValue.trim() === '') {
      setOutputValue('');
      return;
    }

    try {
      setErrorMessage('');
      
      if (inputType === 'hex' && outputType === 'decimal') {
        // Hex to Decimal
        // Handle '0x' prefix
        const hexValue = inputValue.toLowerCase().startsWith('0x') ? inputValue : `0x${inputValue}`;
        const decimalValue = parseInt(hexValue, 16);
        setOutputValue(decimalValue.toString());
      } else if (inputType === 'decimal' && outputType === 'hex') {
        // Decimal to Hex
        const hexValue = parseInt(inputValue, 10).toString(16).toUpperCase();
        setOutputValue(hexValue);
      } else {
        // Same type, just copy
        setOutputValue(inputValue);
      }
      
      toast.success('Conversion successful');
    } catch (error) {
      setErrorMessage('Invalid input for conversion');
      setOutputValue('Error');
      toast.error('Conversion failed');
    }
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (!validateInput(value, inputType)) {
      setErrorMessage(`Invalid ${inputType} input`);
    } else {
      setErrorMessage('');
      
      // Auto-convert on valid input
      if (value.trim() !== '') {
        try {
          if (inputType === 'hex' && outputType === 'decimal') {
            // Hex to Decimal
            // Handle '0x' prefix
            const hexValue = value.toLowerCase().startsWith('0x') ? value : `0x${value}`;
            const decimalValue = parseInt(hexValue, 16);
            setOutputValue(decimalValue.toString());
          } else if (inputType === 'decimal' && outputType === 'hex') {
            // Decimal to Hex
            const hexValue = parseInt(value, 10).toString(16).toUpperCase();
            setOutputValue(hexValue);
          } else {
            // Same type, just copy
            setOutputValue(value);
          }
        } catch (error) {
          setOutputValue('Error');
        }
      } else {
        setOutputValue('');
      }
    }
  };

  // Reset all values
  const handleReset = () => {
    setInputValue('');
    setOutputValue('');
    setErrorMessage('');
    toast.success('Values reset');
  };

  // Swap input and output types
  const handleSwap = () => {
    const tempType = inputType;
    setInputType(outputType);
    setOutputType(tempType);
    
    // Also swap the values if there's already a conversion
    if (inputValue && outputValue) {
      setInputValue(outputValue);
      setOutputValue(inputValue);
    }
    
    toast.success('Input and output types swapped');
  };

  // Update when type changes
  useEffect(() => {
    if (inputValue && !errorMessage) {
      handleInputChange(inputValue);
    }
  }, [inputType, outputType]);

  // Update label based on selected input type
  const getInputLabel = () => {
    return `Enter ${inputType === 'hex' ? 'hex' : 'decimal'} number`;
  };

  // Update label based on selected output type
  const getOutputLabel = () => {
    return `${outputType === 'hex' ? 'Hex' : 'Decimal'} number`;
  };

  return (
    <Card className="cyber-card overflow-hidden border-cyber-neon/50 shadow-[0_0_10px_rgba(15,255,80,0.3)] mb-8">
      <div className="border-b border-cyber-neon/20 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-cyber-neon font-mono text-sm">HEX_DECIMAL_CONVERTER</span>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="input-type" className="text-cyber-neon font-mono mb-2 block">From</Label>
            <Select value={inputType} onValueChange={(value) => setInputType(value as ConversionType)}>
              <SelectTrigger 
                id="input-type" 
                className="border-cyber-neon/30 bg-black/50 text-cyber-neon font-mono"
              >
                <SelectValue placeholder="Select input type" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-cyber-neon/30">
                <SelectItem value="hex" className="text-cyber-neon font-mono">Hexadecimal</SelectItem>
                <SelectItem value="decimal" className="text-cyber-neon font-mono">Decimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="output-type" className="text-cyber-neon font-mono mb-2 block">To</Label>
            <Select value={outputType} onValueChange={(value) => setOutputType(value as ConversionType)}>
              <SelectTrigger 
                id="output-type" 
                className="border-cyber-neon/30 bg-black/50 text-cyber-neon font-mono"
              >
                <SelectValue placeholder="Select output type" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-cyber-neon/30">
                <SelectItem value="hex" className="text-cyber-neon font-mono">Hexadecimal</SelectItem>
                <SelectItem value="decimal" className="text-cyber-neon font-mono">Decimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="input-value" className="text-cyber-neon font-mono mb-2 block">
              {getInputLabel()}
            </Label>
            <Input
              id="input-value"
              className="border-cyber-neon/30 bg-black/50 text-cyber-neon font-mono w-full"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={inputType === 'hex' ? '1A' : '26'}
            />
            {errorMessage && (
              <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            )}
          </div>
          
          <div className="flex space-x-2 py-4">
            <Button 
              onClick={convertValue} 
              className="bg-green-600 hover:bg-green-700 flex-1"
              disabled={!!errorMessage || inputValue === ''}
            >
              <Equal className="h-4 w-4 mr-2" />
              Convert
            </Button>
            
            <Button 
              onClick={handleReset}
              variant="outline" 
              className="border-cyber-neon/50 text-cyber-neon hover:bg-cyber-neon/10 flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            <Button 
              onClick={handleSwap}
              variant="outline" 
              className="border-cyber-neon/50 text-cyber-neon hover:bg-cyber-neon/10 flex-1"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Swap
            </Button>
          </div>
          
          <div>
            <Label htmlFor="output-value" className="text-cyber-neon font-mono mb-2 block">
              {getOutputLabel()}
            </Label>
            <Input
              id="output-value"
              className="border-cyber-neon/30 bg-black/50 text-cyber-neon font-mono w-full"
              value={outputValue}
              readOnly
              placeholder={outputType === 'hex' ? '1A' : '26'}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HexConverter;
