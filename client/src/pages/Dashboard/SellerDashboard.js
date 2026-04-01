import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import {
  FiDollarSign,
  FiPackage,
  FiShoppingCart,
  FiTrendingUp,
  FiPlus,
  FiBarChart2,
  FiList,
  FiChevronRight,
  FiEdit2,
  FiEye,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiTruck,
  FiCamera,
  FiLink
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
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
  background: linear-gradient(135deg, #44270d 0%, #5c3310 50%, #78420e 100%);
  border-radius: 1.5rem;
  padding: 2.5rem;
  margin-bottom: 2rem;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px -10px rgba(68, 39, 13, 0.4);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(217, 119, 6, 0.2) 0%, transparent 70%);
    transform: translate(30%, -30%);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%);
    transform: translate(-30%, 30%);
  }
`;

const WelcomeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const WelcomeLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.3);
`;

const WelcomeText = styled.div`
  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  p {
    opacity: 0.9;
    font-size: 1.1rem;
    margin: 0;
    color: rgba(255, 255, 255, 0.85);
  }
`;

const AddProductButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(217, 119, 6, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(217, 119, 6, 0.5);
    color: white;
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

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const SectionCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;

    svg {
      color: #d97706;
    }
  }
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #d97706;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const OrdersList = styled.div`
  padding: 0;
`;

const OrderItem = styled(motion.div)`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: background 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fefbf5;
  }
`;

const OrderIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${props => {
    switch (props.$status) {
      case 'delivered': return 'linear-gradient(135deg, #d1fae5, #a7f3d0)';
      case 'shipped': return 'linear-gradient(135deg, #dbeafe, #bfdbfe)';
      case 'processing': return 'linear-gradient(135deg, #fef3c7, #fde68a)';
      case 'pending': return 'linear-gradient(135deg, #fee2e2, #fecaca)';
      default: return 'linear-gradient(135deg, #f3f4f6, #e5e7eb)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
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

const OrderInfo = styled.div`
  flex: 1;

  h4 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.25rem;
  }

  p {
    font-size: 0.8rem;
    color: #6b7280;
    margin: 0;
  }
`;

const OrderAmount = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #d97706;
`;

const ProductsList = styled.div`
  padding: 0;
`;

const ProductItem = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 1rem;

  &:last-child {
    border-bottom: none;
  }
`;

const ProductImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d97706;
  font-size: 1.25rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  flex: 1;
  min-width: 0;

  h4 {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    font-size: 0.8rem;
    color: #d97706;
    font-weight: 600;
    margin: 0;
  }
`;

const ProductActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled(Link)`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background: #d97706;
    color: white;
  }
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

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;

  svg {
    font-size: 2rem;
    color: #d97706;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

const LoadingCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  animation: ${shimmer} 1.5s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  height: 80px;
`;

const SellerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    productsListed: 0,
    pendingOrders: 0,
    earnings: 0
  });

  // user._id from /me endpoint, user.id from login/register response
  const userId = user?._id || user?.id;

  // Helper: extract image URL from product images array
  const getProductImage = (product) => {
    if (!product || !product.images || product.images.length === 0) return null;
    const img = product.images[0];
    // Handle object with url property (proper Mongoose subdocument format)
    if (typeof img === 'object' && img !== null && img.url) return img.url;
    // Handle plain string URL
    if (typeof img === 'string' && img.length > 0) return img;
    // Handle character-indexed objects from Mongoose string casting ({"0":"h","1":"t",...})
    if (typeof img === 'object' && img !== null && '0' in img) {
      const keys = Object.keys(img).filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
      if (keys.length > 0) return keys.map(k => img[k]).join('');
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch artisan's orders
        const ordersRes = await api.get('/orders/my-orders');
        const ordersData = ordersRes.data.orders || [];
        setOrders(ordersData.slice(0, 5));

        // Calculate stats from orders
        const pendingCount = ordersData.filter(o =>
          o.status === 'pending' || o.status === 'processing'
        ).length;
        const totalEarnings = ordersData.reduce((sum, o) =>
          sum + (o.payment?.amount?.total || 0), 0
        );

        // Fetch ONLY this artisan's products
        const productsRes = await api.get('/products', {
          params: { artisan: userId }
        });
        const productsData = productsRes.data.products || [];
        setProducts(productsData.slice(0, 4));

        setStats({
          totalSales: ordersData.length,
          productsListed: productsData.length,
          pendingOrders: pendingCount,
          earnings: totalEarnings
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <FiCheckCircle />;
      case 'shipped': return <FiTruck />;
      case 'processing': return <FiClock />;
      case 'pending': return <FiAlertCircle />;
      default: return <FiPackage />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
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
            <WelcomeLeft>
              <Avatar>{getInitials(user?.name)}</Avatar>
              <WelcomeText>
                <h1>Welcome, {user?.name?.split(' ')[0]}!</h1>
                <p>Manage your artisan shop and track your sales</p>
              </WelcomeText>
            </WelcomeLeft>
            <AddProductButton to="/artisan/add-product">
              <FiPlus size={20} />
              Add New Product
            </AddProductButton>
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
              $gradient="linear-gradient(90deg, #10b981, #34d399)"
            >
              <StatIcon $bg="linear-gradient(135deg, #d1fae5, #a7f3d0)" $color="#10b981">
                <FiDollarSign />
              </StatIcon>
              <StatValue>₹{stats.earnings.toLocaleString()}</StatValue>
              <StatLabel>Total Earnings</StatLabel>
            </StatCard>

            <StatCard
              variants={itemVariants}
              $gradient="linear-gradient(90deg, #d97706, #f59e0b)"
            >
              <StatIcon $bg="linear-gradient(135deg, #fef3c7, #fde68a)" $color="#d97706">
                <FiShoppingCart />
              </StatIcon>
              <StatValue>{stats.totalSales}</StatValue>
              <StatLabel>Total Sales</StatLabel>
            </StatCard>

            <StatCard
              variants={itemVariants}
              $gradient="linear-gradient(90deg, #d97706, #f59e0b)"
            >
              <StatIcon $bg="linear-gradient(135deg, #fef3c7, #fde68a)" $color="#d97706">
                <FiPackage />
              </StatIcon>
              <StatValue>{stats.productsListed}</StatValue>
              <StatLabel>Products Listed</StatLabel>
            </StatCard>

            <StatCard
              variants={itemVariants}
              $gradient="linear-gradient(90deg, #ef4444, #f87171)"
            >
              <StatIcon $bg="linear-gradient(135deg, #fee2e2, #fecaca)" $color="#ef4444">
                <FiClock />
              </StatIcon>
              <StatValue>{stats.pendingOrders}</StatValue>
              <StatLabel>Pending Orders</StatLabel>
            </StatCard>
          </StatsGrid>
        </motion.div>

        <TwoColumnGrid>
          <SectionCard>
            <SectionHeader>
              <h3><FiShoppingCart /> Recent Orders</h3>
              <ViewAllLink to="/orders">
                View All <FiChevronRight size={16} />
              </ViewAllLink>
            </SectionHeader>
            <OrdersList>
              {loading ? (
                [1, 2, 3].map(i => (
                  <OrderItem key={i}>
                    <LoadingCard style={{ height: '44px', width: '44px', borderRadius: '10px' }} />
                    <div style={{ flex: 1 }}>
                      <LoadingCard style={{ height: '16px', width: '60%', marginBottom: '6px' }} />
                      <LoadingCard style={{ height: '12px', width: '40%' }} />
                    </div>
                  </OrderItem>
                ))
              ) : orders.length > 0 ? (
                orders.map((order, index) => (
                  <OrderItem
                    key={order._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <OrderIcon $status={order.status}>
                      {getStatusIcon(order.status)}
                    </OrderIcon>
                    <OrderInfo>
                      <h4>Order #{order.orderNumber}</h4>
                      <p>{formatDate(order.createdAt)} • {order.status}</p>
                    </OrderInfo>
                    <OrderAmount>₹{order.payment?.amount?.total || 0}</OrderAmount>
                  </OrderItem>
                ))
              ) : (
                <EmptyState>
                  <FiShoppingCart />
                  <p>No orders yet</p>
                </EmptyState>
              )}
            </OrdersList>
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <h3><FiPackage /> Your Products</h3>
              <ViewAllLink to="/artisan/my-products">
                View All <FiChevronRight size={16} />
              </ViewAllLink>
            </SectionHeader>
            <ProductsList>
              {loading ? (
                [1, 2, 3].map(i => (
                  <ProductItem key={i}>
                    <LoadingCard style={{ height: '50px', width: '50px', borderRadius: '10px' }} />
                    <div style={{ flex: 1 }}>
                      <LoadingCard style={{ height: '14px', width: '70%', marginBottom: '6px' }} />
                      <LoadingCard style={{ height: '12px', width: '30%' }} />
                    </div>
                  </ProductItem>
                ))
              ) : products.length > 0 ? (
                products.map(product => (
                  <ProductItem key={product._id}>
                    <ProductImage>
                      {getProductImage(product) ? (
                        <img src={getProductImage(product)} alt={product.name} />
                      ) : (
                        <FiPackage />
                      )}
                    </ProductImage>
                    <ProductInfo>
                      <h4>{product.name}</h4>
                      <p>₹{product.price}</p>
                    </ProductInfo>
                    <ProductActions>
                      <IconButton to={`/products/${product._id}`}>
                        <FiEye size={16} />
                      </IconButton>
                      <IconButton to={`/artisan/edit-product/${product._id}`}>
                        <FiEdit2 size={16} />
                      </IconButton>
                    </ProductActions>
                  </ProductItem>
                ))
              ) : (
                <EmptyState>
                  <FiPackage />
                  <p>No products listed</p>
                </EmptyState>
              )}
            </ProductsList>
          </SectionCard>
        </TwoColumnGrid>

        <div style={{ marginBottom: '2rem' }}>
          <SectionTitle>
            <FiTrendingUp />
            Quick Actions
          </SectionTitle>
          <QuickActionsGrid>
            <QuickActionCard to="/artisan/add-product">
              <ActionIcon $bg="linear-gradient(135deg, #fef3c7, #fde68a)" $color="#d97706">
                <FiPlus />
              </ActionIcon>
              <ActionText>
                <h4>Add Product</h4>
                <p>List a new item for sale</p>
              </ActionText>
              <ActionArrow><FiChevronRight /></ActionArrow>
            </QuickActionCard>

            <QuickActionCard to="/analytics">
              <ActionIcon $bg="linear-gradient(135deg, #dbeafe, #bfdbfe)" $color="#3b82f6">
                <FiBarChart2 />
              </ActionIcon>
              <ActionText>
                <h4>Demand Prediction</h4>
                <p>AI-powered demand forecasting</p>
              </ActionText>
              <ActionArrow><FiChevronRight /></ActionArrow>
            </QuickActionCard>

            <QuickActionCard to="/orders">
              <ActionIcon $bg="linear-gradient(135deg, #d1fae5, #a7f3d0)" $color="#10b981">
                <FiList />
              </ActionIcon>
              <ActionText>
                <h4>Manage Orders</h4>
                <p>Process pending orders</p>
              </ActionText>
              <ActionArrow><FiChevronRight /></ActionArrow>
            </QuickActionCard>

            <QuickActionCard to="/artisan/image-inspection">
              <ActionIcon $bg="linear-gradient(135deg, #fce7f3, #fbcfe8)" $color="#db2777">
                <FiCamera />
              </ActionIcon>
              <ActionText>
                <h4>Image Inspection</h4>
                <p>AI quality check for photos</p>
              </ActionText>
              <ActionArrow><FiChevronRight /></ActionArrow>
            </QuickActionCard>

            <QuickActionCard to="/artisan/sales">
              <ActionIcon $bg="linear-gradient(135deg, #e0e7ff, #c7d2fe)" $color="#6366f1">
                <FiBarChart2 />
              </ActionIcon>
              <ActionText>
                <h4>Sales Analytics</h4>
                <p>Revenue & product performance</p>
              </ActionText>
              <ActionArrow><FiChevronRight /></ActionArrow>
            </QuickActionCard>

            <QuickActionCard to="/artisan/logistics">
              <ActionIcon $bg="linear-gradient(135deg, #dbeafe, #bfdbfe)" $color="#0ea5e9">
                <FiTruck />
              </ActionIcon>
              <ActionText>
                <h4>Logistics</h4>
                <p>Shipping & order tracking</p>
              </ActionText>
              <ActionArrow><FiChevronRight /></ActionArrow>
            </QuickActionCard>

            <QuickActionCard to="/artisan/blockchain">
              <ActionIcon $bg="linear-gradient(135deg, #ccfbf1, #99f6e4)" $color="#0d9488">
                <FiLink />
              </ActionIcon>
              <ActionText>
                <h4>Blockchain</h4>
                <p>Supply chain verification</p>
              </ActionText>
              <ActionArrow><FiChevronRight /></ActionArrow>
            </QuickActionCard>
          </QuickActionsGrid>
        </div>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default SellerDashboard;
