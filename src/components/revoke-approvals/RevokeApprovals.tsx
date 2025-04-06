
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { getChainById } from '@/lib/api';
import { useApprovals } from './hooks/useApprovals';
import ApprovalsTable from './ApprovalsTable';

const RevokeApprovals: React.FC = () => {
  const { isConnected, address, chainId, connect } = useWallet();
  const { approvals, loading, revoking, fetchApprovals, handleRevoke } = useApprovals(address, chainId);

  return (
    <div className="max-w-4xl mx-auto w-full">
      <Card className="cyber-card overflow-hidden border-cyber-neon/50 shadow-[0_0_10px_rgba(15,255,80,0.3)] mb-8">
        <div className="border-b border-cyber-neon/20 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <XCircle className="h-4 w-4 text-cyber-neon mr-2" />
            <span className="text-cyber-neon font-mono text-sm">REVOKE_APPROVALS</span>
          </div>
        </div>
        
        <CardContent className="p-6">
          <ApprovalsTable 
            isConnected={isConnected}
            address={address}
            chainId={chainId}
            approvals={approvals}
            loading={loading}
            revoking={revoking}
            onConnect={connect}
            onRefresh={fetchApprovals}
            onRevoke={handleRevoke}
          />
          
          {isConnected && !loading && approvals.length > 0 && (
            <div className="mt-6 text-xs text-cyber-neon/60 border-t border-cyber-neon/10 pt-4">
              <p>Connected to: <span className="text-cyber-neon">{address}</span> on <span className="text-cyber-neon">{getChainById(chainId!)?.name || `Chain ID ${chainId}`}</span></p>
              <p className="mt-2">Powered by <a href="https://revoke.cash" target="_blank" rel="noopener noreferrer" className="text-cyber-neon underline">Revoke.cash</a> API</p>
              <p className="mt-1">Always verify token approvals before revoking them. Revoking certain approvals may affect your DeFi positions.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RevokeApprovals;
