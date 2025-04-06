
import React from 'react';
import MainLayout from '@/components/MainLayout';
import RevokeApprovals from '@/components/RevokeApprovals';

const RevokeApprovalsPage: React.FC = () => {
  return (
    <MainLayout showBackButton={true}>
      <RevokeApprovals />
    </MainLayout>
  );
};

export default RevokeApprovalsPage;
