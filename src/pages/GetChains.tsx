
import React from 'react';
import MainLayout from '@/components/MainLayout';
import GetChains from '@/components/GetChains';

const GetChainsPage: React.FC = () => {
  return (
    <MainLayout showBackButton={true}>
      <GetChains />
    </MainLayout>
  );
};

export default GetChainsPage;
