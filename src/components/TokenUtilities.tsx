
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ContractInput from '@/components/ContractInput';
import TokenInfo from '@/components/TokenInfo';
import FunctionList from '@/components/FunctionList';
import { useToken } from '@/hooks/useToken';
import { useAbi } from '@/hooks/useAbi';
import { Package2 } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';

const TokenUtilities: React.FC = () => {
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
    <div className="max-w-lg mx-auto w-full">
      <Card className="cyber-card overflow-hidden border-cyber-neon/50 shadow-[0_0_10px_rgba(15,255,80,0.3)] mb-8">
        <div className="border-b border-cyber-neon/20 p-4 flex items-center">
          <Package2 className="h-4 w-4 text-cyber-neon mr-2" />
          <span className="text-cyber-neon font-mono text-sm">TOKEN_UTILITIES</span>
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
    </div>
  );
};

export default TokenUtilities;
