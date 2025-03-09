
import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWallet } from '@/context/WalletContext';
import { Wallet, LogOut, QrCode } from 'lucide-react';
import { useChainId } from 'wagmi';
import { getChainById } from '@/lib/api';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

// Custom styled RainbowKit connect button
const ConnectWallet: React.FC = () => {
  const { isConnected } = useWallet();
  const chainId = useChainId();
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  
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
            className="flex flex-col items-center space-y-2"
          >
            {(() => {
              if (!connected) {
                return (
                  <div className="flex gap-2">
                    <button
                      onClick={openConnectModal}
                      className="border-2 border-cyber-neon bg-black text-cyber-neon font-mono shadow-[0_0_15px_rgba(15,255,80,0.7)] hover:shadow-[0_0_25px_rgba(15,255,80,0.9)] transition-all flex items-center px-4 py-2 rounded"
                    >
                      <Wallet className="h-4 w-4 mr-2" /> ACCESS_WALLET
                    </button>
                    
                    {/* QR Code Connection Option */}
                    <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
                      <DialogTrigger asChild>
                        <button
                          className="border-2 border-cyber-neon/70 bg-black text-cyber-neon font-mono shadow-[0_0_10px_rgba(15,255,80,0.5)] hover:shadow-[0_0_20px_rgba(15,255,80,0.7)] transition-all flex items-center p-2 rounded"
                          aria-label="Connect with QR code"
                        >
                          <QrCode className="h-4 w-4" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="border-cyber-neon/50 bg-black text-cyber-neon">
                        <DialogHeader>
                          <DialogTitle className="text-center text-cyber-neon font-mono">
                            SCAN QR CODE TO CONNECT
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center p-4">
                          <div className="w-[320px] max-w-full" onClick={openConnectModal}>
                            {/* When clicked, this will open RainbowKit's native modal with QR option */}
                            <div className="flex items-center justify-center border-2 border-cyber-neon/70 rounded p-4 cursor-pointer hover:bg-cyber-neon/5 transition-colors">
                              <QrCode className="h-32 w-32 text-cyber-neon/80" />
                              <span className="sr-only">Click to open QR connect</span>
                            </div>
                            <p className="text-center mt-4 text-cyber-neon/80 font-mono text-sm">
                              Click to display the WalletConnect QR code
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                );
              }

              return (
                <div className="flex flex-col items-center space-y-2">
                  <button
                    onClick={openChainModal}
                    className="border-2 border-cyber-neon/70 bg-black text-cyber-neon font-mono text-xs px-3 py-1 rounded"
                  >
                    {chain.name}
                  </button>
                  
                  <button
                    onClick={openAccountModal}
                    className="border-2 border-cyber-neon/70 bg-black text-cyber-neon font-mono text-xs px-3 py-1 rounded flex items-center"
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
