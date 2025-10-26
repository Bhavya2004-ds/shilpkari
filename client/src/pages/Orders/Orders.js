import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../../lib/api';
import { Link } from 'react-router-dom';

const OrdersContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const OrdersContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
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

  return (
    <OrdersContainer>
      <OrdersContent>
        <h1>Orders</h1>
        {loading ? <p>Loading...</p> : (
          orders.length === 0 ? <p>No orders yet.</p> : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {orders.map(o => (
                <div key={o._id} style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', textAlign: 'left', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><strong>Order #</strong> {o.orderNumber}</div>
                    <div style={{ textTransform: 'capitalize' }}>{o.status}</div>
                  </div>
                  <div style={{ marginTop: '0.25rem' }}>Total: ₹{o.payment?.amount?.total}</div>
                  <Link className="btn btn-secondary" style={{ marginTop: '0.5rem' }} to={`/orders/${o._id}`}>View</Link>
                </div>
              ))}
            </div>
          )
        )}
      </OrdersContent>
    </OrdersContainer>
  );
};

export default Orders;
