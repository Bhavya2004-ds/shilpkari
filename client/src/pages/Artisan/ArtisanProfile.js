import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHeart, FaShoppingBag, FaStar, FaChevronRight } from 'react-icons/fa';
import api from '../../lib/api';

const API_BASE = process.env.REACT_APP_API_URL || '';

function resolveImage(img) {
  if (!img) return null;
  let url = img;
  if (typeof img === 'object') {
    if (img.url) url = img.url;
    else if (img.path) url = img.path;
    else if (img.secure_url) url = img.secure_url;
    else if (img.publicUrl) url = img.publicUrl;
    else if (typeof img.toString === 'function') url = img.toString();
  }
  if (typeof url !== 'string') return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
}

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: #fdfcfb;
  padding-bottom: 5rem;
`;

const HeroSection = styled.div`
  height: 220px;
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 10% 10%, rgba(255, 255, 255, 0.12) 0%, transparent 40%),
      radial-gradient(circle at 90% 90%, rgba(255, 255, 255, 0.08) 0%, transparent 40%);
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 2;
  }
`;

const ProfileContentWrapper = styled.div`
  max-width: 1000px;
  margin: -110px auto 0;
  padding: 0 2rem;
  position: relative;
  z-index: 10;
`;

const HeaderCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.04);
  display: flex;
  gap: 3rem;
  align-items: center;
  border: 1px solid rgba(0,0,0,0.02);
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 2rem;
  }
`;

const AvatarWrapper = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 24px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #fff;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  span {
    font-size: 3.5rem;
    font-weight: 700;
    color: #d97706;
  }
`;

const ArtisanMeta = styled.div`
  flex: 1;
  
  h1 {
    font-size: 2.25rem;
    color: #111827;
    margin: 0;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
  
  .business-name {
    font-size: 1rem;
    color: #d97706;
    margin-top: 0.4rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  
  .bio-snippet {
    margin-top: 1rem;
    color: #6b7280;
    line-height: 1.6;
    font-size: 1.05rem;
    max-width: 500px;
  }
`;

const StatsGroup = styled.div`
  display: flex;
  gap: 2.5rem;
  padding-left: 2rem;
  border-left: 1px solid #f3f4f6;
  
  @media (max-width: 768px) {
    border-left: none;
    padding-left: 0;
    width: 100%;
    justify-content: center;
    margin-top: 1rem;
  }
  
  .stat {
    display: flex;
    flex-direction: column;
    
    .value {
      font-size: 1.5rem;
      font-weight: 800;
      color: #111827;
    }
    
    .label {
      font-size: 0.75rem;
      color: #9ca3af;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }
`;

const MainContent = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const Section = styled.section`
  h2 {
    font-size: 1.75rem;
    color: #1f2937;
    margin-bottom: 1.5rem;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 3px;
      background: #d97706;
      border-radius: 2px;
    }
  }
`;

const AboutCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  line-height: 1.8;
  color: #4b5563;
  font-size: 1.1rem;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Tag = styled.span`
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 1.25rem;
  border-radius: 100px;
  color: #374151;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    border-color: #d97706;
    color: #d97706;
    transform: translateY(-2px);
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled(Link)`
  text-decoration: none;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.04);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.08);
    
    .view-arrow {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const ProductImageContainer = styled.div`
  height: 250px;
  background: #f9fafb;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${ProductCard}:hover & img {
    transform: scale(1.05);
  }
`;

const ProductContent = styled.div`
  padding: 1.5rem;
  
  .title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }
  
  .price {
    font-size: 1.25rem;
    color: #d97706;
    font-weight: 600;
  }
  
  .view-arrow {
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
    color: #d97706;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s ease;
  }
`;

export default function ArtisanProfile() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/artisans/${id}`);
        setArtisan(data.artisan || null);
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load artisan', err);
        setArtisan(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Loading your favorite artisan...</div>;
  if (!artisan) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Artisan not found.</div>;

  const bio = artisan.artisanProfile?.bio || 'This artisan creates unique handcrafted pieces using traditional techniques. Explore their shop below to see available items.';
  const business = artisan.artisanProfile?.businessName || '';
  const specialties = artisan.artisanProfile?.specialties || artisan.specialties || [];
  const productCount = products.length;

  return (
    <ProfileContainer>
      <HeroSection />

      <ProfileContentWrapper>
        <HeaderCard>
          <AvatarWrapper>
            {artisan.profileImage ? (
              <img
                src={resolveImage(artisan.profileImage)}
                alt={artisan.name}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/180?text=A'; }}
              />
            ) : (
              <span>{artisan.name?.charAt(0)?.toUpperCase()}</span>
            )}
          </AvatarWrapper>

          <ArtisanMeta>
            <h1>{artisan.name}</h1>
            {business && <div className="business-name">{business}</div>}
            <div className="bio-snippet">
              {bio.length > 150 ? bio.substring(0, 150) + '...' : bio}
            </div>
          </ArtisanMeta>

          <StatsGroup>
            <div className="stat">
              <span className="value">{productCount}</span>
              <span className="label">Items</span>
            </div>
            <div className="stat">
              <span className="value">
                {products.reduce((acc, p) => acc + (p.rating?.average || 0), 0) / (products.length || 1) > 0
                  ? (products.reduce((acc, p) => acc + (p.rating?.average || 0), 0) / (products.length || 1)).toFixed(1)
                  : '5.0'}
              </span>
              <span className="label">Rating</span>
            </div>
          </StatsGroup>
        </HeaderCard>

        <MainContent>
          <Section>
            <h2>The Artisan Journey</h2>
            <AboutCard>
              {bio}
              {specialties.length > 0 && (
                <TagContainer>
                  {specialties.map((s, i) => <Tag key={i}>{s}</Tag>)}
                </TagContainer>
              )}
            </AboutCard>
          </Section>

          <Section>
            <h2>Available Collection</h2>
            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280', background: '#fff', borderRadius: '20px' }}>
                <FaShoppingBag style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }} />
                <p>No products available at the moment.</p>
              </div>
            ) : (
              <ProductsGrid>
                {products.map(p => {
                  const img = resolveImage(p.images?.[0]);
                  return (
                    <ProductCard key={p._id || p.id} to={`/products/${p._id || p.id}`}>
                      <ProductImageContainer>
                        {img ? (
                          <img
                            src={img}
                            alt={p.name || p.title}
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/300x250?text=Handcrafted'; }}
                          />
                        ) : (
                          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>No Image</div>
                        )}
                      </ProductImageContainer>
                      <ProductContent>
                        <div className="title">{p.name || p.title}</div>
                        <div className="price">{p.price ? `₹${p.price.toLocaleString('en-IN')}` : ''}</div>
                        <div className="view-arrow">
                          <FaChevronRight />
                        </div>
                      </ProductContent>
                    </ProductCard>
                  );
                })}
              </ProductsGrid>
            )}
          </Section>
        </MainContent>
      </ProfileContentWrapper>
    </ProfileContainer>
  );
}
