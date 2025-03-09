
import React from 'react';
import { TokenInfo as TokenInfoType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Coins, DollarSign, BarChart4, Users, Droplets, Hash, Calculator } from 'lucide-react';

interface TokenInfoProps {
  tokenInfo: TokenInfoType;
}

// Component to display token information
const TokenInfo: React.FC<TokenInfoProps> = ({ tokenInfo }) => {
  // Format large numbers with commas
  const formatNumber = (value: string | null): string => {
    if (!value) return 'N/A';
    
    // Try to parse as a number and format
    try {
      const num = parseFloat(value);
      return num.toLocaleString('en-US', { maximumFractionDigits: 6 });
    } catch (e) {
      return value;
    }
  };
  
  // Format currency values
  const formatCurrency = (value: string | null): string => {
    if (!value) return 'N/A';
    
    try {
      const num = parseFloat(value);
      return `$${num.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    } catch (e) {
      return value;
    }
  };

  // Format token supply with decimals consideration
  const formatTokenSupply = (supply: string, decimals: number): string => {
    if (!supply) return 'N/A';
    
    try {
      const totalTokens = parseFloat(supply) / Math.pow(10, decimals);
      return totalTokens.toLocaleString('en-US', { maximumFractionDigits: 2 });
    } catch (e) {
      return supply;
    }
  };

  return (
    <Card className="cyber-card border-cyber-neon/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex justify-between items-baseline cyber-title">
          <span>{tokenInfo.name || 'Unknown Token'}</span>
          <span className="text-sm text-muted-foreground font-mono">{tokenInfo.symbol || '???'}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Coins className="h-3 w-3 text-cyber-neon" /> Total Supply
            </p>
            <p className="text-lg font-mono cyber-text">
              {formatTokenSupply(tokenInfo.totalSupply, tokenInfo.decimals)}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-cyber-neon" /> Price
            </p>
            <p className="text-lg font-mono cyber-text">{formatCurrency(tokenInfo.price)}</p>
          </div>
        </div>
        
        <Separator className="my-2 bg-cyber-neon/20" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Calculator className="h-3 w-3 text-cyber-neon" /> Decimals
            </p>
            <p className="text-lg font-mono cyber-text">{tokenInfo.decimals}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Hash className="h-3 w-3 text-cyber-neon" /> Raw Supply
            </p>
            <p className="text-lg font-mono cyber-text">{formatNumber(tokenInfo.totalSupply)}</p>
          </div>
        </div>
        
        <Separator className="my-2 bg-cyber-neon/20" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <BarChart4 className="h-3 w-3 text-cyber-neon" /> Volume (24h)
            </p>
            <p className="text-lg font-mono cyber-text">{formatCurrency(tokenInfo.volume24h)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-cyber-neon" /> Market Cap
            </p>
            <p className="text-lg font-mono cyber-text">{formatCurrency(tokenInfo.marketCap)}</p>
          </div>
        </div>
        
        <Separator className="my-2 bg-cyber-neon/20" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3 text-cyber-neon" /> Holders
            </p>
            <p className="text-lg font-mono cyber-text">{tokenInfo.holders?.toLocaleString() || 'N/A'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Droplets className="h-3 w-3 text-cyber-neon" /> Liquidity
            </p>
            <p className="text-lg font-mono cyber-text">{formatCurrency(tokenInfo.liquidity)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenInfo;
