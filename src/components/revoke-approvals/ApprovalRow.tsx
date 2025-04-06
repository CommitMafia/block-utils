
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';
import { getChainById } from '@/lib/api';
import { Approval } from './types';
import { truncateAddress } from './utils';

interface ApprovalRowProps {
  approval: Approval;
  chainId: number;
  revoking: string | null;
  onRevoke: (tokenAddress: `0x${string}`, spenderAddress: `0x${string}`) => void;
}

const ApprovalRow: React.FC<ApprovalRowProps> = ({ approval, chainId, revoking, onRevoke }) => {
  const approvalId = `${approval.tokenAddress}-${approval.spenderAddress}`;
  
  return (
    <TableRow className="border-b border-cyber-neon/10">
      <TableCell className="font-mono">
        <div>
          <div className="text-cyber-neon font-semibold">{approval.tokenSymbol}</div>
          <div className="text-cyber-neon/70 text-xs">{truncateAddress(approval.tokenAddress)}</div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className="text-cyber-neon">{approval.spenderName}</div>
          <div className="text-cyber-neon/70 text-xs">{truncateAddress(approval.spenderAddress)}</div>
        </div>
      </TableCell>
      <TableCell className="text-cyber-neon">
        {approval.allowance}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-cyber-neon/50 text-cyber-neon hover:bg-cyber-neon/10" 
            onClick={() => {
              const explorerUrl = getChainById(chainId)?.blockExplorerUrl;
              window.open(`${explorerUrl}/token/${approval.tokenAddress}`, '_blank');
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-red-500/50 text-red-500 hover:bg-red-500/10" 
            onClick={() => onRevoke(approval.tokenAddress, approval.spenderAddress)} 
            disabled={revoking === approvalId}
          >
            {revoking === approvalId ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Revoke'}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ApprovalRow;
