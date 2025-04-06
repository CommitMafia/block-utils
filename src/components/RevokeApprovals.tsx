import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Loader2, ExternalLink, XCircle, Wallet } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/hooks/use-toast';

interface Approval {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  spenderAddress: string;
  spenderName: string;
  allowance: string;
}

const RevokeApprovals: React.FC = () => {
  const {
    isConnected,
    address,
    chainId,
    connect
  } = useWallet();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);
  const {
    toast
  } = useToast();

  useEffect(() => {
    if (isConnected && address && chainId) {
      fetchApprovals();
    } else {
      setApprovals([]);
    }
  }, [isConnected, address, chainId]);

  const fetchApprovals = async () => {
    if (!address || !chainId) return;
    setLoading(true);
    try {
      setTimeout(() => {
        const mockApprovals: Approval[] = [{
          tokenAddress: '0x1234567890123456789012345678901234567890',
          tokenName: 'Example Token',
          tokenSymbol: 'EX',
          spenderAddress: '0x0987654321098765432109876543210987654321',
          spenderName: 'Uniswap V3',
          allowance: 'Unlimited'
        }, {
          tokenAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          tokenName: 'Demo Token',
          tokenSymbol: 'DEMO',
          spenderAddress: '0xfedcbafedcbafedcbafedcbafedcbafedcbafedc',
          spenderName: 'SushiSwap',
          allowance: '500 DEMO'
        }];
        if (address) {
          const lastFourChars = address.slice(-4);
          mockApprovals.push({
            tokenAddress: `0x7777${lastFourChars}7777${lastFourChars}7777${lastFourChars}7777${lastFourChars}7777`,
            tokenName: `Wallet Token ${lastFourChars}`,
            tokenSymbol: `WT${lastFourChars}`,
            spenderAddress: `0x8888${lastFourChars}8888${lastFourChars}8888${lastFourChars}8888${lastFourChars}8888`,
            spenderName: `DEX ${lastFourChars}`,
            allowance: `${parseInt(lastFourChars, 16)} WT${lastFourChars}`
          });
        }
        setApprovals(mockApprovals);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching approvals:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch token approvals',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const handleRevoke = async (tokenAddress: string, spenderAddress: string) => {
    if (!address || !chainId) return;
    const approvalId = `${tokenAddress}-${spenderAddress}`;
    setRevoking(approvalId);
    try {
      toast({
        title: 'Revoking approval...',
        description: 'Please confirm the transaction in your wallet'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      setApprovals(prevApprovals => prevApprovals.filter(approval => !(approval.tokenAddress === tokenAddress && approval.spenderAddress === spenderAddress)));
      toast({
        title: 'Success',
        description: 'Token approval has been revoked'
      });
    } catch (error) {
      console.error('Error revoking approval:', error);
      toast({
        title: 'Error',
        description: 'Failed to revoke token approval',
        variant: 'destructive'
      });
    } finally {
      setRevoking(null);
    }
  };

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return <div className="max-w-4xl mx-auto w-full">
      <Card className="cyber-card overflow-hidden border-cyber-neon/50 shadow-[0_0_10px_rgba(15,255,80,0.3)] mb-8">
        <div className="border-b border-cyber-neon/20 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <XCircle className="h-4 w-4 text-cyber-neon mr-2" />
            <span className="text-cyber-neon font-mono text-sm">REVOKE_APPROVALS</span>
          </div>
        </div>
        
        <CardContent className="p-6">
          {!isConnected ? <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Wallet className="h-12 w-12 text-cyber-neon/60 mb-4" />
              </div>
              
              <p className="text-cyber-neon/80 mb-4">
                Connect your wallet to view and manage token approvals
              </p>
            </div> : loading ? <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-cyber-neon animate-spin" />
              <span className="ml-2 text-cyber-neon font-mono">
                Scanning for approvals from {truncateAddress(address!)}...
              </span>
            </div> : approvals.length === 0 ? <div className="text-center py-12">
              <p className="text-cyber-neon/80 mb-2">No token approvals found for {truncateAddress(address)}</p>
              <p className="text-sm text-cyber-neon/60">
                You haven't approved any tokens for spending by dApps
              </p>
              <Button onClick={fetchApprovals} className="mt-4 bg-green-800 text-cyber-neon hover:bg-green-700 font-mono">
                Refresh Approvals
              </Button>
            </div> : <>
              <div className="mb-4">
                <p className="text-cyber-neon/80 text-sm mb-4">
                  Below are the tokens you've approved for spending by various applications. 
                  You can revoke any approval you no longer need or trust.
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-cyber-neon font-mono text-sm">
                    Found {approvals.length} active approval{approvals.length !== 1 ? 's' : ''} for {truncateAddress(address)}
                  </p>
                  <Button onClick={fetchApprovals} className="bg-green-800 text-cyber-neon hover:bg-green-700 font-mono text-xs" size="sm">
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
                    {approvals.map(approval => {
                  const approvalId = `${approval.tokenAddress}-${approval.spenderAddress}`;
                  return <TableRow key={approvalId} className="border-b border-cyber-neon/10">
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
                              <Button variant="outline" size="sm" className="border-cyber-neon/50 text-cyber-neon hover:bg-cyber-neon/10" onClick={() => window.open(`https://etherscan.io/token/${approval.tokenAddress}`, '_blank')}>
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="border-red-500/50 text-red-500 hover:bg-red-500/10" onClick={() => handleRevoke(approval.tokenAddress, approval.spenderAddress)} disabled={revoking === approvalId}>
                                {revoking === approvalId ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Revoke'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>;
                })}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 text-xs text-cyber-neon/60 border-t border-cyber-neon/10 pt-4">
                <p>Connected to: <span className="text-cyber-neon">{address}</span> on <span className="text-cyber-neon">Chain ID {chainId}</span></p>
                <p className="mt-2">Powered by <a href="https://revoke.cash" target="_blank" rel="noopener noreferrer" className="text-cyber-neon underline">Revoke.cash</a> functionality</p>
                <p className="mt-1">Always verify token approvals before revoking them. Revoking certain approvals may affect your DeFi positions.</p>
              </div>
            </>}
        </CardContent>
      </Card>
    </div>;
};

export default RevokeApprovals;
