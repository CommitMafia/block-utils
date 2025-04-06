
import React from 'react';
import RevokeApprovals from './revoke-approvals/RevokeApprovals';

// This component is now just a wrapper to maintain backward compatibility
const RevokeApprovalsWrapper: React.FC = () => {
  return <RevokeApprovals />;
};

export default RevokeApprovalsWrapper;
