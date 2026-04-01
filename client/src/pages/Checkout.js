import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCreditCard,
  FiMapPin,
  FiPackage,
  FiCheck,
  FiTruck,
  FiShield,
  FiUser,
  FiPhone,
  FiHome,
  FiArrowLeft,
  FiLock,
  FiX,
  FiSmartphone,
  FiCheckCircle
} from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const CheckoutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%);
  padding: 2rem 0 4rem;
`;

const CheckoutContent = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #78350f;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 1.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: #d97706;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #78350f;
  text-align: center;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  svg {
    color: #d97706;
  }
`;

const SecureBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #92400e;
  font-size: 0.9rem;
  margin-bottom: 2rem;

  svg {
    color: #d97706;
  }
`;

const CheckoutLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Section = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(120, 53, 15, 0.08);
  overflow: hidden;
  border: 1px solid rgba(217, 119, 6, 0.1);
`;

const SectionHeader = styled.div`
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StepNumber = styled.span`
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
`;

const SectionContent = styled.div`
  padding: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.$cols || 2}, 1fr);
  gap: 1rem;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #78350f;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #d97706;
  }
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid #fde68a;
  border-radius: 10px;
  font-size: 1rem;
  background: #fffbeb;
  transition: all 0.2s ease;
  color: #78350f;

  &:focus {
    outline: none;
    border-color: #d97706;
    background: white;
    box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
  }

  &::placeholder {
    color: #b5651d;
  }
`;

const TextArea = styled.textarea`
  padding: 0.875rem 1rem;
  border: 2px solid #fde68a;
  border-radius: 10px;
  font-size: 1rem;
  background: #fffbeb;
  transition: all 0.2s ease;
  color: #78350f;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #d97706;
    background: white;
    box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
  }

  &::placeholder {
    color: #b5651d;
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const PaymentOption = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: ${props => props.$selected ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : '#fffbeb'};
  border: 2px solid ${props => props.$selected ? '#d97706' : '#fde68a'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d97706;
    background: linear-gradient(135deg, #fef3c7, #fde68a);
  }

  input {
    display: none;
  }
`;

const RadioCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${props => props.$selected ? '#d97706' : '#b5651d'};
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;

  &::after {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.$selected ? '#d97706' : 'transparent'};
    transition: all 0.2s ease;
  }
`;

const PaymentIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const PaymentInfo = styled.div`
  flex: 1;

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #78350f;
    margin: 0 0 0.25rem;
  }

  p {
    font-size: 0.85rem;
    color: #92400e;
    margin: 0;
  }
`;

const DemoBadge = styled.span`
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  font-size: 0.65rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 0.5rem;
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(120, 53, 15, 0.08);
  overflow: hidden;
  position: sticky;
  top: 100px;
  border: 1px solid rgba(217, 119, 6, 0.1);
`;

const SummaryHeader = styled.div`
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SummaryContent = styled.div`
  padding: 1.5rem;
`;

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 250px;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #fef3c7;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d97706;
    border-radius: 3px;
  }
`;

const OrderItem = styled.div`
  display: flex;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed #fde68a;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const ItemImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid #fde68a;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    color: #d97706;
    font-size: 1.5rem;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #78350f;
  margin-bottom: 0.25rem;
  line-height: 1.3;
`;

const ItemMeta = styled.div`
  font-size: 0.8rem;
  color: #92400e;
`;

const ItemPrice = styled.div`
  font-weight: 700;
  color: #d97706;
  font-size: 0.95rem;
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, #fde68a, transparent);
  margin: 0.5rem 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
  
  span:first-child {
    color: #78350f;
    font-size: 0.95rem;
    font-weight: 500;
  }

  span:last-child {
    color: #78350f;
    font-weight: 600;
    font-size: 1rem;
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0 0;
  margin-top: 0.5rem;
  border-top: 2px solid #d97706;

  span:first-child {
    color: #78350f;
    font-size: 1.1rem;
    font-weight: 700;
  }

  span:last-child {
    color: #d97706;
    font-weight: 800;
    font-size: 1.5rem;
  }
`;

const PlaceOrderButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.125rem 1.5rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);
  margin-top: 1.25rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(217, 119, 6, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TrustBadges = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 1rem 0;
  margin-top: 1rem;
  border-top: 1px dashed #fde68a;
`;

const TrustItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  
  svg {
    color: #d97706;
    font-size: 1.25rem;
  }
  
  span {
    font-size: 0.7rem;
    color: #78350f;
    font-weight: 500;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(120, 53, 15, 0.08);
  border: 1px solid rgba(217, 119, 6, 0.1);

  svg {
    font-size: 4rem;
    color: #d97706;
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
    color: #78350f;
    margin-bottom: 0.75rem;
  }

  p {
    color: #92400e;
    margin-bottom: 2rem;
  }
`;

const ShopButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(217, 119, 6, 0.4);
    color: white;
  }
`;

const FreeShippingBadge = styled.div`
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #78350f;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid #fde68a;
`;

// Payment Modal Styles
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 1.5rem;
  max-width: 450px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const DemoNotice = styled.div`
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #78350f;
  font-weight: 500;
`;

const UPISection = styled.div`
  text-align: center;
`;

const QRCode = styled.div`
  width: 180px;
  height: 180px;
  margin: 1.5rem auto;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: #78350f;
  border: 2px dashed #d97706;
  flex-direction: column;
  gap: 0.5rem;

  svg {
    font-size: 3rem;
    color: #d97706;
  }
`;

const UPIId = styled.div`
  background: #f5f5f5;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.95rem;
  color: #78350f;
  margin-bottom: 1rem;
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.25rem 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #fde68a;
  }

  span {
    padding: 0 1rem;
    color: #92400e;
    font-size: 0.875rem;
  }
