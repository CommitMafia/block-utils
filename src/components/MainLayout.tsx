
import React, { useState, useEffect } from 'react';
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
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const fullText = 'Block_Utils';
  
  // Determine if we should show the wallet connect button based on the current route
  const showWalletButton = ['/token-utilities', '/contract-execution', '/get-chains'].includes(location.pathname);

  const handleBackToDashboard = () => {
    navigate('/');
  };

  // Typing animation effect
  useEffect(() => {
    const typingSpeed = 150; // milliseconds per character
    const deletingSpeed = 100; // faster when deleting
    const pauseBeforeDeleting = 2000; // pause before starting to delete
    const pauseBeforeRetyping = 500; // pause before retyping

    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayedText !== fullText) {
      // Still typing
      timeout = setTimeout(() => {
        setDisplayedText(fullText.substring(0, displayedText.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && displayedText === fullText) {
      // Finished typing, pause before deleting
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseBeforeDeleting);
    } else if (isDeleting && displayedText !== '') {
      // Deleting
      timeout = setTimeout(() => {
        setDisplayedText(fullText.substring(0, displayedText.length - 1));
      }, deletingSpeed);
    } else if (isDeleting && displayedText === '') {
      // Finished deleting, pause before retyping
      timeout = setTimeout(() => {
        setIsDeleting(false);
      }, pauseBeforeRetyping);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, fullText]);

  return (
    <div className="flex flex-col items-center min-h-screen relative overflow-x-hidden">
      <header className="flex justify-between items-center py-4 px-6 bg-black/80 backdrop-blur-sm border-b border-cyber-neon/30 sticky top-0 z-10 w-full">
        {/* Left spacer to balance the wallet button on the right */}
        <div className="flex-1 flex justify-start">
          {showWalletButton ? <div className="w-[120px] sm:w-[180px]"></div> : <div></div>}
        </div>
        
        {/* Center logo and title section */}
        <div className="flex flex-col items-center">
          <h1 
            className="text-2xl sm:text-3xl font-mono text-cyber-neon cursor-pointer hover:text-cyber-neon/80 transition-colors" 
            onClick={() => navigate('/')}
          >
            {">_"} {displayedText}<span className="animate-pulse">⎸</span>
          </h1>
          <p className="text-cyber-neon/80 text-xs sm:text-sm mt-1 font-mono">A toolkit for every web3 dev</p>
        </div>
        
        {/* Right section for wallet button */}
        <div className="flex-1 flex justify-end">
          {showWalletButton && (
            <ConnectWallet />
          )}
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
