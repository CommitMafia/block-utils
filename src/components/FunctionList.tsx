
import React, { useState } from 'react';
import { ABIFunction, FunctionType } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import FunctionModal from './FunctionModal';
import { FileCode, Eye, Pencil } from 'lucide-react';

interface FunctionListProps {
  readFunctions: ABIFunction[];
  writeFunctions: ABIFunction[];
  contractAddress: string;
  chainId: number;
}

// Component to display ABI functions
const FunctionList: React.FC<FunctionListProps> = ({
  readFunctions,
  writeFunctions,
  contractAddress,
  chainId
}) => {
  const [activeTab, setActiveTab] = useState<FunctionType>('read');
  const [selectedFunction, setSelectedFunction] = useState<ABIFunction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Handle function selection
  const handleFunctionClick = (func: ABIFunction) => {
    setSelectedFunction(func);
    setIsModalOpen(true);
  };
  
  // Get description for common ERC20 functions
  const getFunctionDescription = (func: ABIFunction): string => {
    const commonFunctions: Record<string, string> = {
      'balanceOf': 'Get the token balance of an account',
      'transfer': 'Transfer tokens to an address',
      'transferFrom': 'Transfer tokens from one address to another',
      'approve': 'Approve an address to spend tokens',
      'allowance': 'Check how many tokens an address can spend',
      'totalSupply': 'Get the total token supply',
      'name': 'Get the token name',
      'symbol': 'Get the token symbol',
      'decimals': 'Get the token decimals',
      'owner': 'Get the contract owner',
      'mint': 'Create new tokens',
      'burn': 'Destroy tokens',
      'pause': 'Pause token transfers',
      'unpause': 'Unpause token transfers'
    };
    
    return commonFunctions[func.name] || '';
  };
  
  // Render function item
  const renderFunctionItem = (func: ABIFunction, index: number) => {
    const description = getFunctionDescription(func);
    
    return (
      <div 
        key={`${func.name}-${index}`}
        className="px-4 py-3 border cyber-border my-2 rounded cursor-pointer hover:bg-accent/10 transition-colors"
        onClick={() => handleFunctionClick(func)}
      >
        <div className="font-medium text-sm flex items-center gap-2">
          {activeTab === 'read' ? (
            <Eye className="h-3.5 w-3.5 text-cyan-400" />
          ) : (
            <Pencil className="h-3.5 w-3.5 text-amber-400" />
          )}
          {func.name}
        </div>
        
        {description && (
          <div className="text-xs text-cyber-neon/60 mt-1">
            {description}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-1">
          {func.inputs.length === 0 
            ? 'No inputs' 
            : `Inputs: ${func.inputs.map(i => `${i.type} ${i.name || ''}`).join(', ')}`
          }
        </div>
        
        <div className="text-xs text-muted-foreground mt-1">
          {func.outputs.length === 0 
            ? 'No outputs' 
            : `Outputs: ${func.outputs.map(o => o.type).join(', ')}`
          }
        </div>
      </div>
    );
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FunctionType)} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="read">Read Functions</TabsTrigger>
          <TabsTrigger value="write">Write Functions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="read" className="mt-0">
          <Card className="cyber-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-4 w-4 text-cyber-neon" />
                Read Functions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {readFunctions.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">No read functions available</div>
              ) : (
                readFunctions.map(renderFunctionItem)
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="write" className="mt-0">
          <Card className="cyber-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Pencil className="h-4 w-4 text-cyber-neon" />
                Write Functions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {writeFunctions.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">No write functions available</div>
              ) : (
                writeFunctions.map(renderFunctionItem)
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedFunction && (
        <FunctionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          func={selectedFunction}
          contractAddress={contractAddress}
          chainId={chainId}
          type={activeTab}
        />
      )}
    </>
  );
};

export default FunctionList;
