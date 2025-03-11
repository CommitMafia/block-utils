
import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-cyber-neon">
      <div className="text-center p-8 border border-cyber-neon/30 rounded-md shadow-[0_0_20px_rgba(15,255,80,0.2)]">
        <h1 className="text-6xl font-mono font-bold mb-4">404</h1>
        <p className="text-xl text-cyber-neon/70 mb-6">Route not found: {location.pathname}</p>
        <p className="text-sm text-cyber-neon/50 mb-8">The path you're looking for doesn't exist or has been moved.</p>
        <Button 
          onClick={() => navigate('/')} 
          className="bg-cyber-neon/20 text-cyber-neon hover:bg-cyber-neon/30 border border-cyber-neon/50"
        >
          <Home className="mr-2 h-4 w-4" />
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
