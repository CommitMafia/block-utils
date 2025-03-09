
import React, { createContext, useContext, ReactNode } from 'react';
import { WalletState } from '@/lib/types';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';

// Create context with default values
const WalletContext = createContext<WalletState>({
  isConnected: false,
  address: null,
  chainId: null,
  connect: async () => {},
  disconnect: () => {},
});

// Provider component for wallet connection
export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  // We'll use RainbowKit's connect button directly, but still need this function for our interface
  const connect = async () => {
    // This is now handled by RainbowKit's UI
    console.log('Connect requested via context');
  };

  // Function to disconnect wallet
  const disconnect = () => {
    wagmiDisconnect();
    console.log('Wallet disconnected');
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address: address || null,
        chainId: chain?.id || null,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use wallet context
export const useWallet = () => useContext(WalletContext);
