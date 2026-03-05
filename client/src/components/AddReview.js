import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ReviewForm = styled.form`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #1f2937;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  
  &:focus {
    outline: none;
    border-color: #d97706;
    box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #d97706;
    box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2);
  }
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.filled ? '#d97706' : '#e5e7eb'};
  padding: 0;
  line-height: 1;
  
  &:focus {
    outline: none;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #b45309, #92400e);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SentimentPreview = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: #f9fafb;
  font-size: 0.875rem;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  strong {
    color: #1f2937;
  }
`;

const AddReview = ({ productId, onReviewAdded }) => {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    author: '',
    rating: 0,
    text: '',
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Analyze sentiment as user types (debounced in a real app)
    if (name === 'text' && value.length > 10) {
      analyzeSentiment(value);
    }
  };

  const analyzeSentiment = async (text) => {
    try {
      const { data } = await api.post('/sentiment/analyze', { text });
      setSentiment(data.data);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please login to submit a review');
      toast.error('Please login to submit a review');
      return;
    }
    
    if (!formData.text.trim()) {
      setError('Please enter your review text');
      return;
    }
    
    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // If text is long enough and no sentiment yet, wait for analysis
      if (formData.text.length > 10 && !sentiment) {
        // Analyze sentiment before submitting
        await analyzeSentiment(formData.text);
        // Give a moment for the sentiment to be set
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Save the review to the backend
      const { data } = await api.post(`/products/${productId}/reviews`, {
        rating: formData.rating,
        comment: formData.text,
        sentiment: sentiment?.sentiment,
        sentimentScore: sentiment?.score
      });
      
      // Call the callback with the saved review
      onReviewAdded(data);
      
      // Reset form
      setFormData({
        author: '',
        rating: 0,
        text: '',
      });
      setSentiment(null);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response?.status === 401) {
        setError('Please login to submit a review');
        toast.error('Please login to submit a review');
      } else if (error.response?.status === 403) {
        setError(error.response.data.message || 'You are not allowed to review this product');
        toast.error(error.response.data.message || 'You are not allowed to review this product');
      } else {
        setError('Failed to submit review. Please try again.');
        toast.error('Failed to submit review. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getSentimentFeedback = () => {
    if (!sentiment) return 'Start typing your review to see sentiment analysis...';
    
    const sentimentMap = {
      positive: '😊 Your review sounds positive!',
      negative: '😟 Your review sounds negative.',
      neutral: '😐 Your review sounds neutral.'
    };
    
    return (
      <>
        <span>{sentimentMap[sentiment.sentiment]}</span>
        <span style={{ marginLeft: 'auto' }}>
          Confidence: <strong>{(Math.abs(sentiment.score) * 100).toFixed(0)}%</strong>
        </span>
      </>
    );
  };

  return (
    <ReviewForm onSubmit={handleSubmit}>
      <FormTitle>Write a Review</FormTitle>
      
      {!isAuthenticated && (
        <div style={{ 
          backgroundColor: '#fef3c7', 
          border: '1px solid #f59e0b', 
          borderRadius: '0.5rem', 
          padding: '1rem', 
          marginBottom: '1.5rem',
          color: '#92400e'
        }}>
          <p style={{ margin: 0, fontWeight: 500 }}>
            Please <a href="/login" style={{ color: '#d97706', textDecoration: 'underline' }}>login</a> to submit a review
          </p>
        </div>
      )}
      
      <FormGroup>
        <Label htmlFor="author">Your Name (optional)</Label>
        <Input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Enter your name"
          disabled={!isAuthenticated || loading}
        />
      </FormGroup>
      
      <FormGroup>
        <Label>Your Rating</Label>
        <RatingContainer>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarButton
              key={star}
              type="button"
              filled={star <= (hoverRating || formData.rating)}
              onMouseEnter={() => isAuthenticated && setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => isAuthenticated && setFormData(prev => ({ ...prev, rating: star }))}
              disabled={!isAuthenticated || loading}
            >
              {star <= (hoverRating || formData.rating) ? '★' : '☆'}
            </StarButton>
          ))}
        </RatingContainer>
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="text">Your Review</Label>
        <TextArea
          id="text"
          name="text"
          value={formData.text}
          onChange={handleChange}
          placeholder="Share your thoughts about this product..."
          disabled={!isAuthenticated || loading}
        />
        {formData.text.length > 0 && formData.text.length < 10 && (
          <small style={{ color: '#6b7280' }}>Write a bit more for sentiment analysis</small>
        )}
      </FormGroup>
      
      {sentiment && (
        <SentimentPreview>
          {getSentimentFeedback()}
        </SentimentPreview>
      )}
      
      {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
      
      <SubmitButton type="submit" disabled={!isAuthenticated || loading || !formData.text.trim()}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </SubmitButton>
    </ReviewForm>
  );
};

export default AddReview;
