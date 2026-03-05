import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FiPackage,
  FiTruck,
  FiCheck,
  FiMapPin,
  FiCreditCard,
  FiCalendar,
  FiArrowLeft,
  FiPhone,
  FiUser,
  FiShoppingBag,
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';
import api from '../../lib/api';

const OrderDetailContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%);
  padding: 2rem 0 4rem;
`;

const OrderDetailContent = styled.div`
  max-width: 1000px;
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

const OrderNumber = styled.p`
  text-align: center;
  color: #92400e;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  font-weight: 500;
`;

const OrderLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 1.5rem;
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

const SectionContent = styled.div`
  padding: 1.5rem;
`;

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  border-radius: 12px;
  border: 1px solid #fde68a;
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #fde68a;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    color: #d97706;
    font-size: 2rem;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-size: 1.05rem;
  font-weight: 600;
  color: #78350f;
  margin-bottom: 0.25rem;
`;

const ItemMeta = styled.div`
  font-size: 0.875rem;
  color: #92400e;
  margin-bottom: 0.5rem;
`;

const ItemPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #d97706;
`;

const AddressCard = styled.div`
  padding: 1rem;
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  border-radius: 12px;
  border: 1px solid #fde68a;
`;

const AddressTitle = styled.div`
  font-weight: 600;
  color: #78350f;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #d97706;
  }
`;

const AddressText = styled.div`
  color: #92400e;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(120, 53, 15, 0.08);
  overflow: hidden;
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

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  font-weight: 600;
  text-transform: capitalize;
  background: ${props => {
    switch (props.$status) {
      case 'delivered': return 'linear-gradient(135deg, #d1fae5, #a7f3d0)';
      case 'shipped': return 'linear-gradient(135deg, #dbeafe, #bfdbfe)';
      case 'cancelled': return 'linear-gradient(135deg, #fee2e2, #fecaca)';
      case 'processing': return 'linear-gradient(135deg, #fef3c7, #fde68a)';
      default: return 'linear-gradient(135deg, #fef3c7, #fde68a)';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'delivered': return '#059669';
      case 'shipped': return '#2563eb';
      case 'cancelled': return '#dc2626';
      case 'processing': return '#d97706';
      default: return '#78350f';
    }
  }};
  border: 1px solid ${props => {
    switch (props.$status) {
      case 'delivered': return '#a7f3d0';
      case 'shipped': return '#bfdbfe';
      case 'cancelled': return '#fecaca';
      default: return '#fde68a';
    }
  }};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
  
  span:first-child {
    color: #78350f;
    font-size: 0.95rem;
  }

  span:last-child {
    color: #78350f;
    font-weight: 600;
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

const PaymentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 10px;
  margin-top: 1rem;
  border: 1px solid #fde68a;
`;

const PaymentIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PaymentDetails = styled.div`
  flex: 1;

  div:first-child {
    font-weight: 600;
    color: #78350f;
    text-transform: uppercase;
    font-size: 0.9rem;
  }

  div:last-child {
    color: #92400e;
    font-size: 0.8rem;
    text-transform: capitalize;
  }
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TimelineItem = styled.div`
  display: flex;
  gap: 1rem;
  position: relative;
  padding-bottom: 1.5rem;

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 32px;
    bottom: 0;
    width: 2px;
    background: ${props => props.$completed ? '#d97706' : '#fde68a'};
  }
`;

const TimelineIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$completed ? 'linear-gradient(135deg, #d97706, #b45309)' : '#fde68a'};
  color: ${props => props.$completed ? 'white' : '#b5651d'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineTitle = styled.div`
  font-weight: 600;
  color: ${props => props.$completed ? '#78350f' : '#b5651d'};
  font-size: 0.95rem;
`;

const TimelineDate = styled.div`
  font-size: 0.8rem;
  color: #92400e;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 3rem;
  color: #78350f;
  font-size: 1.1rem;
