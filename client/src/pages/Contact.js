import React, { useState } from 'react';
import styled from 'styled-components';
import { FiMail, FiPhone, FiMapPin, FiSend, FiUser, FiMessageSquare, FiExternalLink } from 'react-icons/fi';

const ContactContainer = styled.div`
  min-height: 100vh;
  background: #fffaf0;
  color: #431407;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 4rem 0;
`;

const ContactContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    color: #d97706;
    margin-bottom: 1rem;
  }
  
  p {
    color: #78350f;
    font-size: 1.1rem;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  
  h2 {
    color: #431407;
    margin-top: 0;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #431407;
    font-weight: 500;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s;
    
    &:focus {
      outline: none;
      border-color: #d97706;
      box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
    }
  }
  
  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

const SubmitButton = styled.button`
  background: #d97706;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background: #b45309;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  text-align: left;
  
  h3 {
    color: #431407;
    margin-top: 0;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    color: #431407;
    margin: 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    a {
      color: #d97706;
      text-decoration: none;
      transition: color 0.2s;
      
      &:hover {
        color: #b45309;
        text-decoration: underline;
      }
    }
    
    svg {
      color: #d97706;
      flex-shrink: 0;
    }
  }
`;

const MapContainer = styled.div`
  height: 300px;
  width: 100%;
  border-radius: 12px;
  margin-top: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <ContactContainer>
      <ContactContent>
        <PageHeader>
          <h1>Get In Touch</h1>
          <p>Have questions or feedback? We'd love to hear from you. Reach out to us using the form below or through our contact information.</p>
        </PageHeader>
        
        <ContactGrid>
          <ContactForm onSubmit={handleSubmit}>
            <h2><FiUser /> Send us a Message</h2>
            <FormGroup>
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What's this about?"
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Type your message here..."
              />
            </FormGroup>
            
            <SubmitButton type="submit">
              <FiSend /> Send Message
            </SubmitButton>
          </ContactForm>
          
          <ContactInfo>
            <InfoCard>
              <h3><FiMail /> Contact Information</h3>
              <p><FiMail /> <a href="mailto:hello@shilpkari.com">hello@shilpkari.com</a></p>
              <p><FiPhone /> <a href="tel:+919876543210">+91 98765 43210</a></p>
              <p><FiMapPin /> 123 Artisan Street, Jaipur, Rajasthan 302001, India</p>
              
              <h3 style={{ marginTop: '2rem' }}><FiMessageSquare /> Business Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
              
              <h3 style={{ marginTop: '2rem' }}>Our Location</h3>
              <MapContainer>
                <iframe 
                  src="https://www.openstreetmap.org/export/embed.html?bbox=75.7367,26.8000,75.9367,27.0000&layer=mapnik&marker=26.9124,75.7873"
                  title="Shilpkari Location"
                  allowFullScreen
                ></iframe>
              </MapContainer>
              <p style={{
                marginTop: '0.5rem',
                textAlign: 'right',
                fontSize: '0.9rem',
              }}>
                <a 
                  href="https://www.openstreetmap.org/?mlat=26.9124&mlon=75.7873#map=13/26.9124/75.7873" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#d97706',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  View Larger Map <FiExternalLink size={14} />
                </a>
              </p>
            </InfoCard>
          </ContactInfo>
        </ContactGrid>
      </ContactContent>
    </ContactContainer>
  );
};

export default Contact;
