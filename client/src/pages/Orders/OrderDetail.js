import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../lib/api';

const OrderDetailContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const OrderDetailContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
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
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <OrderDetailContainer>
      <OrderDetailContent>
        <h1>Order Detail</h1>
        {loading ? <p>Loading...</p> : order ? (
          <div style={{ textAlign: 'left' }}>
            <div><strong>Order #</strong> {order.orderNumber}</div>
            <div>Status: {order.status}</div>
            <div style={{ marginTop: '0.5rem' }}>
              <strong>Items</strong>
              <ul>
                {order.items?.map((i, idx) => (
                  <li key={idx}>{i.product?.name} × {i.quantity} - ₹{i.price}</li>
                ))}
              </ul>
            </div>
            <div>Total: ₹{order.payment?.amount?.total}</div>
          </div>
        ) : <p>Order not found</p>}
      </OrderDetailContent>
    </OrderDetailContainer>
  );
};

export default OrderDetail;
