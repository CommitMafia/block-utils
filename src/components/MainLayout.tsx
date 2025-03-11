
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
  // Determine if we should show the wallet connect button based on the current route
  const showWalletButton = ['/token-utilities', '/contract-execution', '/get-chains'].includes(location.pathname);

  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center min-h-screen relative overflow-x-hidden">
      <header className="flex justify-between items-center py-4 px-6 bg-black/80 backdrop-blur-sm border-b border-cyber-neon/30 sticky top-0 z-10 w-full">
        <div className="w-10"></div>
        <div className="flex flex-col items-center justify-center text-center">
          <h1 
            className="text-3xl font-mono text-cyber-neon cursor-pointer hover:text-cyber-neon/80 transition-colors" 
            onClick={() => navigate('/')}
          >
            {">_"} BlockUtils<span className="animate-pulse">⎸</span>
          </h1>
          <p className="text-cyber-neon/80 text-sm mt-1 font-mono">A toolkit for every web3 dev</p>
        </div>
        <div className="min-w-[120px] flex justify-end">
          {showWalletButton && <ConnectWallet />}
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
        <p className="text-cyber-neon/60 font-mono text-xs mt-1">
          Built with ❤️ by <a 
            href="https://x.com/itsarjn" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-cyber-neon transition-colors underline"
          >
            itsarjn
          </a>
        </p>
      </footer>
      <Toaster />
    </div>
  );
};

export default MainLayout;
