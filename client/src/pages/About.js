import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const AboutContainer = styled.div`
  min-height: 100vh;
  padding: 4rem 0;
  background: #faf9f7;
  color: #222;
`;

const AboutContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const Lead = styled.p`
  color: #666;
  margin-bottom: 1.75rem;
`;

const Section = styled.section`
  background: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`;

const CTA = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 10px 16px;
  border-radius: 6px;
  background: ${props => (props.primary ? '#d97706' : 'transparent')};
  color: ${props => (props.primary ? '#fff' : '#d97706')};
  border: ${props => (props.primary ? 'none' : '1px solid #d97706')};
  text-decoration: none;
  font-weight: 600;
`;

const ContactBox = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
`;

const FooterNote = styled.p`
  color: #666;
  margin-top: 1.25rem;
  font-size: 0.95rem;
`;

const About = () => {
  return (
    <AboutContainer>
      <AboutContent>
        <Heading>About Shilpkari</Heading>
        <Lead>
          Shilpkari connects Indian artisans with customers worldwide — showcasing handcrafted goods,
          preserving traditional skills, and supporting sustainable livelihoods.
        </Lead>

        <Grid>
          <div>
            <Section>
              <h2>Our Mission</h2>
              <p>
                To empower artisans by providing them a global platform to showcase their skills and
                products, ensuring fair compensation and sustainable income.
              </p>
            </Section>

            <Section>
              <h2>Our Vision</h2>
              <p>
                A world where traditional Indian arts and crafts thrive, artisans are respected and
                well-compensated, and customers enjoy authentic, handcrafted products.
              </p>
            </Section>

            <Section>
              <h2>Our Values</h2>
              <p>
                We believe in integrity, transparency, and sustainability. We are committed to
                preserving the environment and supporting the communities we work with.
              </p>
            </Section>
          </div>

          <div>
            <Section>
              <h2>Get Involved</h2>
              <p>
                Join us in our mission to support Indian artisans. You can help by spreading the
                word, shopping our collections, or contacting us for collaborations.
              </p>

              <CTA>
                <Button to="/shop" primary>
                  Shop Now
                </Button>
                <Button to="/contact">Contact Us</Button>
              </CTA>
            </Section>

            <ContactBox>
              <h2>Contact Information</h2>
              <p>
                Email: <a href="mailto:info@shilpkari.com">info@shilpkari.com</a>
              </p>
              <p>
                Phone: <a href="tel:+1234567890">+1 (234) 567-890</a>
              </p>
            </ContactBox>
          </div>
        </Grid>

        <FooterNote>
          &copy; 2023 Shilpkari. All rights reserved. |{' '}
          <Link to="/terms">Terms of Service</Link> |{' '}
          <Link to="/privacy">Privacy Policy</Link>
        </FooterNote>
      </AboutContent>
    </AboutContainer>
  );
};

export default About;
