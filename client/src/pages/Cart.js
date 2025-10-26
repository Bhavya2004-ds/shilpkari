import React from 'react';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

const CartContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const CartContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const Cart = () => {
  const { items, subtotal, tax, shipping, total, removeItem, updateQuantity, clear } = useCart();

  return (
    <CartContainer>
      <CartContent>
        <h1>Shopping Cart</h1>
        {items.length === 0 ? (
          <>
            <p>Your cart is empty.</p>
            <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
          </>
        ) : (
          <div>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '0.5rem', marginBottom: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 48, height: 48, background: '#f3f4f6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.image}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: '#d97706', fontWeight: 700 }}>{item.price}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button className="btn btn-secondary" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</button>
                  <div>{item.quantity}</div>
                  <button className="btn btn-secondary" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  <button className="btn btn-secondary" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            ))}

            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
              <div>Tax (18%): ₹{tax.toFixed(2)}</div>
              <div>Shipping: ₹{shipping.toFixed(2)}</div>
              <div style={{ fontWeight: 700 }}>Total: ₹{total.toFixed(2)}</div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={clear}>Clear Cart</button>
              <Link to="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
            </div>
          </div>
        )}
      </CartContent>
    </CartContainer>
  );
};

export default Cart;
