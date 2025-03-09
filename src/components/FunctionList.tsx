
import React, { useState } from 'react';
import { ABIFunction, FunctionType } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import FunctionModal from './FunctionModal';

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
  
  // Render function item
  const renderFunctionItem = (func: ABIFunction, index: number) => (
    <div 
      key={`${func.name}-${index}`}
      className="px-4 py-3 border cyber-border my-2 rounded cursor-pointer hover:bg-accent/10 transition-colors"
      onClick={() => handleFunctionClick(func)}
    >
      <div className="font-medium text-sm">{func.name}</div>
      <div className="text-xs text-muted-foreground mt-1">
        {func.inputs.length === 0 
          ? 'No inputs' 
          : `Inputs: ${func.inputs.map(i => `${i.type} ${i.name}`).join(', ')}`
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
              <CardTitle className="text-lg">Read Functions</CardTitle>
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
              <CardTitle className="text-lg">Write Functions</CardTitle>
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
