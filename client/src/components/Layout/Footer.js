import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #1f2937, #111827);
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: #d97706;
    margin-bottom: 1rem;
    font-size: 1.125rem;
    font-weight: 600;
  }

  p, a {
    color: #d1d5db;
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }

  a {
    text-decoration: none;
    transition: color 0.3s ease;
    display: block;
    margin-bottom: 0.5rem;

    &:hover {
      color: #d97706;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  background: rgba(217, 119, 6, 0.1);
  border: 1px solid rgba(217, 119, 6, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d97706;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: #d97706;
    color: white;
    transform: translateY(-2px);
  }
`;

const NewsletterForm = styled.form`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  margin-top: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid rgba(217, 119, 6, 0.3);
  border-radius: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 0.875rem;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #d97706;
  }
`;

const NewsletterButton = styled.button`
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #b45309, #92400e);
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(217, 119, 6, 0.2);
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
`;

const MadeWith = styled.p`
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Footer = () => {
  const { t } = useLanguage();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription');
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <h3>शिल्पकारी</h3>
            <p>{t('footer.description')}</p>
            <SocialLinks>
              <SocialLink href="#" aria-label="Facebook">
                📘
              </SocialLink>
              <SocialLink href="#" aria-label="Instagram">
                📷
              </SocialLink>
              <SocialLink href="#" aria-label="Twitter">
                🐦
              </SocialLink>
              <SocialLink href="#" aria-label="LinkedIn">
                💼
              </SocialLink>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <h3>{t('footer.quickLinks')}</h3>
            <Link to="/">{t('navigation.home')}</Link>
            <Link to="/products">{t('navigation.products')}</Link>
            <Link to="/artisans">{t('navigation.artisans')}</Link>
            <Link to="/about">{t('navigation.about')}</Link>
            <Link to="/contact">{t('navigation.contact')}</Link>
          </FooterSection>

          <FooterSection>
            <h3>{t('footer.categories')}</h3>
            <Link to="/products?category=pottery">{t('home.categories.pottery')}</Link>
            <Link to="/products?category=textiles">{t('home.categories.textiles')}</Link>
            <Link to="/products?category=jewelry">{t('home.categories.jewelry')}</Link>
            <Link to="/products?category=woodwork">{t('home.categories.woodwork')}</Link>
            <Link to="/products?category=metalwork">{t('home.categories.metalwork')}</Link>
          </FooterSection>

          <FooterSection>
            <h3>{t('footer.support')}</h3>
            <Link to="/help">Help Center</Link>
            <Link to="/shipping">Shipping Info</Link>
            <Link to="/returns">Returns</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </FooterSection>

          <FooterSection>
            <h3>{t('footer.newsletter')}</h3>
            <p>Stay updated with our latest products and offers</p>
            <NewsletterForm onSubmit={handleNewsletterSubmit}>
              <NewsletterInput
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                required
              />
              <NewsletterButton type="submit">
                {t('footer.subscribe')}
              </NewsletterButton>
            </NewsletterForm>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <Copyright>{t('footer.copyright')}</Copyright>
          <MadeWith>
            {t('footer.madeWith')}
          </MadeWith>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
