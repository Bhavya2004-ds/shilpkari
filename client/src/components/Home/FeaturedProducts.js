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
        console.log('Raw featured products data:', data);
        
        const normalized = (data || []).map(p => {
          // Fix the images array if it's a string split into characters
          let fixedImages = [];
          if (Array.isArray(p.images) && p.images.length > 0) {
            // Check if the first item is an object with a url property
            if (p.images[0].url) {
              fixedImages = p.images.map(img => img.url);
            } 
            // Check if the first item is an object that's actually a string split into characters
            else if (p.images[0]['0'] === 'h' && p.images[0]['1'] === 't' && p.images[0]['2'] === 't') {
              // Reconstruct the URL from the character map
              const urlObj = p.images[0];
              const urlLength = Object.keys(urlObj).filter(key => !isNaN(parseInt(key))).length;
              let url = '';
              for (let i = 0; i < urlLength; i++) {
                url += urlObj[i];
              }
              fixedImages = [url];
            }
            // If it's already a proper array of URLs
            else if (typeof p.images[0] === 'string') {
              fixedImages = [...p.images];
            }
          }
          
          console.log('Fixed featured product images:', { id: p._id, fixedImages });
          
          return {
            id: p._id,
            name: p.name,
            price: `₹${p.price?.toLocaleString?.('en-IN') || p.price}`,
            image: fixedImages[0] || '🧶',
            images: fixedImages
          };
        });
        
        console.log('Normalized featured products:', normalized);
        setFeaturedProducts(normalized);
      } catch (e) {
        console.error('Error loading featured products:', e);
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
          {featuredProducts.map((product, index) => {
            console.log('Rendering featured product:', { id: product.id, name: product.name, images: product.images });
            return (
              <ProductCard
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ProductImage>
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          console.log('Featured product image failed to load, falling back to placeholder');
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f8f9fa',
                        fontSize: '3rem',
                        color: '#9ca3af'
                      }}>
                        🧶
                      </div>
                    )}
                  </ProductImage>
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>{product.price}</ProductPrice>
                  </ProductInfo>
                </Link>
                <ProductActions>
                  <ActionButton className="primary">Add to Cart</ActionButton>
                  <Link to={`/products/${product.id}`} style={{ flex: 1 }}>
                    <ActionButton className="secondary" style={{ width: '100%' }}>View</ActionButton>
                  </Link>
                </ProductActions>
              </ProductCard>
            );
          })}
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
