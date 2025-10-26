import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

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

const ArtisanStats = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
`;

const Stat = styled.div`
  text-align: center;

  .number {
    font-size: 1.25rem;
    font-weight: 700;
    color: #d97706;
  }

  .label {
    font-size: 0.875rem;
    color: #6b7280;
  }
`;

const ViewProfileButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px 0 rgba(217, 119, 6, 0.3);
  }
`;

const Artisans = () => {
  const { t } = useLanguage();

  // Mock data - in real app, this would come from API
  const artisans = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      specialty: 'Pottery & Ceramics',
      avatar: 'RK',
      products: 45,
      rating: 4.9,
      experience: '15 years'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      specialty: 'Textile Arts',
      avatar: 'PS',
      products: 32,
      rating: 4.8,
      experience: '12 years'
    },
    {
      id: 3,
      name: 'Amit Singh',
      specialty: 'Wood Carving',
      avatar: 'AS',
      products: 28,
      rating: 4.9,
      experience: '18 years'
    }
  ];

  return (
    <ArtisansContainer>
      <ArtisansContent>
        <SectionHeader>
          <h2>{t('home.artisans.title')}</h2>
          <p>{t('home.artisans.subtitle')}</p>
        </SectionHeader>

        <ArtisansGrid>
          {artisans.map((artisan, index) => (
            <ArtisanCard
              key={artisan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ArtisanAvatar>{artisan.avatar}</ArtisanAvatar>
              <ArtisanName>{artisan.name}</ArtisanName>
              <ArtisanSpecialty>{artisan.specialty}</ArtisanSpecialty>
              
              <ArtisanStats>
                <Stat>
                  <div className="number">{artisan.products}</div>
                  <div className="label">Products</div>
                </Stat>
                <Stat>
                  <div className="number">{artisan.rating}</div>
                  <div className="label">Rating</div>
                </Stat>
                <Stat>
                  <div className="number">{artisan.experience}</div>
                  <div className="label">Experience</div>
                </Stat>
              </ArtisanStats>

              <ViewProfileButton to={`/artisan/${artisan.id}`}>
                View Profile
              </ViewProfileButton>
            </ArtisanCard>
          ))}
        </ArtisansGrid>
      </ArtisansContent>
    </ArtisansContainer>
  );
};

export default Artisans;
