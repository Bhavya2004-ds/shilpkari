import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiArrowRight, FiShoppingBag, FiAlertCircle } from 'react-icons/fi';
import api from '../lib/api';
import { useCart } from '../contexts/CartContext';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 20px 60px rgba(120, 53, 15, 0.12);
  max-width: 520px;
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(217, 119, 6, 0.1);
`;

const Header = styled.div`
  background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
  padding: 2.5rem 2rem;
  text-align: center;
  color: white;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: ${pulse} 2s ease-in-out infinite;
  
  svg {
    color: #4ade80;
    filter: drop-shadow(0 0 20px rgba(74, 222, 128, 0.4));
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
  color: white !important;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85) !important;
  margin: 0;
`;

const Body = styled.div`
  padding: 2rem;
`;

const OrderInfo = styled.div`
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  text-align: center;
  border: 1px solid #fde68a;
`;

const OrderLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: #92400e;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const OrderNumber = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: #78350f;
  margin-top: 0.25rem;
`;

const TotalAmount = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: #d97706;
  text-align: center;
  margin: 1rem 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const PrimaryButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white !important;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(217, 119, 6, 0.4);
  }
`;

const SecondaryButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  color: #78350f !important;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;

  &:hover {
    background: #fef3c7;
    border-color: #fde68a;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem 2rem;
`;

const LoadingBar = styled.div`
  height: 4px;
  background: #fde68a;
  border-radius: 2px;
  overflow: hidden;
  margin: 1.5rem 0;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: 40%;
    background: linear-gradient(90deg, transparent, #d97706, transparent);
    animation: ${shimmer} 1.5s ease-in-out infinite;
  }
`;

const LoadingText = styled.p`
  color: #78350f;
  font-weight: 500;
  font-size: 1rem;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;

  svg {
    font-size: 3rem;
    color: #ef4444;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.25rem;
    color: #78350f;
    margin-bottom: 0.5rem;
  }

  p {
    color: #92400e;
    margin-bottom: 1.5rem;
  }
`;

const PaymentBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #ecfdf5;
  color: #059669;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  border: 1px solid #d1fae5;
  margin-bottom: 1rem;
`;

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clear } = useCart();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      navigate('/checkout');
      return;
    }

    const verifyPayment = async () => {
      try {
        const { data } = await api.post('/orders/verify-stripe-session', { sessionId });
        setOrder(data.order);
        clear(); // Clear cart after successful order
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to verify payment. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {loading ? (
          <>
            <Header>
              <Title>Verifying Payment...</Title>
              <Subtitle>Please wait while we confirm your payment</Subtitle>
            </Header>
            <LoadingContainer>
              <FiPackage size={40} style={{ color: '#d97706', marginBottom: '1rem' }} />
              <LoadingBar />
              <LoadingText>Confirming your payment with Stripe...</LoadingText>
            </LoadingContainer>
          </>
        ) : error ? (
          <>
            <Header>
              <Title>Payment Issue</Title>
              <Subtitle>Something went wrong</Subtitle>
            </Header>
            <Body>
              <ErrorContainer>
                <FiAlertCircle />
                <h2>Could not verify payment</h2>
                <p>{error}</p>
                <PrimaryButton to="/checkout">
                  Try Again <FiArrowRight />
                </PrimaryButton>
              </ErrorContainer>
            </Body>
          </>
        ) : (
          <>
            <Header>
              <SuccessIcon>
                <FiCheckCircle />
              </SuccessIcon>
              <Title>Payment Successful!</Title>
              <Subtitle>Your order has been placed successfully</Subtitle>
            </Header>
            <Body>
              <PaymentBadge>
                <FiCheckCircle size={16} />
                Paid via Stripe (Test Mode)
              </PaymentBadge>

              {order && (
                <>
                  <OrderInfo>
                    <OrderLabel>Order ID</OrderLabel>
                    <OrderNumber>{order.orderNumber || order.id}</OrderNumber>
                  </OrderInfo>

                  <TotalAmount>
                    ₹{Number(order.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </TotalAmount>
                </>
              )}

              <ButtonGroup>
                <PrimaryButton to={order ? `/orders/${order.id}` : '/orders'}>
                  <FiPackage /> View Order Details
                </PrimaryButton>
                <SecondaryButton to="/products">
                  <FiShoppingBag /> Continue Shopping
                </SecondaryButton>
              </ButtonGroup>
            </Body>
          </>
        )}
      </Card>
    </Container>
  );
};

export default CheckoutSuccess;
