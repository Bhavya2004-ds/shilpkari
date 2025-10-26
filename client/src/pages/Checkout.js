import React, { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CheckoutContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const CheckoutContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const Checkout = () => {
  const { items, subtotal, tax, shipping, total, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const placeOrder = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const payload = {
        items: items.map(i => ({ product: i.id, quantity: i.quantity, price: Number(String(i.price).replace(/[^0-9.]/g, '')) })),
        shippingAddress: { name: 'Demo User', street: '123 Street', city: 'Jaipur', state: 'RJ', pincode: '302001', country: 'India', phone: '9999999999' },
        billingAddress: { name: 'Demo User', street: '123 Street', city: 'Jaipur', state: 'RJ', pincode: '302001', country: 'India', phone: '9999999999' },
        payment: { method: 'cod' }
      };
      const { data } = await api.post('/orders', payload);
      toast.success('Order placed successfully');
      clear();
      navigate(`/orders/${data.order.id}`);
    } catch (e) {
      toast.error('Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CheckoutContainer>
      <CheckoutContent>
        <h1>Checkout</h1>
        {items.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <div style={{ textAlign: 'right' }}>
            <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
            <div>Tax (18%): ₹{tax.toFixed(2)}</div>
            <div>Shipping: ₹{shipping.toFixed(2)}</div>
            <div style={{ fontWeight: 700 }}>Total: ₹{total.toFixed(2)}</div>
            <button className="btn btn-primary" onClick={placeOrder} disabled={loading} style={{ marginTop: '1rem' }}>
              {loading ? 'Placing Order...' : 'Place Order (COD)'}
            </button>
          </div>
        )}
      </CheckoutContent>
    </CheckoutContainer>
  );
};

export default Checkout;
