
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WalletState } from '@/lib/types';

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
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  // Function to connect wallet
  const connect = async () => {
    // In a real implementation, this would use a library like ethers.js or web3.js
    // For now, we'll simulate a connection
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        
        setAddress(accounts[0]);
        setChainId(parseInt(chainIdHex, 16));
        setIsConnected(true);
        
        console.log('Wallet connected:', accounts[0]);
      } else {
        console.error('No Ethereum provider found');
        alert('Please install MetaMask or another Ethereum wallet');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  // Function to disconnect wallet
  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setChainId(null);
    console.log('Wallet disconnected');
  };

  // Listen for account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (isConnected) {
          setAddress(accounts[0]);
        }
      };

      const handleChainChanged = (chainIdHex: string) => {
        setChainId(parseInt(chainIdHex, 16));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [isConnected]);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        chainId,
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

// Add type definition for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, listener: (...args: any[]) => void) => void;
      removeListener: (event: string, listener: (...args: any[]) => void) => void;
    };
  }
}
