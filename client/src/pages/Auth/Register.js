import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaArrowRight, FaHome } from 'react-icons/fa';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: #fdfcfb;
  overflow: hidden;
  
  @media (max-width: 900px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem 1rem;
  }
`;

const VisualSide = styled.div`
  flex: 1.1;
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

  @media (min-width: 1800px) {
    padding: 6rem 8rem;
  }
  
  @media (max-width: 1200px) {
    flex: 1;
    padding: 3rem;
  }

  @media (max-width: 900px) {
    display: none;
  }
  
  .content {
    position: relative;
    z-index: 2;
    max-width: 500px;

    @media (min-width: 1800px) {
      max-width: 600px;
    }
  }
  
  h2 {
    font-size: 3.5rem;
    font-weight: 800;
    color: #ffffff !important;
    margin-bottom: 1.5rem;
    line-height: 1.1;
    letter-spacing: -2px;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);

    @media (min-width: 1800px) {
      font-size: 4rem;
    }

    @media (max-width: 1200px) {
      font-size: 2.75rem;
    }
  }
  
  p {
    font-size: 1.25rem;
    color: #ffffff !important;
    opacity: 0.95;
    line-height: 1.6;
    margin-bottom: 3rem;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.4);

    @media (max-width: 1200px) {
      font-size: 1.1rem;
    }
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
  padding: 3rem 4rem;
  background: white;
  overflow-y: auto;

  @media (min-width: 1800px) {
    padding: 4rem 6rem;
  }

  @media (max-width: 1200px) {
    padding: 2.5rem;
  }
  
  @media (max-width: 900px) {
    padding: 0;
    width: 100%;
    max-width: 540px;
    background: transparent;
  }
`;

const RegisterCard = styled(motion.div)`
  width: 100%;
  max-width: 480px;

  @media (min-width: 1400px) {
    max-width: 520px;
  }

  @media (min-width: 1800px) {
    max-width: 560px;
  }
  
  @media (max-width: 900px) {
    background: white;
    padding: 2.5rem;
    border-radius: 2rem;
    box-shadow: 0 20px 50px rgba(0,0,0,0.05);
  }

  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
    border-radius: 1.5rem;
  }
`;

const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #d97706;
  text-decoration: none;
  font-weight: 700;
  margin-bottom: 2.5rem;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const RegisterHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 0.75rem;
    letter-spacing: -1px;

    @media (max-width: 480px) {
      font-size: 2rem;
    }
  }

  p {
    color: #6b7280;
    font-size: 1.1rem;

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};
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

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  color: #111827;
  cursor: pointer;

  &:focus {
    outline: none;
    background: white;
    border-color: #d97706;
    box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
  }
`;

const Button = styled.button`
  grid-column: 1 / -1;
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

const FooterText = styled.p`
  grid-column: 1 / -1;
  margin-top: 1.5rem;
  text-align: center;
  color: #6b7280;
  font-size: 1rem;

  a {
    color: #d97706;
    text-decoration: none;
    font-weight: 700;
    margin-left: 0.25rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMsg = styled(motion.div)`
  grid-column: 1 / -1;
  background: #fef2f2;
  color: #ef4444;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #fee2e2;
`;

const Register = () => {
  const { t } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <VisualSide>
        <DecorativeCircle top="-50px" right="-50px" size="400px" />
        <DecorativeCircle bottom="5%" left="-100px" size="350px" />
        <div className="content">
          <h2>Start Your Artisan Journey.</h2>
          <p>Join शिल्पकारी and be part of a curated marketplace where Indian tradition meets modern elegance.</p>
        </div>
      </VisualSide>

      <FormSide>
        <RegisterCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LogoLink to="/">
            <FaHome size={20} />
            <span>Go to Home</span>
          </LogoLink>

          <RegisterHeader>
            <h1>{t('auth.register')}</h1>
            <p>Create your account and discover authentic treasures.</p>
          </RegisterHeader>

          <AnimatePresence>
            {error && (
              <ErrorMsg
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ marginBottom: '1.25rem' }}
              >
                {error}
              </ErrorMsg>
            )}
          </AnimatePresence>

          <Form onSubmit={handleSubmit}>
            <FormGroupWrapper fullWidth>
              <Label htmlFor="name">{t('auth.name')}</Label>
              <InputWrapper>
                <FaUser />
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>
            </FormGroupWrapper>

            <FormGroupWrapper>
              <Label htmlFor="email">{t('auth.email')}</Label>
              <InputWrapper>
                <FaEnvelope />
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>
            </FormGroupWrapper>

            <FormGroupWrapper>
              <Label htmlFor="phone">{t('auth.phone')}</Label>
              <InputWrapper>
                <FaPhone />
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </InputWrapper>
            </FormGroupWrapper>

            <FormGroupWrapper fullWidth>
              <Label htmlFor="role">{t('auth.role')}</Label>
              <Select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="buyer">I want to shop (Buyer)</option>
                <option value="artisan">I want to sell (Artisan)</option>
              </Select>
            </FormGroupWrapper>

            <FormGroupWrapper>
              <Label htmlFor="password">{t('auth.password')}</Label>
              <InputWrapper>
                <FaLock />
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>
            </FormGroupWrapper>

            <FormGroupWrapper>
              <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
              <InputWrapper>
                <FaLock />
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>
            </FormGroupWrapper>

            <Button type="submit" disabled={loading}>
              {loading ? 'Creating account...' : (
                <>
                  Create Account <FaArrowRight size={16} />
                </>
              )}
            </Button>

            <FooterText>
              {t('auth.alreadyHaveAccount')} <Link to="/login">{t('auth.login')}</Link>
            </FooterText>
          </Form>
        </RegisterCard>
      </FormSide>
    </RegisterContainer>
  );
};

export default Register;
