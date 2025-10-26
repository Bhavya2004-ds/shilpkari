import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';

const ProductDetailContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const ProductDetailContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (e) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const runDemandForecast = async () => {
    setAiLoading(true);
    try {
      const { data } = await api.post('/ai/demand-forecast', { productId: id });
      toast.success('Demand forecast generated');
      setProduct(prev => ({ ...prev, demandForecast: data }));
    } catch (e) {
      toast.error('Forecast failed');
    } finally {
      setAiLoading(false);
    }
  };

  const runQualityCheck = async () => {
    setAiLoading(true);
    try {
      const imageUrl = product?.images?.[0]?.url;
      const { data } = await api.post('/ai/quality-check', { productId: id, imageUrl });
      toast.success('Quality check completed');
      setProduct(prev => ({ ...prev, qualityCheck: data }));
    } catch (e) {
      toast.error('Quality check failed');
    } finally {
      setAiLoading(false);
    }
  };

  const runSentiment = async () => {
    const text = prompt('Enter customer feedback text to analyze:');
    if (!text) return;
    setAiLoading(true);
    try {
      const { data } = await api.post('/ai/sentiment-analysis', { text, productId: id });
      toast.success(`Sentiment: ${data.sentiment}`);
    } catch (e) {
      toast.error('Sentiment analysis failed');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <ProductDetailContainer>
      <ProductDetailContent>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {product && (
          <>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => addItem({ id, name: product.name, price: product.price, image: product.images?.[0]?.url || '🧶', quantity: 1 })}>Add to Cart</button>
              <a className="btn btn-primary" href={`/vr/${id}`}>VR View</a>
              <a className="btn btn-secondary" href={`/ar/${id}`}>AR View</a>
              <button className="btn btn-secondary" onClick={runDemandForecast} disabled={aiLoading}>Demand Forecast</button>
              <button className="btn btn-secondary" onClick={runQualityCheck} disabled={aiLoading}>Quality Check</button>
              <button className="btn btn-secondary" onClick={runSentiment} disabled={aiLoading}>Sentiment Analysis</button>
            </div>
            {product?.demandForecast?.predictedDemand && (
              <div style={{ marginTop: '1rem' }}>
                <strong>Predicted Demand:</strong> {product.demandForecast.predictedDemand}
                {' '}<span style={{ color: '#6b7280' }}>(confidence {Math.round((product.demandForecast.confidence || 0) * 100)}%)</span>
              </div>
            )}
            {product?.qualityCheck?.score && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Quality Score:</strong> {product.qualityCheck.score}
                {' '}<span style={{ color: product.qualityCheck.isApproved ? '#16a34a' : '#ef4444' }}>{product.qualityCheck.isApproved ? 'Approved' : 'Needs Improvement'}</span>
              </div>
            )}
          </>
        )}
      </ProductDetailContent>
    </ProductDetailContainer>
  );
};

export default ProductDetail;
