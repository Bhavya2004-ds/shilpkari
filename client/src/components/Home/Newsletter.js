import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const NewsletterContainer = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, #1f2937, #111827);
  color: white;
`;

const NewsletterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const NewsletterForm = styled.form`
  max-width: 640px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  margin-top: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const EmailInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid rgba(217, 119, 6, 0.3);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    border-color: #d97706;
    box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
  }
`;

const SubscribeButton = styled.button`
  padding: 0.9rem 1.5rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: linear-gradient(135deg, #b45309, #92400e);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px 0 rgba(217, 119, 6, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
   
`;

const Newsletter = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmail('');
      toast.success('Successfully subscribed to newsletter!');
    }, 1000);
  };

  return (
    <NewsletterContainer>
      <NewsletterContent>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem',color: '#fff' }}>
            Stay Updated
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#d1d5db', marginBottom: '2rem' }}>
            Get the latest updates on new products, artisan stories, and exclusive offers
          </p>

          <NewsletterForm onSubmit={handleSubmit}>
            <EmailInput
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <SubscribeButton type="submit" disabled={isLoading}>
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </SubscribeButton>
          </NewsletterForm>
        </motion.div>
      </NewsletterContent>
    </NewsletterContainer>
  );
};

export default Newsletter;
