import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaArrowLeft, FaPaperPlane, FaHome } from 'react-icons/fa';

const ForgotContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: #fdfcfb;
  overflow: hidden;
  
  @media (max-width: 900px) {
    justify-content: center;
    align-items: center;
    padding: 2rem 1rem;
  }
`;

const VisualSide = styled.div`
  flex: 1.25;
  background: linear-gradient(135deg, rgba(30, 10, 3, 0.9), rgba(80, 35, 8, 0.8)), 
              url('/login-bg.png');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5rem;
  color: white;
  position: relative;
  
  @media (max-width: 1024px) {
    padding: 3rem;
  }

  @media (max-width: 900px) {
    display: none;
  }
  
  .content {
    position: relative;
    z-index: 2;
    max-width: 500px;
  }
  
  h2 {
    font-size: 3.5rem;
    font-weight: 800;
    color: #ffffff !important;
    margin-bottom: 1.5rem;
    line-height: 1.1;
    letter-spacing: -2px;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
  }
  
  p {
    font-size: 1.25rem;
    color: #ffffff !important;
    opacity: 0.95;
    line-height: 1.6;
    margin-bottom: 3rem;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.4);
  }
`;

const DecorativeCircle = styled.div`
  position: absolute;
  top: ${props => props.top || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  width: ${props => props.size || '300px'};
  height: ${props => props.size || '300px'};
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
`;

const FormSide = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background: white;
  
  @media (max-width: 900px) {
    padding: 0;
    width: 100%;
    background: transparent;
  }
`;

const ForgotCard = styled(motion.div)`
  width: 100%;
  max-width: 440px;
  
  @media (max-width: 900px) {
    background: white;
    padding: 3rem;
    border-radius: 2rem;
    box-shadow: 0 20px 50px rgba(0,0,0,0.05);
  }
`;

const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #d97706;
  text-decoration: none;
  font-weight: 700;
  margin-bottom: 3rem;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ForgotHeader = styled.div`
  margin-bottom: 2.5rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 0.75rem;
    letter-spacing: -1px;
  }

  p {
    color: #6b7280;
    font-size: 1.1rem;
    line-height: 1.5;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    transition: color 0.3s;
  }
  
  &:focus-within svg {
    color: #d97706;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3.5rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  color: #111827;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    background: white;
    border-color: #d97706;
    box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
  }
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 1.125rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 10px 20px rgba(217, 119, 6, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(217, 119, 6, 0.3);
    background: linear-gradient(135deg, #b45309, #92400e);
    
    svg {
      transform: translateX(4px);
    }
  }
  
  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  svg {
    transition: transform 0.3s ease;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  color: #6b7280;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.3s;

  &:hover {
    color: #d97706;
  }
`;

const SuccessMsg = styled(motion.div)`
  background: #ecfdf5;
  color: #059669;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-weight: 500;
  border: 1px solid #d1fae5;
  text-align: center;
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: #065f46;
  }
  
  p {
    color: #065f46;
    font-size: 0.95rem;
  }
`;

const ErrorMsg = styled(motion.div)`
  background: #fef2f2;
  color: #ef4444;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #fee2e2;
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotContainer>
      <VisualSide>
        <DecorativeCircle top="-50px" left="-50px" size="400px" />
        <DecorativeCircle bottom="10%" right="-100px" size="350px" />
        <div className="content">
          <h2>Don't Worry, We've Got You.</h2>
          <p>Resetting your password is quick and easy. You'll be back to exploring authentic crafts in no time.</p>
        </div>
      </VisualSide>

      <FormSide>
        <ForgotCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LogoLink to="/">
            <FaHome size={20} />
            <span>Go to Home</span>
          </LogoLink>

          <ForgotHeader>
            <h1>Forgot Password?</h1>
            <p>No worries, it happens. Enter your email address and we'll send you instructions to reset your password.</p>
          </ForgotHeader>

          <AnimatePresence>
            {error && (
              <ErrorMsg
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {error}
              </ErrorMsg>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {submitted && (
              <SuccessMsg
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📧</div>
                <h3>Check your email</h3>
                <p>We've sent a password reset link to <strong>{email}</strong>. Check your inbox and spam folder.</p>
              </SuccessMsg>
            )}
          </AnimatePresence>

          {!submitted && (
            <Form onSubmit={handleSubmit}>
              <FormGroupWrapper>
                <Label htmlFor="email">Email Address</Label>
                <InputWrapper>
                  <FaEnvelope />
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputWrapper>
              </FormGroupWrapper>

              <Button type="submit" disabled={loading}>
                {loading ? 'Sending...' : (
                  <>
                    Send Reset Link <FaPaperPlane size={14} />
                  </>
                )}
              </Button>
            </Form>
          )}

          <BackLink to="/login">
            <FaArrowLeft size={12} /> Back to Sign In
          </BackLink>
        </ForgotCard>
      </FormSide>
    </ForgotContainer>
  );
};

export default ForgotPassword;
