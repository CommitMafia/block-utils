
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ContractInput from '@/components/ContractInput';
import TokenInfo from '@/components/TokenInfo';
import FunctionList from '@/components/FunctionList';
import ConnectWallet from '@/components/ConnectWallet';
import { useToken } from '@/hooks/useToken';
import { useAbi } from '@/hooks/useAbi';
import { Toaster } from '@/components/ui/sonner';
import { Terminal, Lock } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';

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
  const { isConnected } = useWallet();

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
    <div className="flex flex-col items-center justify-start min-h-screen pb-8 relative overflow-x-hidden">
      <header className="flex justify-between items-center py-4 px-6 bg-black/80 backdrop-blur-sm border-b border-cyber-neon/30 sticky top-0 z-10 w-full">
        <div className="w-10"></div>
        <h1 className="text-3xl font-mono text-cyber-neon text-center">
          {">_"} Token_Utils<span className="animate-pulse">⎸</span>
        </h1>
        <div className="min-w-[120px] flex justify-end">
          <ConnectWallet />
        </div>
      </header>
      
      <div className="text-center my-6">
        <p className="text-cyber-neon font-mono text-sm">{">>"} Decrypt · Analyze · Exploit</p>
      </div>
      
      <main className="container mx-auto px-4 space-y-6 max-w-lg">
        <Card className="cyber-card overflow-hidden border-cyber-neon/50 shadow-[0_0_10px_rgba(15,255,80,0.3)]">
          <div className="border-b border-cyber-neon/20 p-4 flex items-center">
            <Lock className="h-4 w-4 text-cyber-neon mr-2" />
            <span className="text-cyber-neon font-mono text-sm">SECURE_CONNECTION</span>
          </div>
          
          <CardContent className="p-4 space-y-4">
            <ContractInput 
              onSubmit={handleContractSubmit} 
              isLoading={isLoading} 
            />
            
            {!contractAddress && !isLoading && !isConnected && (
              <p className="text-center text-sm text-cyber-neon/60 font-mono mt-4">
                {">>"} Connect your wallet for full functionality {">>"} 
              </p>
            )}
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
      
      <footer className="absolute bottom-2 w-full text-center">
        <p className="text-cyber-neon/60 font-mono text-xs">System v1.33.7 // Secured Connection // 2025</p>
      </footer>
      <Toaster />
    </div>
  );
};

export default Index;
