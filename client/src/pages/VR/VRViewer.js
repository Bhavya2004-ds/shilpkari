import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../lib/api';

const VRViewerContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const VRViewerContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const VRViewer = () => {
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
    <VRViewerContainer>
      <VRViewerContent>
        <h1>VR Viewer</h1>
        {loading ? <p>Loading...</p> : (
          product?.images?.[0]?.vr360Url ? (
            <iframe title="vr" src={product.images[0].vr360Url} width="100%" height="600" style={{ border: '0' }} />
          ) : (
            <p>VR content not available for this product.</p>
          )
        )}
      </VRViewerContent>
    </VRViewerContainer>
  );
};

export default VRViewer;
