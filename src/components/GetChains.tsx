
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ChainInfo } from '@/lib/types';
import { Copy, ExternalLink, Search, Plus } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';

const fetchChainData = async (chainId: string): Promise<ChainInfo> => {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/chains/eip155-${chainId}.json`);
    if (!response.ok) {
      throw new Error('Chain not found');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch chain data');
  }
};

const fetchPopularChains = async (): Promise<ChainInfo[]> => {
  const popularChainIds = ['1', '56', '137', '42161', '10', '43114', '8453', '324', '1101', '59144'];
  
  const chainPromises = popularChainIds.map(id => 
    fetch(`https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/chains/eip155-${id}.json`)
      .then(res => res.ok ? res.json() : null)
      .catch(() => null)
  );
  
  const results = await Promise.all(chainPromises);
  return results.filter(Boolean) as ChainInfo[];
};

const DiscoverChains: React.FC = () => {
  const [chainId, setChainId] = useState<string>('');
  const [debouncedChainId, setDebouncedChainId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('search');
  const { isConnected } = useWallet();
  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (chainId.trim()) {
        setDebouncedChainId(chainId);
      }
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [chainId]);
  
  const { 
    data: chainData, 
    isLoading: isLoadingChain,
    isError: isChainError,
  } = useQuery({
    queryKey: ['chain', debouncedChainId],
    queryFn: () => fetchChainData(debouncedChainId),
    enabled: debouncedChainId.length > 0,
  });
  
  const { 
    data: popularChains, 
    isLoading: isLoadingPopular 
  } = useQuery({
    queryKey: ['popularChains'],
    queryFn: fetchPopularChains,
  });
  
  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${description} copied to clipboard`);
  };
  
  const addChainToWallet = async (chain: ChainInfo) => {
    if (!window.ethereum) {
      toast.error("No wallet provider detected. Please install a wallet extension.");
      return;
    }
    
    try {
      // Filter out RPC URLs with variables or specific providers like INFURA
      const validRpcUrls = chain.rpc
        .filter(url => !url.includes('${') && !url.includes('INFURA'))
        .map(url => url.trim());
      
      if (validRpcUrls.length === 0) {
        toast.error("No valid RPC URL found for this chain.");
        return;
      }
      
      // Prepare the chain data in the format expected by wallet providers
      const chainData = {
        chainId: `0x${parseInt(chain.chainId).toString(16)}`,
        chainName: chain.name,
        nativeCurrency: chain.nativeCurrency,
        rpcUrls: [validRpcUrls[0]], // Use the first valid RPC
        blockExplorerUrls: chain.explorers ? [chain.explorers[0].url] : undefined
      };
      
      // Request wallet to add the new chain
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [chainData],
      });
      
      toast.success(`${chain.name} added to wallet.`);
    } catch (error) {
      console.error("Error adding chain to wallet:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add chain to wallet");
    }
  };
  
  const renderChainDetails = (chain: ChainInfo) => (
    <Card className="border-cyber-neon/30 shadow-[0_0_10px_rgba(15,255,80,0.2)] mb-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-cyber-neon flex items-center">
            {chain.name}
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-6 w-6 text-cyber-neon/70 hover:text-cyber-neon"
              onClick={() => copyToClipboard(chain.name, 'Chain name')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardTitle>
          {chain.explorers && chain.explorers.length > 0 && (
            <a
              href={chain.explorers[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-neon/70 hover:text-cyber-neon flex items-center"
            >
              Explorer <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          )}
        </div>
        <CardDescription className="text-cyber-neon/70">
          Chain ID: {chain.chainId} | Native Currency: {chain.nativeCurrency.symbol}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-cyber-neon/90">RPC Endpoints</Label>
            <ScrollArea className="h-40 w-full rounded-md border border-cyber-neon/30 p-2 mt-1">
              {chain.rpc.map((rpc, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <code className="text-xs text-cyber-neon/80 truncate max-w-[240px]">
                    {rpc.replace(/\${(.*?)}/g, '')}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-cyber-neon/70 hover:text-cyber-neon"
                    onClick={() => copyToClipboard(rpc.replace(/\${(.*?)}/g, ''), 'RPC URL')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </ScrollArea>
          </div>
          
          <div>
            <Label className="text-cyber-neon/90">Network Details</Label>
            <div className="mt-1 space-y-2">
              <div className="flex justify-between">
                <span className="text-cyber-neon/70">Network Name:</span>
                <code className="text-xs text-cyber-neon/80">{chain.name}</code>
              </div>
              <Separator className="bg-cyber-neon/20" />
              <div className="flex justify-between">
                <span className="text-cyber-neon/70">Chain ID:</span>
                <code className="text-xs text-cyber-neon/80">{chain.chainId}</code>
              </div>
              <Separator className="bg-cyber-neon/20" />
              <div className="flex justify-between">
                <span className="text-cyber-neon/70">Currency Symbol:</span>
                <code className="text-xs text-cyber-neon/80">{chain.nativeCurrency.symbol}</code>
              </div>
              <Separator className="bg-cyber-neon/20" />
              <div className="flex justify-between">
                <span className="text-cyber-neon/70">Decimals:</span>
                <code className="text-xs text-cyber-neon/80">{chain.nativeCurrency.decimals}</code>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-2 pt-2">
        <Button 
          variant="outline" 
          className="text-cyber-neon border-cyber-neon/50 hover:bg-cyber-neon/10"
          onClick={() => {
            const walletData = {
              chainId: `0x${parseInt(chain.chainId).toString(16)}`,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: chain.rpc.filter(url => !url.includes('${') && !url.includes('INFURA')),
              blockExplorerUrls: chain.explorers ? [chain.explorers[0].url] : undefined
            };
            copyToClipboard(JSON.stringify(walletData, null, 2), 'Wallet configuration');
          }}
        >
          Copy Wallet Configuration
        </Button>
        
        <Button 
          variant="outline" 
          className="text-cyber-neon border-cyber-neon/50 hover:bg-cyber-neon/10"
          onClick={() => addChainToWallet(chain)}
          disabled={!isConnected}
        >
          <Plus className="h-4 w-4 mr-1" /> Add to Wallet
        </Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <div className="max-w-4xl mx-auto">
      <Tabs 
        defaultValue="search" 
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-black border border-cyber-neon/30">
          <TabsTrigger value="search" className="data-[state=active]:bg-cyber-neon/10 data-[state=active]:text-cyber-neon">Search Chain</TabsTrigger>
          <TabsTrigger value="popular" className="data-[state=active]:bg-cyber-neon/10 data-[state=active]:text-cyber-neon">Popular Chains</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="space-y-4">
          <div className="flex space-x-2 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter Chain ID (e.g., 1 for Ethereum)"
                value={chainId}
                onChange={(e) => setChainId(e.target.value)}
                className="border-cyber-neon/30 bg-black text-cyber-neon focus-visible:ring-cyber-neon/30"
              />
            </div>
            <div className="hidden">
              <Button 
                className="bg-cyber-neon text-black hover:bg-cyber-neon/90"
                disabled={isLoadingChain}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
          
          {isLoadingChain && (
            <p className="text-center text-cyber-neon/70">Loading chain data...</p>
          )}
          
          {isChainError && chainId.trim() !== '' && (
            <Card className="border-red-500/30 shadow-[0_0_10px_rgba(255,0,0,0.2)]">
              <CardContent className="p-4 text-center">
                <p className="text-red-400">Chain not found. Please verify the chain ID and try again.</p>
              </CardContent>
            </Card>
          )}
          
          {chainData && renderChainDetails(chainData)}
          
          {!chainId && popularChains && popularChains.length > 0 && (
            <div className="mt-4">
              <h3 className="text-cyber-neon mb-4 text-center">Top 10 Popular Chains</h3>
              <div className="space-y-6">
                {popularChains.map((chain) => (
                  <div key={chain.chainId}>{renderChainDetails(chain)}</div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="popular">
          {isLoadingPopular && (
            <p className="text-center text-cyber-neon/70">Loading popular chains...</p>
          )}
          
          {popularChains && popularChains.length > 0 && (
            <div className="space-y-6">
              {popularChains.map((chain) => (
                <div key={chain.chainId}>{renderChainDetails(chain)}</div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiscoverChains;
