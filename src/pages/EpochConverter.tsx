
import React from 'react';
import EpochConverter from '@/components/EpochConverter';
import MainLayout from '@/components/MainLayout';

const EpochConverterPage: React.FC = () => {
  return (
    <MainLayout showBackButton={true}>
      <div className="max-w-xl mx-auto w-full">
        <EpochConverter />
      </div>
    </MainLayout>
  );
};

export default EpochConverterPage;