`;

const NotFound = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  
  h2 {
    color: #78350f;
    margin-bottom: 1rem;
  }
`;

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <FiCheckCircle />;
      case 'shipped': return <FiTruck />;
      case 'processing': return <FiClock />;
      default: return <FiPackage />;
    }
  };

  const orderStages = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const getStageIndex = (status) => {
    const idx = orderStages.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <OrderDetailContainer>
      <OrderDetailContent>
        <BackLink to="/orders">
          <FiArrowLeft />
          Back to Orders
        </BackLink>

        <PageTitle>
          <FiShoppingBag />
          Order Details
        </PageTitle>

        {loading ? (
          <LoadingSpinner>Loading order details...</LoadingSpinner>
        ) : order ? (
          <>
            <OrderNumber>Order #{order.orderNumber}</OrderNumber>

            <OrderLayout>
              <MainSection>
                <Section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SectionHeader>
                    <FiPackage />
                    Items Ordered
                  </SectionHeader>
                  <SectionContent>
                    <OrderItems>
                      {order.items?.map((item, idx) => (
                        <OrderItem key={idx}>
                          <ItemImage>
                            {item.product?.images?.[0]?.url ? (
                              <img src={item.product.images[0].url} alt={item.product.name} />
                            ) : (
                              <FiPackage />
                            )}
                          </ItemImage>
                          <ItemDetails>
                            <ItemName>{item.product?.name || 'Product'}</ItemName>
                            <ItemMeta>Quantity: {item.quantity}</ItemMeta>
                            <ItemPrice>₹{formatPrice(item.price * item.quantity)}</ItemPrice>
                          </ItemDetails>
                        </OrderItem>
                      ))}
                    </OrderItems>
                  </SectionContent>
                </Section>

                <Section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <SectionHeader>
                    <FiMapPin />
                    Shipping Address
                  </SectionHeader>
                  <SectionContent>
                    <AddressCard>
                      <AddressTitle>
                        <FiUser size={16} />
                        {order.shippingAddress?.name}
                      </AddressTitle>
                      <AddressText>
                        {order.shippingAddress?.street}<br />
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}<br />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <FiPhone size={14} style={{ color: '#d97706' }} />
                          {order.shippingAddress?.phone}
                        </div>
                      </AddressText>
                    </AddressCard>
                  </SectionContent>
                </Section>

                <Section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <SectionHeader>
                    <FiTruck />
                    Order Tracking
                  </SectionHeader>
                  <SectionContent>
                    <Timeline>
                      {orderStages.map((stage, idx) => {
                        const isCompleted = idx <= getStageIndex(order.status);
                        const matchingEvent = order.supplyChain?.find(s => s.stage === stage.key);
                        return (
                          <TimelineItem key={stage.key} $completed={isCompleted}>
                            <TimelineIcon $completed={isCompleted}>
                              {isCompleted ? <FiCheck size={16} /> : <FiClock size={14} />}
                            </TimelineIcon>
                            <TimelineContent>
                              <TimelineTitle $completed={isCompleted}>{stage.label}</TimelineTitle>
                              {matchingEvent && (
                                <TimelineDate>{formatDate(matchingEvent.timestamp)}</TimelineDate>
                              )}
                            </TimelineContent>
                          </TimelineItem>
                        );
                      })}
                    </Timeline>
                  </SectionContent>
                </Section>
              </MainSection>

              <Sidebar>
                <SummaryCard>
                  <SummaryHeader>
                    <FiCreditCard />
                    Order Summary
                  </SummaryHeader>
                  <SummaryContent>
                    <StatusBadge $status={order.status}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </StatusBadge>

                    <SummaryRow>
                      <span>
                        <FiCalendar size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        Order Date
                      </span>
                      <span>{formatDate(order.createdAt).split(',')[0]}</span>
                    </SummaryRow>

                    <SummaryRow>
                      <span>Subtotal</span>
                      <span>₹{formatPrice(order.payment?.amount?.subtotal)}</span>
                    </SummaryRow>
                    <SummaryRow>
                      <span>Tax (18% GST)</span>
                      <span>₹{formatPrice(order.payment?.amount?.tax)}</span>
                    </SummaryRow>
                    <SummaryRow>
                      <span>Shipping</span>
                      <span>{order.payment?.amount?.shipping === 0 ? 'FREE' : `₹${formatPrice(order.payment?.amount?.shipping)}`}</span>
                    </SummaryRow>

                    <TotalRow>
                      <span>Total</span>
                      <span>₹{formatPrice(order.payment?.amount?.total)}</span>
                    </TotalRow>

                    <PaymentInfo>
                      <PaymentIcon>
                        <FiCreditCard size={18} />
                      </PaymentIcon>
                      <PaymentDetails>
                        <div>{order.payment?.method}</div>
                        <div>Status: {order.payment?.status}</div>
                      </PaymentDetails>
                    </PaymentInfo>
                  </SummaryContent>
                </SummaryCard>
              </Sidebar>
            </OrderLayout>
          </>
        ) : (
          <NotFound>
            <h2>Order not found</h2>
            <p>The order you're looking for doesn't exist.</p>
            <BackLink to="/orders">Back to Orders</BackLink>
          </NotFound>
        )}
      </OrderDetailContent>
    </OrderDetailContainer>
  );
};

export default OrderDetail;
