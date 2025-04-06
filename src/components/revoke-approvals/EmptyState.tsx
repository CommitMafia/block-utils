
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { truncateAddress } from './utils';

interface EmptyStateProps {
  isConnected: boolean;
  address?: string | null;
  onConnect: () => Promise<void>;
  onRefresh: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ isConnected, address, onConnect, onRefresh }) => {
  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <Wallet className="h-12 w-12 text-cyber-neon/60 mb-4" />
        </div>
        
        <p className="text-cyber-neon/80 mb-4">
          Connect your wallet to view and manage token approvals
        </p>
        
        <Button onClick={onConnect} className="bg-green-800 text-cyber-neon hover:bg-green-700 font-mono">
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <p className="text-cyber-neon/80 mb-2">No token approvals found for {address ? truncateAddress(address) : ''}</p>
      <p className="text-sm text-cyber-neon/60">
        You haven't approved any tokens for spending by dApps
      </p>
      <Button onClick={onRefresh} className="mt-4 bg-green-800 text-cyber-neon hover:bg-green-700 font-mono">
        Refresh Approvals
      </Button>
    </div>
  );
};

export default EmptyState;
