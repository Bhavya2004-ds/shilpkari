import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CategoriesContainer = styled.section`
  padding: 8rem 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
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
    font-size: 1.25rem;
    color: #4b5563;
    max-width: 700px;
    margin: 0 auto;
    font-weight: 500;
    line-height: 1.7;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const CategoryCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 2rem;
  padding: 2.5rem 1.5rem;
  text-align: center;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
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
    transform: translateY(-8px) scale(1.05);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.15),
      0 10px 30px rgba(217, 119, 6, 0.1);

    &::before {
      opacity: 1;
    }
  }
`;

const CategoryIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  ${CategoryCard}:hover & {
    transform: scale(1.2) rotate(10deg);
  }
`;

const CategoryName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
`;

const CategoryLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Categories = () => {
  const { t } = useLanguage();

  const categories = [
    { key: 'pottery', icon: '🏺', name: t('home.categories.pottery') },
    { key: 'textiles', icon: '🧵', name: t('home.categories.textiles') },
    { key: 'jewelry', icon: '💎', name: t('home.categories.jewelry') },
    { key: 'woodwork', icon: '🪵', name: t('home.categories.woodwork') },
    { key: 'metalwork', icon: '⚒️', name: t('home.categories.metalwork') },
    { key: 'paintings', icon: '🎨', name: t('home.categories.paintings') },
    { key: 'sculptures', icon: '🗿', name: t('home.categories.sculptures') },
    { key: 'basketry', icon: '🧺', name: t('home.categories.basketry') },
    { key: 'leatherwork', icon: '👜', name: t('home.categories.leatherwork') }
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
              >
                <CategoryIcon>{category.icon}</CategoryIcon>
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
