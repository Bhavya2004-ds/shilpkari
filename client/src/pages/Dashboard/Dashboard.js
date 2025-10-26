import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  p {
    color: #6b7280;
    font-size: 1.125rem;
  }
`;

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <DashboardContainer>
      <DashboardContent>
        <PageHeader>
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's what's happening with your account</p>
        </PageHeader>

        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '1rem', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h2>Dashboard Coming Soon</h2>
          <p>This feature is under development and will be available soon.</p>
        </div>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;
