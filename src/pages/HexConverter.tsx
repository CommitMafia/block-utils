
import React from 'react';
import HexConverter from '@/components/HexConverter';
import MainLayout from '@/components/MainLayout';

const HexConverterPage: React.FC = () => {
  return (
    <MainLayout showBackButton={true}>
      <div className="max-w-lg mx-auto w-full">
        <HexConverter />
      </div>
    </MainLayout>
  );
};

export default HexConverterPage;
