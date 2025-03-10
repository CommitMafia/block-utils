
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FunctionalityBox from '@/components/FunctionalityBox';
import { Package2, FileCode, Hash, Coins, Clock, Globe } from 'lucide-react';

// Functionality options
const functionalityOptions = [
  {
    id: 'token-utilities',
    title: 'Token Utilities',
    description: 'Analyze token contracts and interact with functions',
    icon: Package2,
    path: '/token-utilities'
  },
  {
    id: 'contract-execution',
    title: 'Contract Execution',
    description: 'Execute contract functions directly',
    icon: FileCode,
    path: '/contract-execution'
  },
  {
    id: 'hex-converter',
    title: 'Hex Converter',
    description: 'Convert between hexadecimal and decimal values',
    icon: Hash,
    path: '/hex-converter'
  },
  {
    id: 'eth-converter',
    title: 'ETH Converter',
    description: 'Convert between ETH, WEI, GWEI and other denominations',
    icon: Coins,
    path: '/eth-converter'
  },
  {
    id: 'epoch-converter',
    title: 'Epoch Converter',
    description: 'Convert between Unix timestamps and human-readable dates',
    icon: Clock,
    path: '/epoch-converter'
  },
  {
    id: 'get-chains',
    title: 'Discover Chains',
    description: 'Retrieve blockchain network configurations and details',
    icon: Globe,
    path: '/get-chains'
  }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Navigate to feature page
  const handleFeatureSelect = (path: string) => {
    navigate(path);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {functionalityOptions.map((option) => (
        <FunctionalityBox
          key={option.id}
          title={option.title}
          description={option.description}
          icon={<option.icon className="h-8 w-8" />}
          onClick={() => handleFeatureSelect(option.path)}
        />
      ))}
    </div>
  );
};

export default Dashboard;
