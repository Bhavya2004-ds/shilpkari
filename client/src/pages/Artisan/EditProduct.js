import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const EditProductContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const EditProductContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const EditProduct = () => {
  const { id } = useParams();

  return (
    <EditProductContainer>
      <EditProductContent>
        <h1>Edit Product - {id}</h1>
        <p>This page is under development.</p>
      </EditProductContent>
    </EditProductContainer>
  );
};

export default EditProduct;
