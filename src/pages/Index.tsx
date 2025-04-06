
import React from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import Dashboard from '@/components/Dashboard';
import TokenUtilities from '@/components/TokenUtilities';
import RevokeApprovals from '@/components/RevokeApprovals';
import FeaturePlaceholder from '@/components/FeaturePlaceholder';
import { Package2, FileCode, Hash, Coins, Clock, Globe, Key, XCircle } from 'lucide-react';

// Function to get feature icon
const getFeatureIcon = (featureId: string) => {
  switch (featureId) {
    case 'token-utilities': return Package2;
    case 'contract-execution': return FileCode;
    case 'hex-converter': return Hash;
    case 'eth-converter': return Coins;
    case 'epoch-converter': return Clock;
    case 'get-chains': return Globe;
    case 'bip39-utility': return Key;
    case 'revoke-approvals': return XCircle;
    default: return Package2;
  }
};

// Function to get feature title
const getFeatureTitle = (featureId: string) => {
  switch (featureId) {
    case 'token-utilities': return 'Token Utilities';
    case 'contract-execution': return 'Contract Execution';
    case 'hex-converter': return 'Hex Converter';
    case 'eth-converter': return 'ETH Converter';
    case 'epoch-converter': return 'Epoch Converter';
    case 'get-chains': return 'Discover Chains';
    case 'bip39-utility': return 'BIP39 Utility';
    case 'revoke-approvals': return 'Revoke Approvals';
    default: return featureId;
  }
};

const Index = () => {
  const location = useLocation();
  
  // Get current path from location
  const currentPath = location.pathname;
  
  // Determine which feature is active based on the path
  const activeFeature = currentPath === '/' ? null : currentPath.substring(1);

  // Determine if we need to show the back button
  const showBackButton = activeFeature !== null;

  // Render content based on active feature
  const renderContent = () => {
    if (activeFeature === null) {
      return <Dashboard />;
    } else if (activeFeature === 'token-utilities') {
      return <TokenUtilities />;
    } else if (activeFeature === 'revoke-approvals') {
      return <RevokeApprovals />;
    } else {
      // Show placeholder for other features
      const title = getFeatureTitle(activeFeature);
      const Icon = getFeatureIcon(activeFeature);
      return <FeaturePlaceholder title={title} icon={Icon} />;
    }
  };

  return (
    <MainLayout showBackButton={showBackButton}>
      {renderContent()}
    </MainLayout>
  );
};

export default Index;
