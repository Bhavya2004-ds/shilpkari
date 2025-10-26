import React from 'react';
import styled from 'styled-components';

const AnalyticsContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const AnalyticsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const Analytics = () => {
  return (
    <AnalyticsContainer>
      <AnalyticsContent>
        <h1>Analytics</h1>
        <p>This page is under development.</p>
      </AnalyticsContent>
    </AnalyticsContainer>
  );
};

export default Analytics;
