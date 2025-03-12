
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface FunctionalityBoxProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  comingSoon?: boolean;
}

const FunctionalityBox: React.FC<FunctionalityBoxProps> = ({
  title,
  description,
  icon,
  onClick,
  comingSoon = false
}) => {
  return (
    <Card 
      className={`cyber-card overflow-hidden border-cyber-neon/50 shadow-[0_0_10px_rgba(15,255,80,0.3)] hover:shadow-[0_0_20px_rgba(15,255,80,0.5)] transition-all ${comingSoon ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={comingSoon ? undefined : onClick}
    >
      <CardContent className="p-6 flex flex-col items-center text-center h-full relative">
        {comingSoon && (
          <span className="absolute top-2 right-2 bg-purple-600/20 text-purple-400 text-xs font-mono px-2 py-1 rounded-full border border-purple-500/50">
            Coming Soon
          </span>
        )}
        <div className="text-cyber-neon mb-4 mt-2">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-cyber-neon mb-2">{title}</h3>
        <p className="text-cyber-neon/70 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FunctionalityBox;
