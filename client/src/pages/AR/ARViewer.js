import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../lib/api';

const ARViewerContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const ARViewerContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const ARViewer = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <ARViewerContainer>
      <ARViewerContent>
        <h1>AR Viewer</h1>
        {loading ? <p>Loading...</p> : (
          product?.images?.[0]?.arModelUrl ? (
            <model-viewer src={product.images[0].arModelUrl} ar auto-rotate camera-controls style={{ width: '100%', height: '600px' }} />
          ) : (
            <p>AR model not available for this product.</p>
          )
        )}
      </ARViewerContent>
    </ARViewerContainer>
  );
};

export default ARViewer;
