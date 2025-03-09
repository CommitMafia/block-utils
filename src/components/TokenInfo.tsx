
import React from 'react';
import { TokenInfo as TokenInfoType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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

  return (
    <Card className="w-full cyber-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex justify-between items-baseline">
          <span>{tokenInfo.name}</span>
          <span className="text-sm text-muted-foreground">{tokenInfo.symbol}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total Supply</p>
            <p className="text-lg font-semibold">{formatNumber(tokenInfo.totalSupply)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Price</p>
            <p className="text-lg font-semibold">{formatCurrency(tokenInfo.price)}</p>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Volume (24h)</p>
            <p className="text-lg font-semibold">{formatCurrency(tokenInfo.volume24h)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Market Cap</p>
            <p className="text-lg font-semibold">{formatCurrency(tokenInfo.marketCap)}</p>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Holders</p>
            <p className="text-lg font-semibold">{tokenInfo.holders?.toLocaleString() || 'N/A'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Liquidity</p>
            <p className="text-lg font-semibold">{formatCurrency(tokenInfo.liquidity)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenInfo;
