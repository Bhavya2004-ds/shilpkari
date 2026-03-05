import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import BuyerDashboard from './BuyerDashboard';
import SellerDashboard from './SellerDashboard';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #fef3c7;
  border-top: 4px solid #d97706;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Dashboard = () => {
  const { user, loading } = useAuth();

  // Show loading state while auth is being checked
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // Render dashboard based on user role
  // 'artisan' = seller dashboard, 'buyer' or default = buyer dashboard
  if (user?.role === 'artisan') {
    return <SellerDashboard />;
  }

  return <BuyerDashboard />;
};

export default Dashboard;
