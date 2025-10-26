import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CategoriesContainer = styled.section`
  padding: 7rem 0;
  background: #f9fafb;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05), transparent);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 10%, rgba(217, 119, 6, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 90%, rgba(180, 83, 9, 0.03) 0%, transparent 50%);
  }
`;

const CategoriesContent = styled.div`
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
  }

  p {
    font-size: 1.1rem;
    color: #6b7280;
    max-width: 700px;
    margin: 1.5rem auto 0;
    line-height: 1.7;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2.5rem;
`;

const CategoryCard = styled(motion.div)`
  background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
  border-radius: 1.25rem;
  padding: 2.5rem 1.5rem;
  text-align: center;
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.1),
    0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  perspective: 1000px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.6) 100%
    );
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(247, 183, 51, 0.1), rgba(217, 119, 6, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #f59e0b, #d97706, #b45309);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: scaleX(0);
    transform-origin: left;
  }

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 
      0 15px 35px rgba(0, 0, 0, 0.08),
      0 5px 15px rgba(217, 119, 6, 0.1);
    border-color: rgba(217, 119, 6, 0.15);
    
    &::before {
      opacity: 1;
      transform: scaleX(1);
    }
    
    &::after {
      opacity: 1;
    }
  }
`;

const CategoryName = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  margin: 0;
  position: relative;
  z-index: 2;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-align: center;
  padding: 0.75rem 1.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  ${CategoryCard}:hover & {
    transform: translateY(-5px) scale(1.05);
    text-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  }
`;

const CategoryLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Categories = () => {
  const { t } = useLanguage();

  const categories = [
    { 
      key: 'pottery', 
      name: t('home.categories.pottery'),
      image: 'https://i.pinimg.com/1200x/b9/b2/47/b9b247cc8717a46d66d93f409b98b941.jpg'
    },
    { 
      key: 'textiles', 
      name: t('home.categories.textiles'),
      image: 'https://i.pinimg.com/1200x/55/a0/e8/55a0e8c1ad84704f3ad7f1ceeb3b723d.jpg'
    },
    { 
      key: 'jewelry', 
      name: t('home.categories.jewelry'),
      image: 'https://i.pinimg.com/736x/e1/47/62/e14762cb6febcc97a8fc0d02be75b93b.jpg'
    },
    { 
      key: 'woodwork', 
      name: t('home.categories.woodwork'),
      image: 'https://i.pinimg.com/1200x/8e/33/d9/8e33d94b8060cbe92fceb8399a5b0d44.jpg'
    },
    { 
      key: 'metalwork', 
      name: t('home.categories.metalwork'),
      image: 'https://i.pinimg.com/736x/1f/68/e4/1f68e47956140a7bd2bcd3feed5681b9.jpg'
    },
    { 
      key: 'paintings', 
      name: t('home.categories.paintings'),
      image: 'https://i.pinimg.com/1200x/fa/7e/33/fa7e335c9522f470e6f6d583a2348ebd.jpg'
    },
    { 
      key: 'sculptures', 
      name: t('home.categories.sculptures'),
      image: 'https://i.pinimg.com/1200x/1d/07/5f/1d075fd3602746fb8dee96ccd4def881.jpg'
    },
    { 
      key: 'basketry', 
      name: t('home.categories.basketry'),
      image: 'https://i.pinimg.com/1200x/4d/99/69/4d9969e617a44de15f792a4e04a8347f.jpg'
    },
    { 
      key: 'leatherwork', 
      name: t('home.categories.leatherwork'),
      image: 'https://i.pinimg.com/736x/0a/6a/9e/0a6a9ec6dde6f4008b4310e02822901e.jpg'
    }
  ];

  return (
    <CategoriesContainer>
      <CategoriesContent>
        <SectionHeader>
          <h2>{t('home.categories.title')}</h2>
          <p>Explore our diverse collection of authentic Indian handicrafts</p>
        </SectionHeader>

        <CategoriesGrid>
          {categories.map((category, index) => (
            <CategoryLink key={category.key} to={`/products?category=${category.key}`}>
              <CategoryCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                style={{
                  backgroundImage: `url(${category.image})`,
                }}
                whileHover={{
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
              >
                <CategoryName>{category.name}</CategoryName>
              </CategoryCard>
            </CategoryLink>
          ))}
        </CategoriesGrid>
      </CategoriesContent>
    </CategoriesContainer>
  );
};

export default Categories;
