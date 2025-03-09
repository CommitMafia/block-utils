
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ABIFunction, FunctionType, FunctionInput } from '@/lib/types';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { getChainById } from '@/lib/api';

interface FunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  func: ABIFunction;
  contractAddress: string;
  chainId: number;
  type: FunctionType;
}

// Modal for interacting with contract functions
const FunctionModal: React.FC<FunctionModalProps> = ({
  isOpen,
  onClose,
  func,
  contractAddress,
  chainId,
  type
}) => {
  const [inputs, setInputs] = useState<FunctionInput[]>(
    func.inputs.map(input => ({
      name: input.name,
      type: input.type,
      value: ''
    }))
  );
  const [result, setResult] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isConnected, address } = useWallet();
  const { toast } = useToast();

  // Update input value
  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index].value = value;
    setInputs(newInputs);
  };

  // Format result based on type
  const formatResult = (result: any): string => {
    if (result === null || result === undefined) return 'null';
    
    if (typeof result === 'object') {
      try {
        return JSON.stringify(result, null, 2);
      } catch (e) {
        return String(result);
      }
    }
    
    return String(result);
  };

  // Simulate a contract call
  const simulateContractCall = async (
    functionName: string, 
    functionInputs: FunctionInput[], 
    isReadFunction: boolean
  ): Promise<any> => {
    // In a real implementation, this would use ethers.js to call the contract
    console.log(`Calling ${functionName} with inputs:`, functionInputs);
    
    // Wait for 1-2 seconds to simulate network call
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // For read functions, return mock data based on function name
    if (isReadFunction) {
      switch (functionName.toLowerCase()) {
        case 'balanceof':
          return '1234500000000000000000'; // 1234.5 tokens
        case 'allowance':
          return '1000000000000000000'; // 1 token
        case 'totalsupply':
          return '1000000000000000000000000000'; // 1 billion tokens
        case 'decimals':
          return 18;
        case 'symbol':
          return 'TOKEN';
        case 'name':
          return 'Example Token';
        default:
          return Math.floor(Math.random() * 1000).toString();
      }
    } else {
      // For write functions, return a mock transaction hash
      return '0x' + Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
    }
  };

  // Execute function
  const executeFunction = async () => {
    // Reset previous state
    setResult(null);
    setError(null);
    
    // Check if wallet is connected for write functions
    if (type === 'write' && !isConnected) {
      toast({
        title: 'Wallet Required',
        description: 'Please connect your wallet to execute write functions',
        variant: 'destructive',
      });
      return;
    }
    
    setIsExecuting(true);
    
    try {
      // Get chain information
      const chain = getChainById(chainId);
      if (!chain) {
        throw new Error(`Chain with ID ${chainId} not supported`);
      }
      
      // For each input, validate and format according to its type
      const processedInputs = inputs.map(input => {
        // Basic input validation
        if (!input.value && input.type !== 'bool') {
          throw new Error(`Missing value for parameter: ${input.name}`);
        }
        
        // Return the input with its value
        return input;
      });
      
      // Simulate contract call
      const callResult = await simulateContractCall(
        func.name,
        processedInputs,
        type === 'read'
      );
      
      // Display the result
      setResult(formatResult(callResult));
      
      // Show success toast for write functions
      if (type === 'write') {
        toast({
          title: 'Transaction Submitted',
          description: 'Your transaction has been submitted to the blockchain',
        });
      }
    } catch (err: any) {
      console.error('Error executing function:', err);
      setError(err.message || 'Failed to execute function');
      toast({
        title: 'Error',
        description: err.message || 'Failed to execute function',
        variant: 'destructive',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Determine placeholder text based on parameter type
  const getPlaceholder = (type: string): string => {
    if (type.includes('int')) return 'Enter a number';
    if (type === 'address') return '0x...';
    if (type === 'bool') return 'true or false';
    if (type === 'string') return 'Enter text';
    return `Enter ${type}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] cyber-card">
        <DialogHeader>
          <DialogTitle className="text-xl">{func.name}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {func.inputs.length > 0 ? (
            func.inputs.map((input, index) => (
              <div key={`${input.name}-${index}`} className="space-y-2">
                <Label htmlFor={`input-${index}`}>
                  {input.name || `Input ${index + 1}`} ({input.type})
                </Label>
                <Input
                  id={`input-${index}`}
                  placeholder={getPlaceholder(input.type)}
                  value={inputs[index].value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="cyber-input"
                />
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">This function takes no inputs</div>
          )}
          
          {error && (
            <div className="text-red-500 text-sm mt-2 p-2 bg-red-500/10 rounded border border-red-500/20">
              {error}
            </div>
          )}
          
          {result !== null && (
            <div className="mt-4 space-y-2">
              <Label>Result</Label>
              <div className="p-2 border cyber-border rounded-md bg-muted/20 overflow-x-auto text-sm break-all font-mono">
                {result}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            onClick={executeFunction}
            disabled={isExecuting || (type === 'write' && !isConnected)}
            className="cyber-button"
          >
            {isExecuting ? 'Executing...' : `Execute ${func.name}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FunctionModal;
