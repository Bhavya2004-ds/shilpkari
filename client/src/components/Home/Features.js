import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FeaturesContainer = styled.section`
  padding: 8rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
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
      radial-gradient(circle at 10% 20%, rgba(217, 119, 6, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 90% 80%, rgba(180, 83, 9, 0.05) 0%, transparent 50%);
  }
`;

const FeaturesContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 5rem;

  h2 {
    font-size: 3rem;
    font-weight: 800;
    background: linear-gradient(135deg, #1f2937 0%, #d97706 50%, #b45309 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1.5rem;

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 1.25rem;
    color: #4b5563;
    max-width: 700px;
    margin: 0 auto;
    font-weight: 500;
    line-height: 1.7;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(249, 250, 251, 0.1), rgba(243, 244, 246, 0.1));
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(217, 119, 6, 0.05), rgba(180, 83, 9, 0.05));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.15),
      0 10px 30px rgba(217, 119, 6, 0.1);

    &::before {
      opacity: 1;
    }
  }
`;

// Removed FeatureIcon as we're using images now

const FeatureTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.25rem;
  position: relative;
  z-index: 1;
  line-height: 1.3;
`;

const FeatureDescription = styled.p`
  color: #4b5563;
  line-height: 1.7;
  font-size: 1.1rem;
  position: relative;
  z-index: 1;
  max-width: 90%;
  margin: 0 auto;
`;

// Removed FeatureIcon as per request

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: t('home.features.ai.title'),
      description: t('home.features.ai.description')
    },
    {
      title: t('home.features.vr.title'),
      description: t('home.features.vr.description')
    },
    {
      title: t('home.features.blockchain.title'),
      description: t('home.features.blockchain.description')
    },
    {
      title: t('home.features.multilingual.title'),
      description: t('home.features.multilingual.description')
    }
  ];

  return (
    <FeaturesContainer>
      <FeaturesContent>
        <SectionHeader>
          <h2>{t('home.features.title')}</h2>
          <p>Discover how technology is revolutionizing the way we connect with traditional artisans</p>
        </SectionHeader>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesContent>
    </FeaturesContainer>
  );
};

export default Features;
