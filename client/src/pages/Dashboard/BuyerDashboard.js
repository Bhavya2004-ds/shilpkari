import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import {
  FiPackage,
  FiHeart,
  FiMapPin,
  FiStar,
  FiShoppingBag,
  FiShoppingCart,
  FiTruck,
  FiChevronRight,
  FiUser,
  FiClock
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%);
  padding: 2rem 0 4rem;
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const WelcomeSection = styled(motion.div)`
  background: linear-gradient(135deg, #78350f 0%, #92400e 50%, #b45309 100%);
  border-radius: 1.5rem;
  padding: 2.5rem;
  margin-bottom: 2rem;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px -10px rgba(120, 53, 15, 0.4);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    transform: translate(30%, -30%);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
    transform: translate(-30%, 30%);
  }
`;

const WelcomeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  z-index: 1;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: #78350f;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.3);
`;

const WelcomeText = styled.div`
  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  p {
    opacity: 0.9;
    font-size: 1.1rem;
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(217, 119, 6, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(217, 119, 6, 0.15);
    border-color: rgba(217, 119, 6, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.$gradient || 'linear-gradient(90deg, #d97706, #f59e0b)'};
  }
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: ${props => props.$bg || 'linear-gradient(135deg, #fef3c7, #fde68a)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: ${props => props.$color || '#d97706'};
  font-size: 1.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: #d97706;
  }
`;

const OrdersSection = styled.div`
  margin-bottom: 2rem;
`;

const OrdersGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const OrderCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #d97706;
    box-shadow: 0 8px 25px rgba(217, 119, 6, 0.1);
  }

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const OrderImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d97706;
  font-size: 2rem;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
  }
`;

const OrderDetails = styled.div`
  flex: 1;
`;

const OrderNumber = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
`;

const OrderDate = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const OrderStatus = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  background: ${props => {
    switch (props.$status) {
      case 'delivered': return 'linear-gradient(135deg, #d1fae5, #a7f3d0)';
      case 'shipped': return 'linear-gradient(135deg, #dbeafe, #bfdbfe)';
      case 'processing': return 'linear-gradient(135deg, #fef3c7, #fde68a)';
      case 'pending': return 'linear-gradient(135deg, #fee2e2, #fecaca)';
      default: return 'linear-gradient(135deg, #f3f4f6, #e5e7eb)';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'delivered': return '#065f46';
      case 'shipped': return '#1e40af';
      case 'processing': return '#92400e';
      case 'pending': return '#991b1b';
      default: return '#374151';
    }
  }};
`;

const OrderAmount = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #d97706;
`;

const ViewButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
    color: white;
  }
`;

const QuickActionsSection = styled.div`
  margin-bottom: 2rem;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const QuickActionCard = styled(Link)`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: #d97706;
    box-shadow: 0 12px 30px rgba(217, 119, 6, 0.1);
  }
`;

const ActionIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${props => props.$bg || 'linear-gradient(135deg, #fef3c7, #fde68a)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color || '#d97706'};
  font-size: 1.25rem;
`;

const ActionText = styled.div`
  flex: 1;

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.8rem;
    color: #6b7280;
    margin: 0;
  }
`;

const ActionArrow = styled.div`
  color: #d97706;
  font-size: 1.25rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

  svg {
    font-size: 3rem;
    color: #d97706;
    margin-bottom: 1rem;
  }

  h3 {
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  p {
    color: #6b7280;
    margin-bottom: 1.5rem;
  }
`;

const ShopButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(217, 119, 6, 0.4);
    color: white;
  }
