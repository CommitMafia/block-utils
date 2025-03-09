
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ConnectWallet from '@/components/ConnectWallet';
import { ArrowLeft } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

interface MainLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showBackButton = false }) => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center min-h-screen relative overflow-x-hidden">
      <header className="flex justify-between items-center py-4 px-6 bg-black/80 backdrop-blur-sm border-b border-cyber-neon/30 sticky top-0 z-10 w-full">
        <div className="w-10"></div>
        <h1 
          className="text-3xl font-mono text-cyber-neon text-center cursor-pointer hover:text-cyber-neon/80 transition-colors" 
          onClick={() => navigate('/')}
        >
          {">_"} Web3_Utilities<span className="animate-pulse">⎸</span>
        </h1>
        <div className="min-w-[120px] flex justify-end">
          <ConnectWallet />
        </div>
      </header>
      
      <div className="container mx-auto px-4 pt-4 pb-0">
        {showBackButton && (
          <div className="w-full mb-6">
            <Button 
              variant="outline" 
              onClick={handleBackToDashboard} 
              className="border-cyber-neon/50 text-cyber-neon hover:bg-cyber-neon/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        )}
      </div>
      
      <main className="container mx-auto px-4 py-4 flex-1 flex flex-col justify-center">
        {children}
      </main>
      
      <footer className="w-full text-center py-6">
        <p className="text-cyber-neon/60 font-mono text-xs">System v1.33.7 // Secured Connection // 2025</p>
      </footer>
      <Toaster />
    </div>
  );
};

export default MainLayout;
