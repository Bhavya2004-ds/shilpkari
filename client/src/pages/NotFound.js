import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
`;

const NotFoundContent = styled.div`
  max-width: 600px;

  h1 {
    font-size: 6rem;
    font-weight: 700;
    color: #d97706;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 2rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.125rem;
    color: #6b7280;
    margin-bottom: 2rem;
  }

  a {
    display: inline-block;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #d97706, #b45309);
    color: white;
    text-decoration: none;
    border-radius: 0.75rem;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px 0 rgba(217, 119, 6, 0.4);
    }
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/">Go Home</Link>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default NotFound;
