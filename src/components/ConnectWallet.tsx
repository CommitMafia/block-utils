
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWallet } from '@/context/WalletContext';
import { Wallet, LogOut, ChevronDown } from 'lucide-react';
import { useChainId } from 'wagmi';
import { getChainById } from '@/lib/api';
import { useMediaQuery } from '@/hooks/use-media-query';

// Custom styled RainbowKit connect button
const ConnectWallet: React.FC = () => {
  const { isConnected } = useWallet();
  const chainId = useChainId();
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  // Get the chain name based on chainId
  const activeChain = getChainById(chainId);
  const chainName = activeChain?.name || 'Unknown Chain';
  
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
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="border-2 border-cyber-neon bg-black text-cyber-neon font-mono shadow-[0_0_15px_rgba(15,255,80,0.7)] hover:shadow-[0_0_25px_rgba(15,255,80,0.9)] transition-all flex items-center px-4 py-2 rounded"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    {!isMobile && "ACCESS_WALLET"}
                  </button>
                );
              }

              return (
                <div className="flex flex-col items-end space-y-2">
                  {isMobile ? (
                    // Mobile view: compact menu button with dropdown
                    <button
                      onClick={openChainModal}
                      className="border-2 border-cyber-neon/70 bg-black text-cyber-neon font-mono px-3 py-1 rounded flex items-center"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  ) : (
                    // Desktop view: show chain name
                    <button
                      onClick={openChainModal}
                      className="border-2 border-cyber-neon/70 bg-black text-cyber-neon font-mono text-xs px-3 py-1 rounded"
                    >
                      {chain.name}
                    </button>
                  )}
                  
                  <button
                    onClick={openAccountModal}
                    className="border-2 border-cyber-neon/70 bg-black text-cyber-neon font-mono text-xs px-3 py-1 rounded flex items-center"
                  >
                    {isMobile ? (
                      <LogOut className="h-4 w-4" />
                    ) : (
                      <>
                        {account.displayName} <LogOut className="h-3 w-3 ml-1" />
                      </>
                    )}
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
