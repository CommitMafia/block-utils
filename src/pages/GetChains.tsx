
import React from 'react';
import MainLayout from '@/components/MainLayout';
import DiscoverChains from '@/components/GetChains';

const DiscoverChainsPage: React.FC = () => {
  return (
    <MainLayout showBackButton={true}>
      <div className="w-full max-w-6xl mx-auto">
        <DiscoverChains />
      </div>
    </MainLayout>
  );
};

export default DiscoverChainsPage;
