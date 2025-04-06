
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Approval } from './types';
import { truncateAddress } from './utils';
import ApprovalRow from './ApprovalRow';
import EmptyState from './EmptyState';

interface ApprovalsTableProps {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  approvals: Approval[];
  loading: boolean;
  revoking: string | null;
  onConnect: () => Promise<void>;
  onRefresh: () => void;
  onRevoke: (tokenAddress: `0x${string}`, spenderAddress: `0x${string}`) => void;
}

const ApprovalsTable: React.FC<ApprovalsTableProps> = ({
  isConnected,
  address,
  chainId,
  approvals,
  loading,
  revoking,
  onConnect,
  onRefresh,
  onRevoke
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-cyber-neon animate-spin" />
        <span className="ml-2 text-cyber-neon font-mono">
          Scanning for approvals from {address ? truncateAddress(address) : ''}...
        </span>
      </div>
    );
  }

  if (!isConnected || approvals.length === 0) {
    return (
      <EmptyState 
        isConnected={isConnected} 
        address={address} 
        onConnect={onConnect} 
        onRefresh={onRefresh} 
      />
    );
  }

  return (
    <>
      <div className="mb-4">
        <p className="text-cyber-neon/80 text-sm mb-4">
          Below are the tokens you've approved for spending by various applications. 
          You can revoke any approval you no longer need or trust.
        </p>
        <div className="flex justify-between items-center">
          <p className="text-cyber-neon font-mono text-sm">
            Found {approvals.length} active approval{approvals.length !== 1 ? 's' : ''} for {address ? truncateAddress(address) : ''}
          </p>
          <Button onClick={onRefresh} className="bg-green-800 text-cyber-neon hover:bg-green-700 font-mono text-xs" size="sm">
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-cyber-neon/20">
              <TableHead className="text-cyber-neon">Token</TableHead>
              <TableHead className="text-cyber-neon">Spender</TableHead>
              <TableHead className="text-cyber-neon">Allowance</TableHead>
              <TableHead className="text-right text-cyber-neon">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.map(approval => (
              <ApprovalRow 
                key={`${approval.tokenAddress}-${approval.spenderAddress}`}
                approval={approval}
                chainId={chainId!}
                revoking={revoking}
                onRevoke={onRevoke}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ApprovalsTable;
