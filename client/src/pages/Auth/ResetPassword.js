import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaArrowRight, FaHome, FaCheckCircle } from 'react-icons/fa';

const ResetContainer = styled.div`
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

const ResetCard = styled(motion.div)`
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

const ResetHeader = styled.div`
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

const SuccessContainer = styled(motion.div)`
  text-align: center;
  
  .icon {
    font-size: 4rem;
    color: #059669;
    margin-bottom: 1.5rem;
  }
  
  h2 {
    font-size: 1.75rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 0.75rem;
  }
  
  p {
    color: #6b7280;
    font-size: 1.05rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
`;

const LoginLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1.125rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white !important;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  box-shadow: 0 10px 20px rgba(217, 119, 6, 0.2);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(217, 119, 6, 0.3);
  }
`;

const PasswordStrength = styled.div`
  margin-top: 0.5rem;
  
  .bar-container {
    display: flex;
    gap: 4px;
    margin-bottom: 0.25rem;
  }
  
  .bar {
    height: 4px;
    flex: 1;
    border-radius: 2px;
    background: #e5e7eb;
    transition: background 0.3s;
  }
  
  .bar.active {
    background: ${props => {
      if (props.strength <= 1) return '#ef4444';
      if (props.strength === 2) return '#f59e0b';
      if (props.strength === 3) return '#10b981';
      return '#059669';
    }};
  }
  
  .label {
    font-size: 0.75rem;
    color: ${props => {
      if (props.strength <= 1) return '#ef4444';
      if (props.strength === 2) return '#f59e0b';
      if (props.strength === 3) return '#10b981';
      return '#059669';
    }};
    font-weight: 600;
  }
`;

const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

const getStrengthLabel = (strength) => {
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  return labels[strength] || '';
};

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`/api/auth/reset-password/${token}`, { password });
      if (response.data.message) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResetContainer>
      <VisualSide>
        <DecorativeCircle top="-50px" left="-50px" size="400px" />
        <DecorativeCircle bottom="10%" right="-100px" size="350px" />
        <div className="content">
          <h2>Create a New Password.</h2>
          <p>Choose a strong password to keep your account secure and continue exploring authentic crafts.</p>
        </div>
      </VisualSide>

      <FormSide>
        <ResetCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LogoLink to="/">
            <FaHome size={20} />
            <span>Go to Home</span>
          </LogoLink>

          {!success ? (
            <>
              <ResetHeader>
                <h1>Reset Password</h1>
                <p>Enter your new password below. Make sure it's at least 6 characters long.</p>
              </ResetHeader>

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

              <Form onSubmit={handleSubmit}>
                <FormGroupWrapper>
                  <Label htmlFor="password">New Password</Label>
                  <InputWrapper>
                    <FaLock />
                    <Input
                      type="password"
                      id="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                      required
                      minLength={6}
                    />
                  </InputWrapper>
                  {password && (
                    <PasswordStrength strength={strength}>
                      <div className="bar-container">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className={`bar ${i <= strength ? 'active' : ''}`} />
                        ))}
                      </div>
                      <span className="label">{getStrengthLabel(strength)}</span>
                    </PasswordStrength>
                  )}
                </FormGroupWrapper>

                <FormGroupWrapper>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <InputWrapper>
                    <FaLock />
                    <Input
                      type="password"
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); if (error) setError(''); }}
                      required
                      minLength={6}
                    />
                  </InputWrapper>
                </FormGroupWrapper>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Resetting...' : (
                    <>
                      Reset Password <FaArrowRight size={16} />
                    </>
                  )}
                </Button>
              </Form>
            </>
          ) : (
            <SuccessContainer
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="icon">
                <FaCheckCircle />
              </div>
              <h2>Password Reset!</h2>
              <p>Your password has been changed successfully. You can now sign in with your new password.</p>
              <LoginLink to="/login">
                Go to Login <FaArrowRight size={16} />
              </LoginLink>
            </SuccessContainer>
          )}
        </ResetCard>
      </FormSide>
    </ResetContainer>
  );
};

export default ResetPassword;
