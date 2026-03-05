import React from 'react';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiTrash2, FiMinus, FiPlus, FiArrowRight, FiPackage, FiTruck, FiShield } from 'react-icons/fi';

const CartContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%);
  padding: 2rem 0 4rem;
`;

const CartContent = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #78350f;
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  svg {
    color: #d97706;
  }
`;

const CartLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const CartItemsSection = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(120, 53, 15, 0.08);
  overflow: hidden;
  border: 1px solid rgba(217, 119, 6, 0.1);
`;

const CartHeader = styled.div`
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CartItemsList = styled.div`
  padding: 0;
`;

const CartItem = styled(motion.div)`
  display: grid;
  grid-template-columns: 100px 1fr auto auto;
  gap: 1.25rem;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #fef3c7;
  transition: background 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: linear-gradient(135deg, #fffbeb 0%, #fefce8 100%);
  }

  @media (max-width: 576px) {
    grid-template-columns: 80px 1fr;
    gap: 1rem;
  }
`;

const ItemImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid #fde68a;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.15);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    font-size: 2rem;
    color: #d97706;
  }

  @media (max-width: 576px) {
    width: 80px;
    height: 80px;
  }
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 576px) {
    grid-column: 2;
  }
`;

const ItemName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #78350f;
  margin: 0;
  line-height: 1.3;
`;

const ItemPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #d97706;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 12px;
  padding: 0.35rem;
  border: 1px solid #fde68a;

  @media (max-width: 576px) {
    grid-column: 1 / -1;
    justify-self: start;
    margin-top: 0.5rem;
  }
`;

const QuantityButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #78350f;
  box-shadow: 0 2px 4px rgba(120, 53, 15, 0.1);

  &:hover {
    background: linear-gradient(135deg, #d97706, #b45309);
    color: white;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
`;

const QuantityValue = styled.span`
  min-width: 40px;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
  color: #78350f;
`;

const RemoveButton = styled.button`
  width: 42px;
  height: 42px;
  border: none;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #ef4444;
  border: 1px solid #fecaca;

  &:hover {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    transform: scale(1.05);
    border-color: #ef4444;
  }

  @media (max-width: 576px) {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
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

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: ${props => props.$last ? 'none' : '1px dashed #fde68a'};
  
  span:first-child {
    color: #78350f;
    font-size: 0.95rem;
    font-weight: 500;
  }

  span:last-child {
    color: #78350f;
    font-weight: ${props => props.$last ? '700' : '600'};
    font-size: ${props => props.$last ? '1.25rem' : '1rem'};
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0 0;
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
    font-size: 1.75rem;
  }
`;

const SummaryButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const CheckoutButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(217, 119, 6, 0.4);
    color: white;
  }
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: white;
  color: #78350f;
  border: 2px solid #fde68a;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #fef2f2;
    border-color: #ef4444;
    color: #ef4444;
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
    font-size: 1rem;
  }
`;

const ShopButton = styled(Link)`
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
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(217, 119, 6, 0.35);
    color: white;
  }
`;

const FreeShippingBadge = styled.div`
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #78350f;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid #fde68a;
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

const Cart = () => {
  const { items, subtotal, tax, shipping, total, removeItem, updateQuantity, clear } = useCart();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <CartContainer>
      <CartContent>
        <PageTitle>
          <FiShoppingBag />
          Shopping Cart
        </PageTitle>

        {items.length === 0 ? (
          <EmptyCart>
            <FiShoppingBag />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <ShopButton to="/products">
              <FiPackage />
              Start Shopping
              <FiArrowRight />
            </ShopButton>
          </EmptyCart>
        ) : (
          <CartLayout>
            <CartItemsSection>
              <CartHeader>
                <FiShoppingBag />
                Cart Items ({items.length} {items.length === 1 ? 'item' : 'items'})
              </CartHeader>
              <CartItemsList
                as={motion.div}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {items.map(item => (
                  <CartItem key={item.id} variants={itemVariants}>
                    <ItemImage>
                      {item.image ? (
                        typeof item.image === 'string' && item.image.startsWith('http') ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <FiPackage />
                        )
                      ) : (
                        <FiPackage />
                      )}
                    </ItemImage>
                    <ItemDetails>
                      <ItemName>{item.name}</ItemName>
                      <ItemPrice>₹{Number(String(item.price).replace(/[^0-9.]/g, '')) || 0}</ItemPrice>
                    </ItemDetails>
                    <QuantityControl>
                      <QuantityButton
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={16} />
                      </QuantityButton>
                      <QuantityValue>{item.quantity}</QuantityValue>
                      <QuantityButton onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <FiPlus size={16} />
                      </QuantityButton>
                    </QuantityControl>
                    <RemoveButton onClick={() => removeItem(item.id)} title="Remove item">
                      <FiTrash2 size={18} />
                    </RemoveButton>
                  </CartItem>
                ))}
              </CartItemsList>
            </CartItemsSection>

            <OrderSummary>
              <SummaryHeader>
                <FiPackage />
                Order Summary
              </SummaryHeader>
              <SummaryContent>
                {subtotal > 1000 && (
                  <FreeShippingBadge>
                    <FiTruck />
                    You've unlocked FREE shipping!
                  </FreeShippingBadge>
                )}
                <SummaryRow>
                  <span>Subtotal</span>
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
                <SummaryButtons>
                  <CheckoutButton to="/checkout">
                    Proceed to Checkout
                    <FiArrowRight />
                  </CheckoutButton>
                  <ClearButton onClick={clear}>
                    <FiTrash2 size={16} />
                    Clear Cart
                  </ClearButton>
                </SummaryButtons>
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
          </CartLayout>
        )}
      </CartContent>
    </CartContainer>
  );
};

export default Cart;
