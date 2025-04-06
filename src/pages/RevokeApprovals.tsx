
import React from 'react';
import MainLayout from '@/components/MainLayout';
import RevokeApprovals from '@/components/RevokeApprovals';

const RevokeApprovalsPage: React.FC = () => {
  return (
    <MainLayout showBackButton={true}>
      <div className="w-full max-w-6xl mx-auto">
        <RevokeApprovals />
      </div>
    </MainLayout>
  );
};

export default RevokeApprovalsPage;
