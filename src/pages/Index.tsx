
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ContractInput from '@/components/ContractInput';
import TokenInfo from '@/components/TokenInfo';
import FunctionList from '@/components/FunctionList';
import ConnectWallet from '@/components/ConnectWallet';
import { useToken } from '@/hooks/useToken';
import { useAbi } from '@/hooks/useAbi';
import { Toaster } from '@/components/ui/sonner';
import { Terminal, Lock, FileCode, Hash, Coins, Package2 } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import FunctionalityBox from '@/components/FunctionalityBox';

// Functionality options
const functionalityOptions = [
  {
    id: 'token-utilities',
    title: 'Token Utilities',
    description: 'Analyze token contracts and interact with functions',
    icon: Package2
  },
  {
    id: 'contract-execution',
    title: 'Contract Execution',
    description: 'Execute contract functions directly',
    icon: FileCode
  },
  {
    id: 'hex-converter',
    title: 'Hex Converter',
    description: 'Convert between hexadecimal and decimal values',
    icon: Hash
  },
  {
    id: 'eth-converter',
    title: 'ETH Converter',
    description: 'Convert between ETH, WEI, GWEI and other denominations',
    icon: Coins
  }
];

const Index = () => {
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
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

  // Set which feature to view
  const handleFeatureSelect = (featureId: string) => {
    setActiveFeature(featureId);
  };

  // Render token utilities feature (original app functionality)
  const renderTokenUtilities = () => {
    return (
      <>
        <Card className="cyber-card overflow-hidden border-cyber-neon/50 shadow-[0_0_10px_rgba(15,255,80,0.3)] mb-8">
          <div className="border-b border-cyber-neon/20 p-4 flex items-center">
            <Lock className="h-4 w-4 text-cyber-neon mr-2" />
            <span className="text-cyber-neon font-mono text-sm">SECURE_CONNECTION</span>
          </div>
          
          <CardContent className="p-6">
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
          <div className="space-y-8 animate-fade-in">
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
      </>
    );
  };

  // Render placeholder for other features
  const renderPlaceholder = (featureId: string) => {
    const feature = functionalityOptions.find(f => f.id === featureId);
    if (!feature) return null;
    
    return (
      <Card className="cyber-card border-cyber-neon/50 shadow-[0_0_10px_rgba(15,255,80,0.3)]">
        <CardContent className="p-8 text-center">
          <feature.icon className="h-12 w-12 text-cyber-neon mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-cyber-neon mb-2">{feature.title}</h2>
          <p className="text-cyber-neon/70 mb-4">Coming soon! This feature is under development.</p>
          <button 
            onClick={() => setActiveFeature(null)} 
            className="border-2 border-cyber-neon bg-black text-cyber-neon font-mono shadow-[0_0_15px_rgba(15,255,80,0.7)] hover:shadow-[0_0_25px_rgba(15,255,80,0.9)] transition-all px-4 py-2 rounded"
          >
            Return to Dashboard
          </button>
        </CardContent>
      </Card>
    );
  };

  // Main render function
  return (
    <div className="flex flex-col items-center min-h-screen relative overflow-x-hidden">
      <header className="flex justify-between items-center py-4 px-6 bg-black/80 backdrop-blur-sm border-b border-cyber-neon/30 sticky top-0 z-10 w-full">
        <div className="w-10"></div>
        <h1 className="text-3xl font-mono text-cyber-neon text-center">
          {">_"} Web3_Utilities<span className="animate-pulse">⎸</span>
        </h1>
        <div className="min-w-[120px] flex justify-end">
          <ConnectWallet />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        {activeFeature === null ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {functionalityOptions.map((option) => (
              <FunctionalityBox
                key={option.id}
                title={option.title}
                description={option.description}
                icon={<option.icon className="h-8 w-8" />}
                onClick={() => handleFeatureSelect(option.id)}
              />
            ))}
          </div>
        ) : activeFeature === 'token-utilities' ? (
          <div className="max-w-lg mx-auto w-full">
            {renderTokenUtilities()}
          </div>
        ) : (
          <div className="max-w-lg mx-auto w-full">
            {renderPlaceholder(activeFeature)}
          </div>
        )}
      </main>
      
      <footer className="w-full text-center py-6">
        <p className="text-cyber-neon/60 font-mono text-xs">System v1.33.7 // Secured Connection // 2025</p>
      </footer>
      <Toaster />
    </div>
  );
};

export default Index;
