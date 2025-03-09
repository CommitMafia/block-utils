
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ContractInput from '@/components/ContractInput';
import TokenInfo from '@/components/TokenInfo';
import FunctionList from '@/components/FunctionList';
import ConnectWallet from '@/components/ConnectWallet';
import ThemeToggle from '@/components/ThemeToggle';
import { useToken } from '@/hooks/useToken';
import { useAbi } from '@/hooks/useAbi';
import { WalletProvider } from '@/context/WalletContext';
import { Toaster } from '@/components/ui/sonner';

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
      <div className="min-h-screen pb-8">
        <header className="flex justify-between items-center py-4 px-4">
          <div className="w-10"></div> {/* Spacer for centering */}
          <h1 className="text-2xl font-bold bg-cyber-gradient text-transparent bg-clip-text animate-gradient-flow">
            Token Utils
          </h1>
          <ThemeToggle />
        </header>
        
        <main className="container mx-auto px-4 space-y-6 max-w-md">
          <Card className="cyber-card overflow-hidden">
            <CardContent className="p-4">
              <ContractInput 
                onSubmit={handleContractSubmit} 
                isLoading={isLoading} 
              />
            </CardContent>
          </Card>
          
          <ConnectWallet />
          
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
