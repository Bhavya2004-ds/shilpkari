import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { FiAward, FiGlobe, FiUsers, FiHeart, FiMail, FiPhone, FiMapPin, FiShoppingBag, FiShield } from 'react-icons/fi';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AboutContainer = styled.div`
  min-height: 100vh;
  background: #fffaf0;
  color: #431407;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.7;
  padding: 2rem 0;
`;

const AboutContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 5rem 2rem;
  border-radius: 16px;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 10px 25px -5px rgba(217, 119, 6, 0.2);
`;

const Heading = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  background: linear-gradient(90deg, #fff, #ffedd5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
  line-height: 1.2;
`;

const Lead = styled.p`
  color: rgba(255, 251, 235, 0.9);
  font-size: 1.25rem;
  max-width: 800px;
  margin: 0 auto 2rem auto;
  line-height: 1.6;
`;

const Section = styled.section`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.04);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    color: #431407;
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    svg {
      color: #d97706;
    }
  }
  
  p {
    color: #431407;
    margin: 0;
    line-height: 1.7;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CTA = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: ${props => (props.primary ? '#d97706' : 'transparent')};
  color: ${props => (props.primary ? '#fff' : '#b45309')};
  border: ${props => (props.primary ? 'none' : '2px solid #d97706')};
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    background: ${props => (props.primary ? '#b45309' : 'rgba(217, 119, 6, 0.1)')};
    color: ${props => (props.primary ? '#fff' : '#b45309')};

  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ContactBox = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.04);
  
  h2 {
    color: #431407;
    margin-top: 0;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  p {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1.25rem 0;
    color: #431407;
    
    svg {
      color: #d97706;
    }
    
    a {
      color: #d97706;
      text-decoration: none;
      transition: color 0.2s;
      
      &:hover {
        color: #b45309;
        text-decoration: underline;
      }
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;
`;

const StatCard = styled.div`
  background: #fff;
  padding: 2rem 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    font-size: 2rem;
    color: #d97706;
    margin: 0.5rem 0;
  }
  
  p {
    color: #431407;
    margin: 0;
    font-size: 1rem;
  }
  
  svg {
    font-size: 2rem;
    color: #d97706;
    margin-bottom: 0.5rem;
  }
`;

const FooterNote = styled.p`
  color: #78350f;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #fed7aa;
  text-align: center;
  font-size: 0.95rem;
  
  a {
    color: #d97706;
    text-decoration: none;
    transition: color 0.2s;
    
    &:hover {
      color: #b45309;
      text-decoration: underline;
    }
  }
`;

const About = () => {
  return (
    <AboutContainer>
      <AboutContent>
        <HeroSection>
          <Heading>About Shilpkari</Heading>
          <Lead>
            Connecting Indian artisans with customers worldwide — showcasing handcrafted goods,
            preserving traditional skills, and supporting sustainable livelihoods.
          </Lead>
          <CTA>
            <Button primary to="/products">
              <FiShoppingBag /> Shop Now
            </Button>
            <Button to="/contact">
              <FiMail /> Contact Us
            </Button>
          </CTA>
        </HeroSection>

        <StatsGrid>
          <StatCard>
            <FiUsers />
            <h3>500+</h3>
            <p>Artisans Empowered</p>
          </StatCard>
          <StatCard>
            <FiGlobe />
            <h3>50+</h3>
            <p>Countries Reached</p>
          </StatCard>
          <StatCard>
            <FiAward />
            <h3>1000+</h3>
            <p>Handcrafted Products</p>
          </StatCard>
          <StatCard>
            <FiHeart />
            <h3>10K+</h3>
            <p>Happy Customers</p>
          </StatCard>
        </StatsGrid>

        <Grid>
          <div>
            <Section>
              <h2><FiAward /> Our Mission</h2>
              <p>
                To empower artisans by providing them a global platform to showcase their skills and
                products, ensuring fair compensation and sustainable income while preserving traditional craftsmanship.
              </p>
            </Section>

            <Section>
              <h2><FiGlobe /> Our Vision</h2>
              <p>
                A world where traditional Indian arts and crafts thrive, artisans are respected and
                well-compensated, and customers enjoy authentic, handcrafted products that tell a story.
              </p>
            </Section>

            <Section>
              <h2><FiShield /> Our Values</h2>
              <p>
                We believe in integrity, transparency, and sustainability. We are committed to
                preserving the environment and supporting the communities we work with through ethical practices.
              </p>
            </Section>
          </div>

          <div>
            <Section>
              <h2><FiUsers /> Get Involved</h2>
              <p>
                Join us in our mission to support Indian artisans. You can help by spreading the
                word, shopping our collections, or contacting us for collaborations and partnerships.
              </p>

              <CTA>
                <Button to="/products" primary>
                  <FiShoppingBag /> Shop Now
                </Button>
                <Button to="/contact">
                  <FiMail /> Contact Us
                </Button>
              </CTA>
            </Section>

            <ContactBox>
              <h2><FiMapPin /> Contact Information</h2>
              <p>
                <FiMail /> <a href="mailto:hello@shilpkari.com">hello@shilpkari.com</a>
              </p>
              <p>
                <FiPhone /> <a href="tel:+919876543210">+91 98765 43210</a>
              </p>
              <p>
                <FiMapPin /> 123 Artisan Street, Mumbai, India 400001
              </p>
            </ContactBox>
          </div>
        </Grid>

        <FooterNote>
          &copy; {new Date().getFullYear()} Shilpkari. All rights reserved. |{' '}
          <Link to="/terms">Terms of Service</Link> |{' '}
          <Link to="/privacy">Privacy Policy</Link> | Crafted with ❤️ in India
        </FooterNote>
      </AboutContent>
    </AboutContainer>
  );
};

export default About;
