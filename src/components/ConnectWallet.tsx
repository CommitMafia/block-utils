
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWallet } from '@/context/WalletContext';
import { Wallet, LogOut } from 'lucide-react';

// Custom styled RainbowKit connect button
const ConnectWallet: React.FC = () => {
  const { isConnected } = useWallet();
  
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
            className="flex flex-col items-center space-y-2"
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="border border-cyber-neon bg-transparent text-cyber-neon font-mono shadow-[0_0_10px_rgba(15,255,80,0.7)] hover:shadow-[0_0_20px_rgba(15,255,80,0.9)] transition-all flex items-center px-4 py-2 rounded"
                  >
                    <Wallet className="h-4 w-4 mr-1" /> ACCESS_WALLET
                  </button>
                );
              }

              return (
                <div className="flex flex-col items-center space-y-2">
                  <button
                    onClick={openChainModal}
                    className="border border-cyber-neon/70 bg-transparent text-cyber-neon font-mono text-xs px-3 py-1 rounded"
                  >
                    {chain.name}
                  </button>
                  
                  <button
                    onClick={openAccountModal}
                    className="border border-cyber-neon/70 bg-transparent text-cyber-neon font-mono text-xs px-3 py-1 rounded flex items-center"
                  >
                    {account.displayName} <LogOut className="h-3 w-3 ml-1" />
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWallet;
