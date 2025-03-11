
import React from 'react';
import EthConverter from '@/components/EthConverter';
import MainLayout from '@/components/MainLayout';

const EthConverterPage: React.FC = () => {
  return (
    <MainLayout showBackButton={true}>
      <div className="max-w-4xl mx-auto">
        <EthConverter />
      </div>
    </MainLayout>
  );
};

export default EthConverterPage;
