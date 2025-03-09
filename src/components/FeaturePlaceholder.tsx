
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeaturePlaceholderProps {
  title: string;
  icon: LucideIcon;
}

const FeaturePlaceholder: React.FC<FeaturePlaceholderProps> = ({ title, icon: Icon }) => {
  return (
    <Card className="cyber-card border-cyber-neon/50 shadow-[0_0_10px_rgba(15,255,80,0.3)]">
      <CardContent className="p-8 text-center">
        <Icon className="h-12 w-12 text-cyber-neon mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-cyber-neon mb-2">{title}</h2>
        <p className="text-cyber-neon/70 mb-4">Coming soon! This feature is under development.</p>
      </CardContent>
    </Card>
  );
};

export default FeaturePlaceholder;
