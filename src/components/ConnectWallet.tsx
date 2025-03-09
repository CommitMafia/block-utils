
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';
import { getChainById } from '@/lib/api';

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
        <div className="flex flex-col items-center space-y-2">
          <div className="text-sm text-muted-foreground">
            Connected to {chainName}
          </div>
          <Button
            onClick={disconnect}
            variant="outline"
            className="cyber-border"
          >
            {formatAddress(address)} (Disconnect)
          </Button>
        </div>
      ) : (
        <Button
          onClick={connect}
          className="cyber-button"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
