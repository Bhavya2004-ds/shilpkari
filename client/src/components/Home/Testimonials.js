import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TestimonialsContainer = styled.section`
  padding: 6rem 0;
  background: white;
`;

const TestimonialsContent = styled.div`
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

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const TestimonialCard = styled(motion.div)`
  background: #f9fafb;
  border-radius: 1rem;
  padding: 2rem;
  position: relative;

  &::before {
    content: '"';
    position: absolute;
    top: -10px;
    left: 20px;
    font-size: 4rem;
    color: #d97706;
    font-family: serif;
  }
`;

const TestimonialText = styled.p`
  font-size: 1.125rem;
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d97706, #b45309);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
`;

const AuthorInfo = styled.div`
  .name {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  .location {
    color: #6b7280;
    font-size: 0.875rem;
  }
`;

const Rating = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;

  .star {
    color: #fbbf24;
    font-size: 1.25rem;
  }
`;

const Testimonials = () => {
  const { t } = useLanguage();

  // Mock data - in real app, this would come from API
  const testimonials = [
    {
      id: 1,
      text: "Shilpkari has transformed my business. I can now reach customers worldwide and showcase my pottery in ways I never imagined possible.",
      author: "Rajesh Kumar",
      location: "Jaipur, Rajasthan",
      avatar: "RK",
      rating: 5
    },
    {
      id: 2,
      text: "The VR feature is amazing! I could see every detail of the handwoven saree before buying. It's like shopping in person but from home.",
      author: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      avatar: "PS",
      rating: 5
    },
    {
      id: 3,
      text: "The blockchain tracking gives me complete confidence in the authenticity of my purchases. I know exactly where my products come from.",
      author: "Amit Singh",
      location: "Delhi, NCR",
      avatar: "AS",
      rating: 5
    }
  ];

  return (
    <TestimonialsContainer>
      <TestimonialsContent>
        <SectionHeader>
          <h2>{t('home.testimonials.title')}</h2>
          <p>{t('home.testimonials.subtitle')}</p>
        </SectionHeader>

        <TestimonialsGrid>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Rating>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </Rating>
              
              <TestimonialText>{testimonial.text}</TestimonialText>
              
              <TestimonialAuthor>
                <AuthorAvatar>{testimonial.avatar}</AuthorAvatar>
                <AuthorInfo>
                  <div className="name">{testimonial.author}</div>
                  <div className="location">{testimonial.location}</div>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>
          ))}
        </TestimonialsGrid>
      </TestimonialsContent>
    </TestimonialsContainer>
  );
};

export default Testimonials;
