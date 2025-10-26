import React from 'react';
import styled from 'styled-components';

const ContactContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const ContactContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const Contact = () => {
  return (
    <ContactContainer>
      <ContactContent>
        <h1>Contact Us</h1>
        <p>This page is under development.</p>
      </ContactContent>
    </ContactContainer>
  );
};

export default Contact;