`;

const LoadingCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  animation: ${shimmer} 1.5s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  height: 100px;
`;

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculate savedAddresses based on whether user has address set
  const hasAddress = user?.address && user.address.trim() !== '';

  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistItems: 0,
    savedAddresses: hasAddress ? 1 : 0,
    reviewsGiven: 0
  });

  useEffect(() => {
    // Update savedAddresses when user changes
    setStats(prev => ({
      ...prev,
      savedAddresses: (user?.address && user.address.trim() !== '') ? 1 : 0
    }));
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await api.get('/orders/my-orders');
        const ordersData = ordersRes.data.orders || [];
        setOrders(ordersData.slice(0, 3)); // Get last 3 orders
        setStats(prev => ({
          ...prev,
          totalOrders: ordersData.length
        }));
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <DashboardContainer>
      <DashboardContent>
        <WelcomeSection
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <WelcomeHeader>
            <Avatar>{getInitials(user?.name)}</Avatar>
            <WelcomeText>
              <h1>Welcome back, {user?.name?.split(' ')[0]}!</h1>
              <p>Here's what's happening with your orders today</p>
            </WelcomeText>
          </WelcomeHeader>
        </WelcomeSection>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <StatsGrid>
            <StatCard
              variants={itemVariants}
              $gradient="linear-gradient(90deg, #d97706, #f59e0b)"
            >
              <StatIcon $bg="linear-gradient(135deg, #fef3c7, #fde68a)" $color="#d97706">
                <FiPackage />
              </StatIcon>
              <StatValue>{stats.totalOrders}</StatValue>
              <StatLabel>Total Orders</StatLabel>
            </StatCard>

            <StatCard
              variants={itemVariants}
              $gradient="linear-gradient(90deg, #b45309, #d97706)"
            >
              <StatIcon $bg="linear-gradient(135deg, #fef3c7, #fde68a)" $color="#b45309">
                <FiHeart />
              </StatIcon>
              <StatValue>{stats.wishlistItems}</StatValue>
              <StatLabel>Wishlist Items</StatLabel>
            </StatCard>

            <StatCard
              variants={itemVariants}
              $gradient="linear-gradient(90deg, #92400e, #b45309)"
            >
              <StatIcon $bg="linear-gradient(135deg, #fef3c7, #fde68a)" $color="#92400e">
                <FiMapPin />
              </StatIcon>
              <StatValue>{stats.savedAddresses}</StatValue>
              <StatLabel>Saved Addresses</StatLabel>
            </StatCard>

            <StatCard
              variants={itemVariants}
              $gradient="linear-gradient(90deg, #78350f, #92400e)"
            >
              <StatIcon $bg="linear-gradient(135deg, #fef3c7, #fde68a)" $color="#78350f">
                <FiStar />
              </StatIcon>
              <StatValue>{stats.reviewsGiven}</StatValue>
              <StatLabel>Reviews Given</StatLabel>
            </StatCard>
          </StatsGrid>
        </motion.div>

        <QuickActionsSection>
          <SectionTitle>
            <FiShoppingBag />
            Quick Actions
          </SectionTitle>
          <QuickActionsGrid>
            <QuickActionCard to="/products">
              <ActionIcon $bg="linear-gradient(135deg, #fef3c7, #fde68a)" $color="#d97706">
                <FiShoppingBag />
              </ActionIcon>
              <ActionText>
                <h4>Browse Products</h4>
                <p>Explore handcrafted items</p>
              </ActionText>
              <ActionArrow><FiChevronRight /></ActionArrow>
            </QuickActionCard>

            <QuickActionCard to="/cart">
              <ActionIcon $bg="linear-gradient(135deg, #dbeafe, #bfdbfe)" $color="#3b82f6">
                <FiShoppingCart />
              </ActionIcon>
              <ActionText>
                <h4>View Cart</h4>
                <p>Check your shopping cart</p>
              </ActionText>
              <ActionArrow><FiChevronRight /></ActionArrow>
            </QuickActionCard>

            <QuickActionCard to="/orders">
              <ActionIcon $bg="linear-gradient(135deg, #d1fae5, #a7f3d0)" $color="#10b981">
                <FiTruck />
              </ActionIcon>
              <ActionText>
                <h4>Track Orders</h4>
                <p>View order status</p>
              </ActionText>
              <ActionArrow><FiChevronRight /></ActionArrow>
            </QuickActionCard>
          </QuickActionsGrid>
        </QuickActionsSection>

        <OrdersSection>
          <SectionTitle>
            <FiClock />
            Recent Orders
          </SectionTitle>

          {loading ? (
            <OrdersGrid>
              {[1, 2, 3].map(i => (
                <LoadingCard key={i} />
              ))}
            </OrdersGrid>
          ) : orders.length > 0 ? (
            <OrdersGrid>
              {orders.map((order, index) => (
                <OrderCard
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <OrderImage>
                    {order.items?.[0]?.product?.images?.[0]?.url ? (
                      <img src={order.items[0].product.images[0].url} alt="Product" />
                    ) : (
                      <FiPackage />
                    )}
                  </OrderImage>
                  <OrderDetails>
                    <OrderNumber>Order #{order.orderNumber}</OrderNumber>
                    <OrderDate>
                      <FiClock size={14} />
                      {formatDate(order.createdAt)}
                    </OrderDate>
                  </OrderDetails>
                  <OrderStatus $status={order.status}>{order.status}</OrderStatus>
                  <OrderAmount>₹{Number(order.payment?.amount?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</OrderAmount>
                  <ViewButton to={`/orders/${order._id}`}>
                    View Details
                    <FiChevronRight />
                  </ViewButton>
                </OrderCard>
              ))}
            </OrdersGrid>
          ) : (
            <EmptyState>
              <FiPackage />
              <h3>No orders yet</h3>
              <p>Start exploring our amazing handcrafted products!</p>
              <ShopButton to="/products">
                <FiShoppingBag />
                Start Shopping
              </ShopButton>
            </EmptyState>
          )}
        </OrdersSection>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default BuyerDashboard;
