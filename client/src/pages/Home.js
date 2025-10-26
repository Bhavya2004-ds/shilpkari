import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Components
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import Categories from '../components/Home/Categories';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import Artisans from '../components/Home/Artisans';
import Testimonials from '../components/Home/Testimonials';
import Newsletter from '../components/Home/Newsletter';

const HomeContainer = styled.div`
  min-height: 100vh;
`;

const Home = () => {
  const { t } = useLanguage();

  return (
    <HomeContainer>
      <Hero />
      <Features />
      <Categories />
      <FeaturedProducts />
      <Artisans />
      <Testimonials />
      <Newsletter />
    </HomeContainer>
  );
};

export default Home;
