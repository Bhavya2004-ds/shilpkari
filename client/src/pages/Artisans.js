import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../lib/api';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { FaUser, FaChevronRight, FaStar } from 'react-icons/fa';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #fdfcfb;
  padding-bottom: 5rem;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  padding: 6.5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 4rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 40%);
    z-index: 1;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  color: #ffffff;
  margin: 0;
  font-weight: 800;
  letter-spacing: -1px;
  position: relative;
  z-index: 2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 1.2rem auto 0;
  max-width: 650px;
  position: relative;
  z-index: 2;
  line-height: 1.6;
  font-weight: 500;
`;

const PageContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
`;

const ArtisanCard = styled(Link)`
  text-decoration: none;
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: 1px solid rgba(0,0,0,0.02);
  position: relative;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
    border-color: rgba(217, 119, 6, 0.1);
  }
`;

const AvatarWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 20px;
  overflow: hidden;
  background: #fff7ed;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 25px rgba(217, 119, 6, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    font-size: 3rem;
    color: #d97706;
    opacity: 0.5;
  }
`;

const ArtisanName = styled.h3`
  font-size: 1.5rem;
  color: #111827;
  margin: 0;
  font-weight: 700;
`;

const BusinessName = styled.div`
  font-size: 0.875rem;
  color: #d97706;
  margin-top: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const SpecialtySnippet = styled.div`
  margin-top: 1rem;
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.5;
  height: 2.8rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const CardFooter = styled.div`
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d97706;
  font-weight: 600;
  font-size: 0.9rem;
  transition: gap 0.3s ease;
  
  ${ArtisanCard}:hover & {
    gap: 0.8rem;
  }
`;

const ArtisansPage = () => {
  const { t } = useLanguage();
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/artisans', { params: { page: 1, limit: 50 } });
        setArtisans(data.artisans || []);
      } catch (err) {
        console.error('Failed to load artisans', err);
        setArtisans([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>{t('home.artisans.title') || 'Meet Our Artisans'}</HeroTitle>
        <HeroSubtitle>
          {t('home.artisans.subtitle') || 'Explore the stories and crafts of India\'s finest creators, preserving tradition through timeless handiwork.'}
        </HeroSubtitle>
      </HeroSection>
      
      <PageContent>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#6b7280' }}>
            Collecting artisan stories...
          </div>
        ) : artisans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#6b7280' }}>
            No artisans found.
          </div>
        ) : (
          <Grid>
            {artisans.map(a => (
              <ArtisanCard key={a._id || a.id} to={`/artisan/${a._id || a.id}`}>
                <AvatarWrapper>
                  {a.profileImage ? (
                    <img 
                      src={a.profileImage} 
                      alt={a.name} 
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display='none'; }}
                    />
                  ) : (
                    <FaUser />
                  )}
                </AvatarWrapper>
                <ArtisanName>{a.name}</ArtisanName>
                <BusinessName>{a.artisanProfile?.businessName || 'Master Artisan'}</BusinessName>
                <SpecialtySnippet>
                  {a.artisanProfile?.bio || (a.artisanProfile?.specialties?.join(', ') || 'Dedicated to preserving traditional Indian craftsmanship.')}
                </SpecialtySnippet>
                <CardFooter>
                  Explore Collection <FaChevronRight size={12} />
                </CardFooter>
              </ArtisanCard>
            ))}
          </Grid>
        )}
      </PageContent>
    </PageContainer>
  );
};

export default ArtisansPage;