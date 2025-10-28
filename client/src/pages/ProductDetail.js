import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';
import ProductReview from '../components/ProductReview';
import AddReview from '../components/AddReview';
import { FaStar, FaFilter, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const ProductDetailContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  min-height: calc(100vh - 100px);
`;

const ProductDetailContent = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  @media (max-width: 1024px) {
    padding: 2rem;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem;
    border-radius: 10px;
  }
`;

const ProductGrid = styled.div`
  display: flex;
  gap: 4rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow: hidden;
  
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const ProductImage = styled.div`
  flex: 1;
  min-height: 500px;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  @media (max-width: 1200px) {
    min-height: 400px;
  }
  
  @media (max-width: 992px) {
    min-height: 300px;
    padding: 1.5rem;
  }
`;

const ProductInfo = styled.div`
  flex: 1;
  padding: 3rem 2rem 3rem 0;
  
  h1 {
    font-size: 2.2rem;
    margin: 0 0 1rem;
    color: #333;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.5px;
    
    @media (max-width: 1024px) {
      font-size: 2.25rem;
    }
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.75rem;
    }
  }
  
  .price {
    font-size: 2rem;
    color: #e74c3c;
    font-weight: 700;
    margin: 1rem 0 1.5rem;
    display: block;
    
    @media (max-width: 768px) {
      font-size: 1.75rem;
      margin: 0.75rem 0 1.25rem;
    }
  }
  
  .description {
    color: #475569;
    line-height: 1.8;
    margin: 1.75rem 0;
    font-size: 1.1rem;
    font-weight: 400;
    
    @media (max-width: 768px) {
      font-size: 1.05rem;
      line-height: 1.7;
      margin: 1.5rem 0;
    }
  }
  
  .category {
    display: inline-flex;
    align-items: center;
    background: #f1f5f9;
    color: #334155;
    padding: 0.5rem 1.25rem;
    border-radius: 50px;
    font-size: 0.95rem;
    margin: 0.5rem 0 1.5rem;
    font-weight: 600;
    text-transform: capitalize;
    letter-spacing: 0.3px;
    transition: all 0.2s ease;
    border: 1px solid rgba(0, 0, 0, 0.03);
    
    &:hover {
      background: #e2e8f0;
      transform: translateY(-1px);
    }
    
    @media (max-width: 768px) {
      padding: 0.4rem 1rem;
      font-size: 0.9rem;
    }
  }
  
  .product-details {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #eee;
    
    h3 {
      font-size: 1.4rem;
      margin: 0 0 1.2rem;
      color: #2c3e50;
    }
    
    p {
      margin: 0.8rem 0;
      color: #4b5563;
      font-size: 1rem;
      line-height: 1.6;
      
      strong {
        color: #2c3e50;
        min-width: 120px;
        display: inline-block;
      }
    }
  }
  
  .ai-features {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    
    h4 {
      margin: 0 0 1rem;
      color: #2c3e50;
      font-size: 1.2rem;
    }
    
    .ai-feature {
      margin: 1rem 0;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      
      p {
        margin: 0.5rem 0;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
    }
  }
`;

const AddToCartButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 300px;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(231, 76, 60, 0.2);
  
  &:hover {
    background-color: #c0392b;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
`;

// Styled components for the review section
const ReviewSection = styled.div`
  margin-top: 3rem;
  padding: 0 1rem;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ReviewTitle = styled.h2`
  font-size: 1.75rem;
  color: #1f2937;
  margin: 0;
`;

const ReviewSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
`;

const AverageRating = styled.div`
  text-align: center;
  padding: 0 1.5rem;
  border-right: 1px solid #e5e7eb;
`;

const RatingScore = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
`;

const StarRating = styled.div`
  color: #fbbf24;
  font-size: 1.25rem;
  display: flex;
  gap: 0.1rem;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

const TotalReviews = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const SentimentSummary = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const SentimentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => 
    props.type === 'positive' ? '#d1fae5' : 
    props.type === 'negative' ? '#fee2e2' : '#e5e7eb'};
  color: ${props => 
    props.type === 'positive' ? '#065f46' : 
    props.type === 'negative' ? '#991b1b' : '#4b5563'};
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid #d1d5db;
  background: ${props => props.active ? '#f3f4f6' : 'white'};
  color: ${props => props.active ? '#1f2937' : '#6b7280'};
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
  }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('all');
  const { addItem } = useCart();
  
  const runAiTask = async (endpoint, data) => {
    setAiLoading(true);
    try {
      const response = await api.post(`/ai/${endpoint}`, data);
      toast.success(`${endpoint.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} completed`);
      setProduct(prev => ({
        ...prev,
        [endpoint === 'sentiment-analysis' ? 'sentiment' : endpoint]: response.data
      }));
      return response.data;
    } catch (e) {
      toast.error(`${endpoint.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} failed`);
      throw e;
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || id === 'undefined') {
        setError('Invalid product ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching product with ID:', id);
        
        // Make the API call
        const response = await api.get(`/products/${id}`);
        console.log('API Response:', response);
        
        // The product data is directly in the response data
        const productData = response.data;
        
        if (!productData) {
          throw new Error('No product data received');
        }
        
        // Transform the data to match the expected structure
        const formattedProduct = {
          // Handle both _id and id
          id: productData._id || productData.id,
          _id: productData._id || productData.id,
          reviews: productData.reviews || [],
          
          // Basic info
          name: productData.name || productData.title || 'Unnamed Product',
          description: productData.description || 'No description available',
          
          // Handle price which might be an object or number
          price: productData.price ? 
                 (typeof productData.price === 'object' ? 
                   parseFloat(productData.price.$numberInt || 0) : 
                   parseFloat(productData.price)) : 
                 0,
                  
          // Handle images (could be array or single image)
          images: Array.isArray(productData.images) ? 
                  productData.images : 
                  (productData.image ? [productData.image] : []),
                  
          // Stock/availability
          inStock: (productData.inventory?.stock || productData.stock || 0) > 0,
          stock: productData.inventory?.stock || productData.stock || 0,
          
          // Additional details
          category: productData.category || 'Uncategorized',
          material: productData.material || 'Not specified',
          dimensions: productData.dimensions || 'Not specified',
          weight: productData.weight || 'Not specified',
          
          // Include any additional fields from the API
          ...productData
        };
        
        console.log('Formatted product:', formattedProduct);
        setProduct(formattedProduct);
        setReviews(formattedProduct.reviews);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    // Check if the ID is valid before fetching
    if (id && id !== 'undefined') {
      fetchProduct();
    } else {
      console.error('Attempted to load product with an invalid or missing ID.');
      setError('Invalid product ID in the URL. Please go back and try a different link.');
      setLoading(false);
    }
  }, [id]);

  const runDemandForecast = async () => {
    try {
      await runAiTask('demand-forecast', { productId: id });
    } catch (e) {
      console.error('Failed to run demand forecast:', e);
    }
  };

  const runQualityCheck = async () => {
    try {
      const imageUrl = product?.images?.[0]?.url;
      await runAiTask('quality-check', { productId: id, imageUrl });
    } catch (e) {
      console.error('Failed to run quality check:', e);
    }
  };

  const runSentiment = async () => {
    try {
      const text = prompt('Enter customer feedback text to analyze:');
      if (!text) return;
      const result = await runAiTask('sentiment-analysis', { text, productId: id });
      toast.success(`Sentiment: ${result.sentiment}`);
    } catch (e) {
      console.error('Failed to analyze sentiment:', e);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading product details...</div>;
  
  // Use the error state to show the error page, matching the screenshot
  if (error) return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Error Loading Product</h2>
      <p>We're having trouble loading this product. Please try again later. ({error})</p>
      <button 
        onClick={() => window.history.back()} 
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Go Back
      </button>
    </div>
  );

  return (
    <>
    <ProductDetailContainer>
      <ProductDetailContent>
        <ProductImage>
          {(() => {
            // Debug log to see the actual images data
            console.log('Product images:', product.images);
            
            // Get the first image URL
            let imageUrl = '';
            
            if (Array.isArray(product.images) && product.images.length > 0) {
              // If images is an array of URLs (strings)
              imageUrl = product.images[0];
            } else if (product.images && typeof product.images === 'string') {
              // If images is a direct string URL
              imageUrl = product.images;
            } else if (product.images && product.images.url) {
              // If images is an object with a url property
              imageUrl = product.images.url;
            }
            
            console.log('Using image URL:', imageUrl);
            
            return (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                padding: '2rem',
                minHeight: '400px'
              }}>
                {imageUrl ? (
                  <img 
                    src={imageUrl}
                    alt={product.name || 'Product image'}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/500x500?text=No+Image+Available';
                    }}
                    style={{ 
                      maxWidth: '100%',
                      maxHeight: '400px',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      borderRadius: '8px'
                    }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: '#64748b' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
                    <p>No image available</p>
                  </div>
                )}
              </div>
            );
          })()}
        </ProductImage>
        <ProductInfo>
          <h1>{product.name || 'Product Name'}</h1>
          <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '2rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar 
                  key={star} 
                  color={star <= Math.round(product.rating?.average || 0) ? '#FFD700' : '#e4e5e9'} 
                  style={{ marginRight: 4 }} 
                />
              ))}
              <span style={{ marginLeft: '0.5rem', color: '#64748b' }}>
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>
            {product.inStock ? (
              <span style={{ color: '#10b981', fontWeight: 500 }}>In Stock</span>
            ) : (
              <span style={{ color: '#ef4444', fontWeight: 500 }}>Out of Stock</span>
            )}
          </div>
          
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0 1.5rem' }}>
            ₹{product.price?.toLocaleString('en-IN') || '0'}
          </div>
          
          {product.category && (
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ color: '#64748b' }}>Category: </span>
              <span style={{ fontWeight: 500 }}>{product.category}</span>
            </div>
          )}
          
          {product.material && (
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ color: '#64748b' }}>Material: </span>
              <span>{product.material}</span>
            </div>
          )}
          
          <div style={{ margin: '1.5rem 0' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Description</h3>
            <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
              {product.description || 'No description available for this product.'}
            </p>
          </div>
          
          <AddToCartButton 
            onClick={() => {
              addItem({ 
                id, 
                name: product.name, 
                price: product.price, 
                image: product.images?.[0]?.url, 
                quantity: 1 
              });
              toast.success(`${product.name} added to cart`);
            }}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </AddToCartButton>
          
          {/* Additional product details */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <h3>Product Details</h3>
            <p><strong>Material:</strong> {product.material || 'Not specified'}</p>
            
            {product.dimensions && (
              <p>
                <strong>Dimensions:</strong> 
                {typeof product.dimensions === 'string' ? (
                  product.dimensions
                ) : (
                  <>
                    {product.dimensions.length && `L: ${product.dimensions.length} `}
                    {product.dimensions.width && `W: ${product.dimensions.width} `}
                    {product.dimensions.height && `H: ${product.dimensions.height} `}
                    {product.dimensions.unit && `(${product.dimensions.unit})`}
                    {!product.dimensions.length && !product.dimensions.width && 
                      !product.dimensions.height && product.dimensions.description && 
                      product.dimensions.description}
                  </>
                )}
              </p>
            )}
            
            {(product.dimensions?.weight || product.weight) && (
              <p><strong>Weight:</strong> {product.dimensions?.weight || product.weight} {product.dimensions?.unit || 'g'}</p>
            )}
          </div>
          
          {/* AI Features (conditionally rendered) */}
          {(product.demandForecast || product.qualityCheck) && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f9f9f9', borderRadius: '6px' }}>
              {product.demandForecast?.predictedDemand && (
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Demand Forecast:</strong> {product.demandForecast.predictedDemand} units
                  <span style={{ color: '#6b7280', fontSize: '0.9em', marginLeft: '0.5rem' }}>
                    ({Math.round((product.demandForecast.confidence || 0) * 100)}% confidence)
                  </span>
                </p>
              )}
              
              {product.qualityCheck?.score && (
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Quality Score:</strong> {product.qualityCheck.score}/100
                  <span style={{ 
                    color: product.qualityCheck.isApproved ? '#16a34a' : '#ef4444',
                    marginLeft: '0.5rem'
                  }}>
                    ({product.qualityCheck.isApproved ? 'Approved' : 'Needs Improvement'})
                  </span>
                </p>
              )}
            </div>
          )}
      </ProductInfo>
    </ProductDetailContent>
    
    <ReviewSection>
      <ReviewHeader>
        <ReviewTitle>Customer Reviews</ReviewTitle>
      </ReviewHeader>
      
      {/* Review Summary */}
      {reviews.length > 0 && (
        <>
          <ReviewSummary>
            <AverageRating>
              <RatingScore>
                {reviews.length > 0 
                  ? (reviews.reduce((sum, review) => sum + (review.rating || 3), 0) / reviews.length).toFixed(1)
                  : '0.0'}
              </RatingScore>
              <StarRating>
                {[1, 2, 3, 4, 5].map((star) => {
                  const avgRating = reviews.reduce((sum, review) => sum + (review.rating || 3), 0) / reviews.length;
                  return (
                    <span key={star}>
                      {star <= Math.floor(avgRating) ? (
                        <FaStar />
                      ) : star - 0.5 <= avgRating ? (
                        <FaStarHalfAlt />
                      ) : (
                        <FaRegStar />
                      )}
                    </span>
                  );
                })}
              </StarRating>
              <TotalReviews>{reviews.length} reviews</TotalReviews>
            </AverageRating>
            
            <SentimentSummary>
              <SentimentItem type="positive">
                <span>😊</span>
                <span>
                  {reviews.filter(r => r.sentiment === 'positive').length} Positive
                </span>
              </SentimentItem>
              <SentimentItem type="neutral">
                <span>😐</span>
                <span>
                  {reviews.filter(r => r.sentiment === 'neutral').length} Neutral
                </span>
              </SentimentItem>
              <SentimentItem type="negative">
                <span>😟</span>
                <span>
                  {reviews.filter(r => r.sentiment === 'negative').length} Negative
                </span>
              </SentimentItem>
            </SentimentSummary>
          </ReviewSummary>
          
          {/* Filter Buttons */}
          <FilterButtons>
            <FilterButton 
              onClick={() => setFilter('all')} 
              active={filter === 'all'}
            >
              <FaFilter /> All Reviews
            </FilterButton>
            <FilterButton 
              onClick={() => setFilter('positive')} 
              active={filter === 'positive'}
            >
              😊 Positive
            </FilterButton>
            <FilterButton 
              onClick={() => setFilter('neutral')} 
              active={filter === 'neutral'}
            >
              😐 Neutral
            </FilterButton>
            <FilterButton 
              onClick={() => setFilter('negative')} 
              active={filter === 'negative'}
            >
              😟 Negative
            </FilterButton>
          </FilterButtons>
        </>
      )}
      
      {/* Add Review Form */}
      <AddReview 
        productId={product.id} 
        onReviewAdded={(newReview) => {
          setReviews([...reviews, newReview]);
          toast.success('Thank you for your review!');
        }} 
      />
      
      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div style={{ marginTop: '1rem' }}>
          {reviews
            .filter(review => filter === 'all' || review.sentiment === filter)
            .map((review, index) => (
              <ProductReview 
                key={index} 
                review={review} 
                productId={product.id} 
              />
            ))}
          
          {reviews.filter(review => filter === 'all' || review.sentiment === filter).length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem', 
              backgroundColor: '#f9fafb', 
              borderRadius: '0.5rem',
              marginTop: '1.5rem'
            }}>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                No {filter} reviews found.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          backgroundColor: '#f9fafb', 
          borderRadius: '0.5rem',
          marginTop: '1.5rem'
        }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}
    </ReviewSection>
      </ProductDetailContainer>
    </>
  );
};

export default ProductDetail;