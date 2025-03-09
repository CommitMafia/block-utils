
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';
import { getChainById } from '@/lib/api';
import { Wallet, LogOut } from 'lucide-react';

// Wallet connection component
const ConnectWallet: React.FC = () => {
  const { isConnected, address, chainId, connect, disconnect } = useWallet();
  
  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Get chain name
  const chainName = chainId ? getChainById(chainId)?.name || `Chain #${chainId}` : '';

  return (
    <div className="flex flex-col items-center space-y-2">
      {isConnected && address ? (
        <Button
          onClick={disconnect}
          variant="outline"
          className="border border-cyber-neon/70 bg-transparent text-cyber-neon font-mono text-xs"
        >
          {formatAddress(address)} <LogOut className="h-3 w-3 ml-1" />
        </Button>
      ) : (
        <Button
          onClick={connect}
          className="border border-cyber-neon bg-transparent text-cyber-neon font-mono shadow-[0_0_10px_rgba(15,255,80,0.7)] hover:shadow-[0_0_20px_rgba(15,255,80,0.9)] transition-all"
        >
          <Wallet className="h-4 w-4 mr-1" /> ACCESS_WALLET
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
