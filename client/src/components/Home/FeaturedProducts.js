import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import api from '../../lib/api';

const FeaturedContainer = styled.section`
  padding: 6rem 0;
  background: white;
`;

const FeaturedContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;

  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.125rem;
    color: #6b7280;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #9ca3af;
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #d97706;
  margin-bottom: 1rem;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(135deg, #d97706, #b45309);
    color: white;

    &:hover {
      background: linear-gradient(135deg, #b45309, #92400e);
    }
  }

  &.secondary {
    background: #f3f4f6;
    color: #374151;

    &:hover {
      background: #e5e7eb;
    }
  }
`;

const ViewAllButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  text-decoration: none;
  border-radius: 0.75rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px 0 rgba(217, 119, 6, 0.4);
  }
`;

const FeaturedProducts = () => {
  const { t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products/featured/list', { params: { limit: 6 } });
        const normalized = (data || []).map(p => ({
          id: p._id,
          name: p.name,
          price: `₹${p.price?.toLocaleString?.('en-IN') || p.price}`,
          image: p.images?.[0]?.url || '🧶',
        }));
        setFeaturedProducts(normalized);
      } catch (e) {
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <FeaturedContainer>
      <FeaturedContent>
        <SectionHeader>
          <h2>Featured Products</h2>
          <p>Discover our handpicked collection of exceptional artisan creations</p>
        </SectionHeader>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading featured products...</p>
        ) : (
        <ProductsGrid>
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductImage>{typeof product.image === 'string' && product.image.startsWith('http') ? (
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                product.image
              )}</ProductImage>
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{product.price}</ProductPrice>
                <ProductActions>
                  <ActionButton className="primary">Add to Cart</ActionButton>
                  <ActionButton className="secondary">View</ActionButton>
                </ProductActions>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductsGrid>
        )}

        <div style={{ textAlign: 'center' }}>
          <ViewAllButton to="/products">View All Products</ViewAllButton>
        </div>
      </FeaturedContent>
    </FeaturedContainer>
  );
};

export default FeaturedProducts;
