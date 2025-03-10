
import React from 'react';
import MainLayout from '@/components/MainLayout';
import GetChains from '@/components/GetChains';

const GetChainsPage: React.FC = () => {
  return (
    <MainLayout showBackButton={true}>
      <div className="w-full max-w-6xl mx-auto">
        <GetChains />
      </div>
    </MainLayout>
  );
};

export default GetChainsPage;
