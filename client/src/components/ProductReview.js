import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ReviewContainer = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReviewAuthor = styled.div`
  font-weight: 600;
  color: #1f2937;
`;

const ReviewDate = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const ReviewText = styled.p`
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const SentimentBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => 
    props.sentiment === 'positive' ? '#d1fae5' : 
    props.sentiment === 'negative' ? '#fee2e2' : '#e5e7eb'};
  color: ${props => 
    props.sentiment === 'positive' ? '#065f46' : 
    props.sentiment === 'negative' ? '#991b1b' : '#4b5563'};
`;

const SentimentIcon = styled.span`
  font-size: 1rem;
`;

const ProductReview = ({ review, productId }) => {
  const [sentiment, setSentiment] = useState(review.sentiment);
  const [loading, setLoading] = useState(false);

  // Analyze sentiment when component mounts if not already analyzed
  React.useEffect(() => {
    if (!sentiment && review.text) {
      analyzeSentiment(review.text);
    }
  }, [review.text]);

  const analyzeSentiment = async (text) => {
    if (!text.trim() || sentiment) return;
    
    setLoading(true);
    try {
      const { data } = await axios.post('/api/sentiment/analyze', { text });
      setSentiment(data.data.sentiment);
      
      // In a real app, you'd want to save this to your database
      // await axios.patch(`/api/products/${productId}/reviews/${review.id}`, {
      //   sentiment: data.data.sentiment,
      //   sentimentScore: data.data.score
      // });
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentEmoji = () => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      case 'neutral': return '😐';
      default: return '🔍';
    }
  };

  return (
    <ReviewContainer>
      <ReviewHeader>
        <ReviewAuthor>{review.author || 'Anonymous'}</ReviewAuthor>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {loading ? (
            <span>Analyzing...</span>
          ) : sentiment ? (
            <SentimentBadge sentiment={sentiment}>
              <SentimentIcon>{getSentimentEmoji()}</SentimentIcon>
              {sentiment}
            </SentimentBadge>
          ) : null}
          <ReviewDate>
            {new Date(review.date || new Date()).toLocaleDateString()}
          </ReviewDate>
        </div>
      </ReviewHeader>
      <ReviewText>{review.text}</ReviewText>
      {review.rating && (
        <div style={{ color: '#d97706', fontWeight: 500 }}>
          {'★'.repeat(Math.round(review.rating))}{'☆'.repeat(5 - Math.round(review.rating))}
        </div>
      )}
    </ReviewContainer>
  );
};

export default ProductReview;
