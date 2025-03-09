
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
  
  const { isConnected, address } = useWallet();
  const { toast } = useToast();

  // Update input value
  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index].value = value;
    setInputs(newInputs);
  };

  // Execute function
  const executeFunction = async () => {
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
    setResult(null);
    
    try {
      // In a real implementation, this would use ethers.js or web3.js to call the contract
      // For now, simulate the call with a timeout
      setTimeout(() => {
        if (type === 'read') {
          // Simulate read function result
          setResult(JSON.stringify({ result: '123456789000000000000' }));
        } else {
          // Simulate transaction hash for write function
          setResult('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
          toast({
            title: 'Transaction Submitted',
            description: 'Your transaction has been submitted to the blockchain',
          });
        }
        setIsExecuting(false);
      }, 1500);
    } catch (error) {
      console.error('Error executing function:', error);
      toast({
        title: 'Error',
        description: 'Failed to execute function',
        variant: 'destructive',
      });
      setIsExecuting(false);
    }
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
                  placeholder={`Enter ${input.type}`}
                  value={inputs[index].value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="cyber-input"
                />
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">This function takes no inputs</div>
          )}
          
          {result && (
            <div className="mt-4 space-y-2">
              <Label>Result</Label>
              <div className="p-2 border cyber-border rounded-md bg-muted/20 overflow-x-auto text-sm break-all">
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
