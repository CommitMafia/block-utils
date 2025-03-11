
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Key } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Bip39Utility: React.FC = () => {
  return (
    <MainLayout showBackButton={true}>
      <Card className="cyber-card border-cyber-neon/50 shadow-[0_0_10px_rgba(15,255,80,0.3)]">
        <CardContent className="p-8 text-center">
          <Key className="h-12 w-12 text-cyber-neon mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-cyber-neon mb-2">BIP39 Utility</h2>
          <p className="text-cyber-neon/70 mb-4">Coming soon! This feature is under development.</p>
          <p className="text-cyber-neon/60 text-sm">Generate and validate BIP39 mnemonic seed phrases for wallet creation.</p>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Bip39Utility;