`;

const CardSection = styled.div``;

const CardInputGroup = styled.div`
  margin-bottom: 1rem;
`;

const CardInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #fde68a;
  border-radius: 10px;
  font-size: 1rem;
  background: #fffbeb;
  transition: all 0.2s ease;
  color: #78350f;

  &:focus {
    outline: none;
    border-color: #d97706;
    background: white;
    box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
  }

  &::placeholder {
    color: #b5651d;
  }
`;

const CardRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const PayButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(217, 119, 6, 0.35);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ProcessingOverlay = styled.div`
  text-align: center;
  padding: 2rem 0;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid #fde68a;
  border-top-color: #d97706;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 1.5rem;
`;

const ProcessingText = styled.p`
  color: #78350f;
  font-weight: 500;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const SuccessOverlay = styled.div`
  text-align: center;
  padding: 2rem 0;

  svg {
    font-size: 4rem;
    color: #10b981;
    margin-bottom: 1rem;
  }

  h4 {
    color: #78350f;
    font-size: 1.25rem;
    margin: 0 0 0.5rem;
  }

  p {
    color: #92400e;
    font-size: 0.9rem;
    margin: 0;
  }
`;

const Checkout = () => {
  const { items, subtotal, tax, shipping, total, clear } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    country: 'India'
  });

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [upiId, setUpiId] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
      formattedValue = formattedValue.replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
      }
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
  };

  const validateShippingAddress = () => {
    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.street ||
      !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      toast.error('Please fill all shipping details');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateShippingAddress()) return;

    if (paymentMethod === 'cod') {
      placeOrder();
    } else if (paymentMethod === 'card') {
      // Stripe Checkout redirect
      await handleStripeCheckout();
    } else {
      setShowPaymentModal(true);
    }
  };

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const payload = {
        items: items.map(i => ({
          product: i.id,
          quantity: i.quantity,
        })),
        shippingAddress,
      };
      const { data } = await api.post('/orders/create-checkout-session', payload);
      // Redirect to Stripe hosted checkout
      window.location.href = data.sessionUrl;
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to start payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const simulateDemoPayment = async () => {
    setPaymentProcessing(true);
    // Simulate payment processing (UPI demo only)
    await new Promise(resolve => setTimeout(resolve, 2500));
    setPaymentProcessing(false);
    setPaymentSuccess(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await placeOrder(true);
  };

  const placeOrder = async (skipInventoryCheck = false) => {
    if (items.length === 0) return;

    setLoading(true);
    try {
      const payload = {
        items: items.map(i => ({
          product: i.id,
          quantity: i.quantity,
          price: Number(String(i.price).replace(/[^0-9.]/g, ''))
        })),
        shippingAddress,
        billingAddress: shippingAddress,
        payment: {
          method: paymentMethod,
          status: paymentMethod === 'cod' ? 'pending' : 'completed'
        },
        skipInventoryCheck
      };
      const { data } = await api.post('/orders', payload);
      toast.success('Order placed successfully! 🎉');
      clear();
      setShowPaymentModal(false);
      navigate(`/orders/${data.order.id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Order failed. Please try again.');
      setShowPaymentModal(false);
      setPaymentSuccess(false);
      setPaymentProcessing(false);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setPaymentProcessing(false);
    setPaymentSuccess(false);
    setCardDetails({ number: '', name: '', expiry: '', cvv: '' });
    setUpiId('');
  };

  return (
    <CheckoutContainer>
      <CheckoutContent>
        <BackLink to="/cart">
          <FiArrowLeft />
          Back to Cart
        </BackLink>

        <PageTitle>
          <FiCreditCard />
          Checkout
        </PageTitle>
        <SecureBadge>
          <FiLock />
          Secure Checkout - Your data is protected
        </SecureBadge>

        {items.length === 0 ? (
          <EmptyCart>
            <FiPackage />
            <h2>Your cart is empty</h2>
            <p>Add some items to your cart before checking out.</p>
            <ShopButton to="/products">
              Start Shopping
            </ShopButton>
          </EmptyCart>
        ) : (
          <Form onSubmit={handlePlaceOrder}>
            <CheckoutLayout>
              <MainSection>
                <Section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SectionHeader>
                    <StepNumber>1</StepNumber>
                    <FiMapPin />
                    Shipping Address
                  </SectionHeader>
                  <SectionContent>
                    <FormRow>
                      <FormGroup>
                        <Label><FiUser size={14} /> Full Name *</Label>
                        <Input
                          type="text"
                          name="name"
                          value={shippingAddress.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label><FiPhone size={14} /> Phone Number *</Label>
                        <Input
                          type="tel"
                          name="phone"
                          value={shippingAddress.phone}
                          onChange={handleInputChange}
                          placeholder="10-digit mobile number"
                          required
                        />
                      </FormGroup>
                    </FormRow>
                    <FormGroup>
                      <Label><FiHome size={14} /> Street Address *</Label>
                      <TextArea
                        name="street"
                        value={shippingAddress.street}
                        onChange={handleInputChange}
                        placeholder="House/Flat No., Building Name, Street, Locality"
                        required
                      />
                    </FormGroup>
                    <FormRow $cols={3}>
                      <FormGroup>
                        <Label>City *</Label>
                        <Input
                          type="text"
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleInputChange}
                          placeholder="Enter city"
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>State *</Label>
                        <Input
                          type="text"
                          name="state"
                          value={shippingAddress.state}
                          onChange={handleInputChange}
                          placeholder="Enter state"
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>PIN Code *</Label>
                        <Input
                          type="text"
                          name="pincode"
                          value={shippingAddress.pincode}
                          onChange={handleInputChange}
                          placeholder="6-digit PIN"
                          required
                        />
                      </FormGroup>
                    </FormRow>
                  </SectionContent>
                </Section>

                <Section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <SectionHeader>
                    <StepNumber>2</StepNumber>
                    <FiCreditCard />
                    Payment Method
                  </SectionHeader>
                  <SectionContent>
                    <PaymentMethods>
                      <PaymentOption $selected={paymentMethod === 'cod'}>
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <RadioCircle $selected={paymentMethod === 'cod'} />
                        <PaymentIcon>
                          <FiTruck />
                        </PaymentIcon>
                        <PaymentInfo>
                          <h4>Cash on Delivery</h4>
                          <p>Pay when you receive your order</p>
                        </PaymentInfo>
                      </PaymentOption>

                      <PaymentOption $selected={paymentMethod === 'upi'}>
                        <input
                          type="radio"
                          name="payment"
                          value="upi"
                          checked={paymentMethod === 'upi'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <RadioCircle $selected={paymentMethod === 'upi'} />
                        <PaymentIcon>
                          <FiSmartphone />
                        </PaymentIcon>
                        <PaymentInfo>
                          <h4>UPI Payment <DemoBadge>Demo</DemoBadge></h4>
                          <p>Pay using Google Pay, PhonePe, Paytm</p>
                        </PaymentInfo>
                      </PaymentOption>

                      <PaymentOption $selected={paymentMethod === 'card'}>
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <RadioCircle $selected={paymentMethod === 'card'} />
                        <PaymentIcon>
                          <FiCreditCard />
                        </PaymentIcon>
                        <PaymentInfo>
                          <h4>Credit/Debit Card <DemoBadge>Stripe</DemoBadge></h4>
                          <p>Secure payment via Stripe (test mode)</p>
                        </PaymentInfo>
                      </PaymentOption>
                    </PaymentMethods>
                  </SectionContent>
                </Section>
              </MainSection>

              <OrderSummary>
                <SummaryHeader>
                  <FiPackage />
                  Order Summary
                </SummaryHeader>
                <SummaryContent>
                  {subtotal > 1000 && (
                    <FreeShippingBadge>
                      <FiTruck />
                      FREE Shipping Applied!
                    </FreeShippingBadge>
                  )}

                  <OrderItems>
                    {items.map(item => (
                      <OrderItem key={item.id}>
                        <ItemImage>
                          {item.image ? (
                            <img src={item.image} alt={item.name} />
                          ) : (
                            <FiPackage />
                          )}
                        </ItemImage>
                        <ItemDetails>
                          <ItemName>{item.name}</ItemName>
                          <ItemMeta>Qty: {item.quantity}</ItemMeta>
                        </ItemDetails>
                        <ItemPrice>
                          ₹{(Number(String(item.price).replace(/[^0-9.]/g, '')) * item.quantity).toLocaleString('en-IN')}
                        </ItemPrice>
                      </OrderItem>
                    ))}
                  </OrderItems>

                  <Divider />

                  <SummaryRow>
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>Tax (18% GST)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                  </SummaryRow>
                  <TotalRow>
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </TotalRow>

                  <PlaceOrderButton type="submit" disabled={loading}>
                    {loading ? (
                      'Processing...'
                    ) : (
                      <>
                        <FiCheck />
                        {paymentMethod === 'cod' ? 'Place Order' : paymentMethod === 'card' ? 'Pay with Stripe' : 'Proceed to Pay'}
                      </>
                    )}
                  </PlaceOrderButton>

                  <TrustBadges>
                    <TrustItem>
                      <FiShield />
                      <span>Secure</span>
                    </TrustItem>
                    <TrustItem>
                      <FiTruck />
                      <span>Fast Delivery</span>
                    </TrustItem>
                    <TrustItem>
                      <FiPackage />
                      <span>Quality</span>
                    </TrustItem>
                  </TrustBadges>
                </SummaryContent>
              </OrderSummary>
            </CheckoutLayout>
          </Form>
        )}
      </CheckoutContent>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!paymentProcessing ? closeModal : undefined}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <h3>
                  {paymentMethod === 'upi' ? <FiSmartphone /> : <FiCreditCard />}
                  {paymentMethod === 'upi' ? 'UPI Payment' : 'Card Payment'}
                </h3>
                {!paymentProcessing && !paymentSuccess && (
                  <CloseButton onClick={closeModal}>
                    <FiX size={20} />
                  </CloseButton>
                )}
              </ModalHeader>
              <ModalBody>
                {paymentSuccess ? (
                  <SuccessOverlay>
                    <FiCheckCircle />
                    <h4>Payment Successful!</h4>
                    <p>Redirecting to your order...</p>
                  </SuccessOverlay>
                ) : paymentProcessing ? (
                  <ProcessingOverlay>
                    <Spinner />
                    <ProcessingText>Processing your payment...</ProcessingText>
                  </ProcessingOverlay>
                ) : (
                  <>
                    <DemoNotice>
                      🎭 This is a <strong>DEMO</strong> payment gateway for testing purposes only.
                      No real transactions will be processed.
                    </DemoNotice>

                    {paymentMethod === 'upi' ? (
                      <UPISection>
                        <QRCode>
                          <FiSmartphone />
                          <span>Demo QR Code</span>
                        </QRCode>
                        <UPIId>shilpkari@demo</UPIId>
                        <OrDivider><span>OR</span></OrDivider>
                        <CardInputGroup>
                          <CardInput
                            type="text"
                            placeholder="Enter your UPI ID (e.g., name@upi)"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                          />
                        </CardInputGroup>
                        <PayButton onClick={simulateDemoPayment}>
                          <FiLock size={16} />
                          Pay ₹{total.toFixed(2)}
                        </PayButton>
                      </UPISection>
                    ) : (
                      <CardSection>
                        <CardInputGroup>
                          <Label>Card Number</Label>
                          <CardInput
                            type="text"
                            name="number"
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.number}
                            onChange={handleCardChange}
                          />
                        </CardInputGroup>
                        <CardInputGroup>
                          <Label>Cardholder Name</Label>
                          <CardInput
                            type="text"
                            name="name"
                            placeholder="Name on card"
                            value={cardDetails.name}
                            onChange={handleCardChange}
                          />
                        </CardInputGroup>
                        <CardRow>
                          <CardInputGroup>
                            <Label>Expiry</Label>
                            <CardInput
                              type="text"
                              name="expiry"
                              placeholder="MM/YY"
                              value={cardDetails.expiry}
                              onChange={handleCardChange}
                            />
                          </CardInputGroup>
                          <CardInputGroup>
                            <Label>CVV</Label>
                            <CardInput
                              type="password"
                              name="cvv"
                              placeholder="•••"
                              value={cardDetails.cvv}
                              onChange={handleCardChange}
                            />
                          </CardInputGroup>
                        </CardRow>
                        <PayButton onClick={simulateDemoPayment}>
                          <FiLock size={16} />
                          Pay ₹{total.toFixed(2)}
                        </PayButton>
                      </CardSection>
                    )}
                  </>
                )}
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </CheckoutContainer>
  );
};

export default Checkout;
