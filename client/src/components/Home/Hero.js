import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeroContainer = styled.section`
  padding: 8rem 0 6rem;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%);
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
`;

const BackgroundCarousel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${props => `url('${props.bgImage}')`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: ${props => props.active ? 1 : 0};
  transition: opacity 1.5s ease-in-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(254, 243, 199, 0.3) 0%,
      rgba(253, 230, 138, 0.2) 50%,
      rgba(251, 191, 36, 0.15) 100%
    );
    z-index: 1;
  }
`;

const ImageCarousel = styled.div`
  position: relative;
  width: 100%;
  height: 350px;
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: 
    0 20px 40px -12px rgba(0, 0, 0, 0.2),
    0 10px 20px -8px rgba(217, 119, 6, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
`;

const CarouselImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${props => `url('${props.bgImage}')`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: ${props => props.active ? 1 : 0};
  transition: opacity 1s ease-in-out;
  border-radius: 2.5rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(217, 119, 6, 0.1) 0%,
      rgba(180, 83, 9, 0.2) 50%,
      rgba(251, 191, 36, 0.1) 100%
    );
    z-index: 1;
  }
`;

const StatsRight = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
`;

const HeroText = styled.div`
  h1 {
    font-size: 4rem;
    font-weight: 900;
    background: linear-gradient(135deg, #1f2937 0%, #d97706 50%, #b45309 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1.5rem;
    line-height: 1.1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
      font-size: 3rem;
    }

    @media (max-width: 480px) {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 1.375rem;
    color: #374151;
    margin-bottom: 2.5rem;
    line-height: 1.7;
    font-weight: 500;
    max-width: 600px;

    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    justify-content: center;
  }
`;

const CTAButton = styled(Link)`
  padding: 1.25rem 2.5rem;
  border-radius: 1rem;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.125rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &.primary {
    background: linear-gradient(135deg, #d97706, #b45309, #92400e);
    color: white;
    box-shadow: 
      0 8px 25px rgba(217, 119, 6, 0.3),
      0 4px 12px rgba(217, 119, 6, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);

    &:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 
        0 12px 35px rgba(217, 119, 6, 0.4),
        0 6px 20px rgba(217, 119, 6, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    &:active {
      transform: translateY(-1px) scale(0.98);
    }
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.9);
    color: #d97706;
    border: 2px solid #d97706;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    &:hover {
      background: #d97706;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(217, 119, 6, 0.3);
    }
  }
`;

const HeroImageSection = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    order: -1;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 500px;
  border-radius: 2.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 35px 70px -12px rgba(0, 0, 0, 0.3),
    0 20px 40px -12px rgba(217, 119, 6, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
`;

const HeroImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: ${props => `url('${props.bgImage}')`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  border-radius: 2.5rem;
  overflow: hidden;
  transition: all 0.8s ease-in-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(217, 119, 6, 0.1) 0%,
      rgba(180, 83, 9, 0.2) 50%,
      rgba(251, 191, 36, 0.1) 100%
    );
    z-index: 1;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  z-index: 2;
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 3;
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #d97706;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(217, 119, 6, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);

  &.small {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  &.medium {
    width: 70px;
    height: 70px;
    font-size: 1.75rem;
  }

  &.large {
    width: 90px;
    height: 90px;
    font-size: 2.25rem;
  }
`;

const StatsContainer = styled.div`
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    margin-top: 2rem;
  }
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .number {
    font-size: 1.75rem;
    font-weight: 900;
    background: linear-gradient(135deg, #d97706, #b45309);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
  }

  .label {
    color: #374151;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
  }
`;

const Hero = () => {
  const { t } = useLanguage();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    'https://i.pinimg.com/1200x/fa/c4/24/fac4245dedec66c9975383babe9fabde.jpg',
    'https://i.pinimg.com/1200x/fd/ed/4b/fded4b8e08fe265811fbaa5a388c5bbe.jpg',
    'https://i.pinimg.com/1200x/87/67/e1/8767e127a5c6533e6e8e7bba799f8320.jpg',
    'https://i.pinimg.com/736x/62/64/49/626449b7c7641d81a179be13b9ac4ecd.jpg',
    'https://i.pinimg.com/1200x/d2/d4/f9/d2d4f9d4e678b8a8c3528780d9f6d948.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <HeroContainer>
      <BackgroundCarousel>
        {images.map((image, index) => (
          <BackgroundImage
            key={index}
            bgImage={image}
            active={index === currentImageIndex}
          />
        ))}
      </BackgroundCarousel>
      
      <HeroContent>
        <HeroText>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('home.hero.title')}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('home.hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <CTAButtons>
              <CTAButton to="/products" className="primary">
                {t('home.hero.cta')}
                <span>→</span>
              </CTAButton>
              <CTAButton to="/about" className="secondary">
                {t('home.hero.learnMore')}
              </CTAButton>
            </CTAButtons>
          </motion.div>

        </HeroText>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <StatsRight>
            <StatItem>
              <div className="number">23M+</div>
              <div className="label">Artisans</div>
            </StatItem>
            <StatItem>
              <div className="number">50K+</div>
              <div className="label">Products</div>
            </StatItem>
            <StatItem>
              <div className="number">100+</div>
              <div className="label">Countries</div>
            </StatItem>
            <StatItem>
              <div className="number">4.9★</div>
              <div className="label">Rating</div>
            </StatItem>
          </StatsRight>
        </motion.div>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;
