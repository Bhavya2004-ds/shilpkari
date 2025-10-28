import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import api from '../../lib/api';

const ArtisansContainer = styled.section`
  padding: 6rem 0;
  background: #f9fafb;
`;

const ArtisansContent = styled.div`
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

const ArtisansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ArtisanCard = styled(motion.div)`
  background: white;
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const ArtisanAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d97706, #b45309);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 2rem;
  font-weight: 600;
`;

const ArtisanName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const ArtisanSpecialty = styled.p`
  color: #6b7280;
  margin-bottom: 1rem;
`;

// Removed ArtisanStats and Stat components as they're no longer needed

const ViewProfileButton = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  padding: 0.85rem 1.75rem;
  background: #d97706;
  color: white;
  text-decoration: none;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
  text-align: center;
  width: 100%;
  max-width: 200px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;

  &:hover {
    background: #b45309;
    color:white;
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const Artisans = () => {
  const { t } = useLanguage();
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtisans = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/artisans', { params: { page: 1, limit: 3 } });
        setArtisans(data.artisans || []);
      } catch (err) {
        console.error('Failed to load artisans', err);
        setArtisans([]);
      } finally {
        setLoading(false);
      }
    };
    loadArtisans();
  }, []);

  return (
    <ArtisansContainer>
      <ArtisansContent>
        <SectionHeader>
          <h2>{t('home.artisans.title') || 'Meet Our Artisans'}</h2>
          <p>{t('home.artisans.subtitle') || 'Discover the talented artisans behind our products'}</p>
        </SectionHeader>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading artisans...</p>
        ) : artisans.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No artisans found</p>
        ) : (
          <ArtisansGrid>
          {artisans.map((artisan, index) => (
            <ArtisanCard
              key={artisan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ArtisanAvatar>
                {artisan.profileImage ? (
                  <img 
                    src={artisan.profileImage} 
                    alt={artisan.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                  />
                ) : (
                  artisan.name?.charAt(0)?.toUpperCase() || 'A'
                )}
              </ArtisanAvatar>
              <ArtisanName>{artisan.name}</ArtisanName>
              <ArtisanSpecialty>
                {artisan.artisanProfile?.businessName || (artisan.artisanProfile?.specialties?.join(', ') || 'Artisan')}
              </ArtisanSpecialty>

              <ViewProfileButton to={`/artisan/${artisan._id}`}>
                View Profile
              </ViewProfileButton>
            </ArtisanCard>
          ))}
        </ArtisansGrid>
        )}
      </ArtisansContent>
    </ArtisansContainer>
  );
};

export default Artisans;
