import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FiPackage,
  FiTruck,
  FiCheck,
  FiClock,
  FiShoppingBag,
  FiArrowRight,
  FiCalendar,
  FiEye
} from 'react-icons/fi';
import api from '../../lib/api';
import { Link } from 'react-router-dom';

const OrdersContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%);
  padding: 2rem 0 4rem;
`;

const OrdersContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem;
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

const OrderCount = styled.p`
  text-align: center;
  color: #92400e;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const OrdersList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(120, 53, 15, 0.08);
  overflow: hidden;
  border: 1px solid rgba(217, 119, 6, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(217, 119, 6, 0.15);
    border-color: rgba(217, 119, 6, 0.3);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
  color: white;
`;

const OrderNumber = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusBadge = styled.span`
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  background: ${props => {
    switch (props.$status) {
      case 'delivered': return 'rgba(16, 185, 129, 0.2)';
      case 'shipped': return 'rgba(59, 130, 246, 0.2)';
      case 'cancelled': return 'rgba(239, 68, 68, 0.2)';
      case 'processing': return 'rgba(245, 158, 11, 0.2)';
      default: return 'rgba(255, 255, 255, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'delivered': return '#10b981';
      case 'shipped': return '#60a5fa';
      case 'cancelled': return '#f87171';
      case 'processing': return '#fbbf24';
      default: return 'white';
    }
  }};
`;

const OrderBody = styled.div`
  padding: 1.25rem 1.5rem;
`;

const OrderItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const ItemPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  padding: 0.6rem 1rem;
  border-radius: 10px;
  border: 1px solid #fde68a;
`;

const ItemImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fde68a;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    color: #d97706;
  }
`;

const ItemName = styled.span`
  font-size: 0.85rem;
  color: #78350f;
  font-weight: 500;
`;

const ItemQty = styled.span`
  font-size: 0.75rem;
  color: #92400e;
  background: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px dashed #fde68a;
`;

const OrderMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const OrderDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #92400e;

  svg {
    color: #d97706;
  }
`;

const OrderTotal = styled.div`
  font-size: 1.35rem;
  font-weight: 700;
  color: #d97706;
`;

const ViewButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(217, 119, 6, 0.35);
    color: white;
  }
`;

const EmptyOrders = styled.div`
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

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 3rem;
  color: #78350f;
  font-size: 1.1rem;
`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data.orders || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
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
      case 'delivered': return <FiCheck />;
      case 'shipped': return <FiTruck />;
      case 'processing': return <FiClock />;
      default: return <FiPackage />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <OrdersContainer>
      <OrdersContent>
        <PageTitle>
          <FiShoppingBag />
          My Orders
        </PageTitle>
        {!loading && orders.length > 0 && (
          <OrderCount>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</OrderCount>
        )}

        {loading ? (
          <LoadingSpinner>Loading your orders...</LoadingSpinner>
        ) : orders.length === 0 ? (
          <EmptyOrders>
            <FiShoppingBag />
            <h2>No orders yet</h2>
            <p>When you place orders, they will appear here.</p>
            <ShopButton to="/products">
              Start Shopping
              <FiArrowRight />
            </ShopButton>
          </EmptyOrders>
        ) : (
          <OrdersList
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {orders.map(order => (
              <OrderCard key={order._id} variants={itemVariants}>
                <OrderHeader>
                  <OrderNumber>
                    <FiPackage />
                    {order.orderNumber}
                  </OrderNumber>
                  <StatusBadge $status={order.status}>
                    {getStatusIcon(order.status)} {order.status}
                  </StatusBadge>
                </OrderHeader>
                <OrderBody>
                  <OrderItems>
                    {order.items?.slice(0, 3).map((item, idx) => (
                      <ItemPreview key={idx}>
                        <ItemImage>
                          {item.product?.images?.[0]?.url ? (
                            <img src={item.product.images[0].url} alt={item.product.name} />
                          ) : (
                            <FiPackage size={18} />
                          )}
                        </ItemImage>
                        <ItemName>{item.product?.name || 'Product'}</ItemName>
                        <ItemQty>×{item.quantity}</ItemQty>
                      </ItemPreview>
                    ))}
                    {order.items?.length > 3 && (
                      <ItemPreview>
                        <ItemName>+{order.items.length - 3} more</ItemName>
                      </ItemPreview>
                    )}
                  </OrderItems>
                  <OrderFooter>
                    <OrderMeta>
                      <OrderDate>
                        <FiCalendar size={14} />
                        {formatDate(order.createdAt)}
                      </OrderDate>
                      <OrderTotal>₹{formatPrice(order.payment?.amount?.total)}</OrderTotal>
                    </OrderMeta>
                    <ViewButton to={`/orders/${order._id}`}>
                      <FiEye />
                      View Details
                    </ViewButton>
                  </OrderFooter>
                </OrderBody>
              </OrderCard>
            ))}
          </OrdersList>
        )}
      </OrdersContent>
    </OrdersContainer>
  );
};

export default Orders;
