
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ContractInput from '@/components/ContractInput';
import TokenInfo from '@/components/TokenInfo';
import FunctionList from '@/components/FunctionList';
import ConnectWallet from '@/components/ConnectWallet';
import { useToken } from '@/hooks/useToken';
import { useAbi } from '@/hooks/useAbi';
import { WalletProvider } from '@/context/WalletContext';
import { Toaster } from '@/components/ui/sonner';
import { Terminal, Zap } from 'lucide-react';

const Index = () => {
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
  const { tokenInfo, isLoading: tokenLoading, fetchTokenInfo } = useToken();
  const { 
    readFunctions,
    writeFunctions,
    isLoading: abiLoading, 
    fetchAbi 
  } = useAbi();

  // Determine overall loading state
  const isLoading = tokenLoading || abiLoading;

  // Handle contract submission
  const handleContractSubmit = async (address: string, chainId: number) => {
    setContractAddress(address);
    setSelectedChainId(chainId);
    
    // Fetch token info and ABI in parallel
    await Promise.all([
      fetchTokenInfo(address, chainId),
      fetchAbi(address, chainId)
    ]);
  };

  return (
    <WalletProvider>
      <div className="min-h-screen pb-8 relative overflow-x-hidden">
        <header className="flex justify-between items-center py-4 px-4">
          <div className="w-10 flex items-center">
            <Terminal className="h-5 w-5 text-cyber-neon" />
          </div>
          <h1 className="text-2xl font-bold cyber-title flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyber-neon" />
            Token Utils
          </h1>
          <ConnectWallet />
        </header>
        
        <main className="container mx-auto px-4 space-y-6 max-w-md">
          <Card className="cyber-card overflow-hidden border-cyber-neon/50">
            <CardContent className="p-4">
              <ContractInput 
                onSubmit={handleContractSubmit} 
                isLoading={isLoading} 
              />
            </CardContent>
          </Card>
          
          {tokenInfo && (
            <div className="space-y-6 animate-fade-in">
              <TokenInfo tokenInfo={tokenInfo} />
              
              {contractAddress && selectedChainId && (
                <FunctionList 
                  readFunctions={readFunctions}
                  writeFunctions={writeFunctions}
                  contractAddress={contractAddress}
                  chainId={selectedChainId}
                />
              )}
            </div>
          )}
        </main>
      </div>
      <Toaster />
    </WalletProvider>
  );
};

export default Index;
