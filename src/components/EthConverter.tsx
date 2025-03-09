
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coins, RefreshCw } from 'lucide-react';
import { formatValue, convertEthUnit } from '@/lib/ethUtils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Define ETH units with their factors (power of 10)
const ETH_UNITS = [
  { name: 'Wei', factor: 0, alternativeNames: [] },
  { name: 'Kwei / Babbage / Femtoether', factor: 3, alternativeNames: ['Babbage', 'Femtoether'] },
  { name: 'Mwei / Lovelace / Picoether', factor: 6, alternativeNames: ['Lovelace', 'Picoether'] },
  { name: 'Gwei / Shannon / Nanoether / Nano', factor: 9, alternativeNames: ['Shannon', 'Nanoether', 'Nano'] },
  { name: 'Szabo / Microether / Micro', factor: 12, alternativeNames: ['Microether', 'Micro'] },
  { name: 'Finney / Milliether / Milli', factor: 15, alternativeNames: ['Milliether', 'Milli'] },
  { name: 'Ether', factor: 18, alternativeNames: [] },
  { name: 'Kether / Grand', factor: 21, alternativeNames: ['Grand'] },
  { name: 'Mether', factor: 24, alternativeNames: [] },
  { name: 'Gether', factor: 27, alternativeNames: [] },
  { name: 'Tether', factor: 30, alternativeNames: [] },
];

const EthConverter: React.FC = () => {
  // State to store values for each unit
  const [values, setValues] = useState<{ [key: number]: string }>({});
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<string>('0.00');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeUnit, setActiveUnit] = useState<number | null>(null);

  // Initialize with empty values
  useEffect(() => {
    // Fetch ETH price
    fetchEthPrice();
  }, []);

  // Reset all values
  const handleReset = () => {
    setValues({});
    setTotalPrice('0.00');
    setActiveUnit(null);
    toast.success('All values have been reset');
  };

  // Fetch current ETH price
  const fetchEthPrice = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD');
      const data = await response.json();
      setEthPrice(data.USD);
      
      // Update the USD price based on the new ETH price
      const etherValue = values[18] || '0';
      if (etherValue && !isNaN(parseFloat(etherValue))) {
        const price = parseFloat(etherValue) * data.USD;
        setTotalPrice(price.toFixed(2));
      }
      
      toast.success('ETH price updated successfully');
    } catch (error) {
      console.error('Error fetching ETH price:', error);
      // Fallback price if API fails
      setEthPrice(2140.66);
      toast.error('Failed to fetch ETH price, using fallback value');
    } finally {
      setIsLoading(false);
    }
  };

  // Update USD price when ether value changes
  useEffect(() => {
    const etherValue = values[18] || '0';
    if (ethPrice && etherValue && !isNaN(parseFloat(etherValue))) {
      const price = parseFloat(etherValue) * ethPrice;
      setTotalPrice(price.toFixed(2));
    } else {
      setTotalPrice('0.00');
    }
  }, [values[18], ethPrice]);

  // Handle input change for any unit
  const handleInputChange = (factor: number, value: string) => {
    // Only accept valid numbers or empty strings
    if (value === '' || /^[0-9.]+$/.test(value)) {
      setActiveUnit(factor);
      
      // If input is cleared, clear all fields
      if (value === '') {
        setValues({});
        return;
      }
      
      // Store the current input value
      const newValues: { [key: number]: string } = {};
      newValues[factor] = value;
      
      // Only proceed with calculations if we have a valid number
      if (!isNaN(parseFloat(value))) {
        const numValue = parseFloat(value);
        
        // Calculate conversions for all other units
        ETH_UNITS.forEach(unit => {
          if (unit.factor !== factor) {
            const convertedValue = convertEthUnit(numValue, factor, unit.factor);
            newValues[unit.factor] = convertedValue;
          }
        });
      }
      
      // Update all values at once to prevent partial updates
      setValues(newValues);
    }
  };

  return (
    <Card className="cyber-card overflow-hidden border-cyber-neon/50 shadow-[0_0_10px_rgba(15,255,80,0.3)] mb-8">
      <div className="border-b border-cyber-neon/20 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Coins className="h-4 w-4 text-cyber-neon mr-2" />
          <span className="text-cyber-neon font-mono text-sm">ETH_CONVERTER</span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchEthPrice} 
            disabled={isLoading}
            className="border-cyber-neon/50 text-cyber-neon hover:bg-cyber-neon/10 h-8 px-2"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Updating...' : 'Update Price'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleReset} 
            className="border-cyber-neon/50 text-cyber-neon hover:bg-cyber-neon/10 h-8 px-2"
          >
            Clear
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {ETH_UNITS.map((unit) => (
            <div 
              key={unit.factor} 
              className={`grid grid-cols-1 md:grid-cols-3 gap-4 items-center cyber-panel p-4 rounded-md ${activeUnit === unit.factor ? 'border border-cyber-neon' : ''}`}
            >
              <div>
                <Label htmlFor={`unit-${unit.factor}`} className="text-cyber-neon font-mono">
                  {unit.name}
                </Label>
                <p className="text-cyber-neon/60 text-xs font-mono">(10^{unit.factor})</p>
              </div>
              <div className="md:col-span-2">
                <Input
                  id={`unit-${unit.factor}`}
                  className="border-cyber-neon/30 bg-black/50 text-cyber-neon font-mono"
                  value={values[unit.factor] || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => 
                    handleInputChange(unit.factor, e.target.value)
                  }
                  onFocus={() => setActiveUnit(unit.factor)}
                  placeholder="0"
                />
                {unit.factor === 18 && values[18] && ethPrice && (
                  <p className="text-cyber-neon/80 text-xs mt-1 font-mono">
                    ≈ ${(parseFloat(values[18]) * ethPrice).toFixed(2)} USD
                  </p>
                )}
              </div>
            </div>
          ))}
          
          <div className="cyber-panel p-4 rounded-md mt-6 bg-cyber-neon/5 border border-cyber-neon/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <Label className="text-cyber-neon font-bold font-mono">
                  USD Value
                </Label>
                <p className="text-cyber-neon/60 text-xs font-mono">
                  ({ethPrice ? `$${ethPrice.toFixed(2)}` : '$0.00'} Per Ether)
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="text-cyber-neon text-xl font-bold font-mono bg-black/30 p-3 rounded-md border border-cyber-neon/20">
                  $ {totalPrice}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EthConverter;
