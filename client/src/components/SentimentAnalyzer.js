import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const SentimentContainer = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background: #f9fafb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
  margin-bottom: 1rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #d97706;
    box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2);
  }
`;

const AnalyzeButton = styled.button`
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;

  &:hover {
    background: linear-gradient(135deg, #b45309, #92400e);
  }
`;

const ResultContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
`;

const SentimentLabel = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.875rem;
  text-transform: capitalize;
  
  &.positive {
    background-color: #d1fae5;
    color: #065f46;
  }
  
  &.negative {
    background-color: #fee2e2;
    color: #991b1b;
  }
  
  &.neutral {
    background-color: #e5e7eb;
    color: #4b5563;
  }
`;

const ScoreMeter = styled.div`
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  margin: 1rem 0;
  overflow: hidden;
`;

const ScoreBar = styled.div`
  height: 100%;
  width: ${props => Math.abs(props.score) * 100}%;
  background: ${props => 
    props.score > 0.1 ? '#10b981' : 
    props.score < -0.1 ? '#ef4444' : '#6b7280'};
  margin-left: ${props => props.score < 0 ? 'auto' : '0'};
  margin-right: ${props => props.score < 0 ? '50%' : '0'};
`;

const SentimentAnalyzer = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const analyzeSentiment = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const { data } = await axios.post('/api/sentiment/analyze', { text });
      setResult(data.data);
    } catch (err) {
      console.error('Error analyzing sentiment:', err);
      setError('Failed to analyze sentiment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      default: return '😐';
    }
  };

  return (
    <SentimentContainer>
      <h3>Customer Sentiment Analysis</h3>
      <p>Enter text to analyze the sentiment:</p>
      
      <TextArea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your review, feedback, or any text to analyze sentiment..."
        disabled={loading}
      />
      
      <AnalyzeButton 
        onClick={analyzeSentiment}
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze Sentiment'}
      </AnalyzeButton>
      
      {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
      
      {result && (
        <ResultContainer>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span>Sentiment:</span>
            <SentimentLabel className={result.sentiment}>
              {result.sentiment} {getSentimentEmoji(result.sentiment)}
            </SentimentLabel>
            <span style={{ marginLeft: 'auto' }}>
              Score: {result.score.toFixed(2)}
            </span>
          </div>
          
          <ScoreMeter>
            <ScoreBar score={result.score} />
          </ScoreMeter>
          
          <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
            <div>Tokens analyzed: {result.tokens.length}</div>
            <div style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
              {result.score > 0.1 ? 'This text expresses a positive sentiment.' :
               result.score < -0.1 ? 'This text expresses a negative sentiment.' :
               'This text is neutral in sentiment.'}
            </div>
          </div>
        </ResultContainer>
      )}
    </SentimentContainer>
  );
};

export default SentimentAnalyzer;
