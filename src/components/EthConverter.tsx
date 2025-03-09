
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coins } from 'lucide-react';
import { formatValue, convertEthUnit } from '@/lib/ethUtils';

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

  // Initialize with default values (1 Ether)
  useEffect(() => {
    const initialValues: { [key: number]: string } = {};
    ETH_UNITS.forEach(unit => {
      if (unit.factor === 18) { // Ether
        initialValues[unit.factor] = '1';
      } else {
        initialValues[unit.factor] = formatValue(1, 18, unit.factor);
      }
    });
    setValues(initialValues);
    
    // Fetch ETH price
    fetchEthPrice();
  }, []);

  // Fetch current ETH price
  const fetchEthPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json();
      setEthPrice(data.ethereum.usd);
    } catch (error) {
      console.error('Error fetching ETH price:', error);
      // Fallback price if API fails
      setEthPrice(2140.66);
    }
  };

  // Update USD price when ether value changes
  useEffect(() => {
    const etherValue = values[18] || '0';
    if (ethPrice && etherValue) {
      const price = parseFloat(etherValue) * ethPrice;
      setTotalPrice(price.toFixed(2));
    }
  }, [values, ethPrice]);

  // Handle input change for any unit
  const handleInputChange = (factor: number, value: string) => {
    if (value === '' || /^[0-9.]+$/.test(value)) {
      const newValues: { [key: number]: string } = { ...values };
      newValues[factor] = value;
      
      // If the value is valid, update all other inputs based on this value
      if (value !== '' && !isNaN(parseFloat(value))) {
        const numValue = parseFloat(value);
        
        ETH_UNITS.forEach(unit => {
          if (unit.factor !== factor) {
            newValues[unit.factor] = formatValue(numValue, factor, unit.factor);
          }
        });
      }
      
      setValues(newValues);
    }
  };

  return (
    <Card className="cyber-card overflow-hidden border-cyber-neon/50 shadow-[0_0_10px_rgba(15,255,80,0.3)]">
      <div className="border-b border-cyber-neon/20 p-4 flex items-center">
        <Coins className="h-4 w-4 text-cyber-neon mr-2" />
        <span className="text-cyber-neon font-mono text-sm">ETH_CONVERTER</span>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {ETH_UNITS.map((unit) => (
            <div key={unit.factor} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <Label htmlFor={`unit-${unit.factor}`} className="text-cyber-neon">
                  {unit.name}
                </Label>
                <p className="text-cyber-neon/60 text-xs">(factor: {unit.factor})</p>
              </div>
              <div className="md:col-span-2">
                <Input
                  id={`unit-${unit.factor}`}
                  className="border-cyber-neon/30 bg-black/50 text-cyber-neon"
                  value={values[unit.factor] || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => 
                    handleInputChange(unit.factor, e.target.value)
                  }
                  placeholder="0"
                />
              </div>
            </div>
          ))}
          
          <div className="border-t border-cyber-neon/20 pt-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <Label className="text-cyber-neon font-bold">
                  Total Price
                </Label>
                <p className="text-cyber-neon/60 text-xs">
                  ({ethPrice ? ethPrice.toFixed(2) : '0.00'} $ Per Ether)
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="text-cyber-neon text-xl font-bold">
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
