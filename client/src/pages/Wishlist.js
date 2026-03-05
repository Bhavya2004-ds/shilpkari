import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FiHeart,
  FiShoppingCart,
  FiTrash2,
  FiShoppingBag,
  FiArrowRight,
  FiPackage,
  FiEye
} from 'react-icons/fi';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const WishlistContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%);
  padding: 2rem 0 4rem;
`;

const WishlistContent = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #78350f;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  svg {
    color: #d97706;
  }
`;

const ItemCount = styled.p`
  color: #92400e;
  font-size: 1rem;
  font-weight: 500;
`;

const WishlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const WishlistCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(120, 53, 15, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(217, 119, 6, 0.1);
  position: relative;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(217, 119, 6, 0.15);
    border-color: rgba(217, 119, 6, 0.3);
  }
`;

const CardImage = styled(Link)`
  display: block;
  width: 100%;
  height: 220px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  &:hover img {
    transform: scale(1.08);
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #d97706;
  font-size: 3rem;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #ef4444;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;

  &:hover {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    transform: scale(1.1);
  }
`;

const HeartBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #d97706, #b45309);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4);
  z-index: 10;
`;

const CardContent = styled.div`
  padding: 1.25rem;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #78350f;
  margin: 0 0 0.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductPrice = styled.div`
  font-size: 1.35rem;
  font-weight: 700;
  color: #d97706;
  margin-bottom: 1rem;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const AddToCartButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(217, 119, 6, 0.35);
  }
`;

const ViewButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #78350f;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid #fde68a;

  &:hover {
    background: linear-gradient(135deg, #d97706, #b45309);
    color: white;
    border-color: #d97706;
  }
`;

const EmptyWishlist = styled.div`
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

const ClearAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #78350f;
  border: 2px solid #fde68a;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto 2rem;

  &:hover {
    background: #fef2f2;
    border-color: #ef4444;
    color: #ef4444;
  }
`;

const Wishlist = () => {
  const { items, removeItem, clear } = useWishlist();
  const { addItem: addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    });
    toast.success(`${item.name} added to cart!`);
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
    <WishlistContainer>
      <WishlistContent>
        <PageHeader>
          <PageTitle>
            <FiHeart />
            My Wishlist
          </PageTitle>
          {items.length > 0 && (
            <ItemCount>{items.length} {items.length === 1 ? 'item' : 'items'} in your wishlist</ItemCount>
          )}
        </PageHeader>

        {items.length === 0 ? (
          <EmptyWishlist>
            <FiHeart />
            <h2>Your wishlist is empty</h2>
            <p>Save items you love by clicking the heart icon on products.</p>
            <ShopButton to="/products">
              <FiShoppingBag />
              Explore Products
              <FiArrowRight />
            </ShopButton>
          </EmptyWishlist>
        ) : (
          <>
            {items.length > 1 && (
              <ClearAllButton onClick={clear}>
                <FiTrash2 size={16} />
                Clear All
              </ClearAllButton>
            )}

            <WishlistGrid
              as={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {items.map(item => (
                <WishlistCard key={item.id} variants={itemVariants}>
                  <CardImage to={`/products/${item.id}`}>
                    <HeartBadge>
                      <FiHeart size={18} />
                    </HeartBadge>
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <PlaceholderImage>
                        <FiPackage />
                      </PlaceholderImage>
                    )}
                    <RemoveButton
                      onClick={(e) => {
                        e.preventDefault();
                        removeItem(item.id);
                      }}
                      title="Remove from wishlist"
                    >
                      <FiTrash2 size={16} />
                    </RemoveButton>
                  </CardImage>
                  <CardContent>
                    <ProductName>{item.name}</ProductName>
                    <ProductPrice>₹{Number(item.price).toLocaleString('en-IN')}</ProductPrice>
                    <CardActions>
                      <AddToCartButton onClick={() => handleAddToCart(item)}>
                        <FiShoppingCart size={18} />
                        Add to Cart
                      </AddToCartButton>
                      <ViewButton to={`/products/${item.id}`} title="View Product">
                        <FiEye size={18} />
                      </ViewButton>
                    </CardActions>
                  </CardContent>
                </WishlistCard>
              ))}
            </WishlistGrid>
          </>
        )}
      </WishlistContent>
    </WishlistContainer>
  );
};

export default Wishlist;
