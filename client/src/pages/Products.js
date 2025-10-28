import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import styled from 'styled-components';
import api from '../lib/api';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-hot-toast';

const ProductsContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const ProductsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.125rem;
    color: #6b7280;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #d97706;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #d97706;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #9ca3af;
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #d97706;
  margin-bottom: 1rem;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(135deg, #d97706, #b45309);
    color: white;

    &:hover {
      background: linear-gradient(135deg, #b45309, #92400e);
    }
  }

  &.secondary {
    background: #f3f4f6;
    color: #374151;

    &:hover {
      background: #e5e7eb;
    }
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem 0;
  color: #6b7280;
  font-size: 1.125rem;
`;

const Products = () => {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sort: 'newest',
    search: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: 1,
          limit: 12,
          category: filters.category || undefined,
          search: filters.search || undefined,
          sortBy: filters.sort === 'newest' ? 'createdAt' : undefined,
          sortOrder: 'desc',
        };
        console.log('Fetching products with params:', params);
        const { data } = await api.get('/products', { params });
        console.log('Raw API response:', data);
        
        const normalized = (data.products || []).map(p => {
          console.log('Raw product data:', p);
          console.log('Product images:', p.images);
          
          // Fix the images array if it's a string split into characters
          let fixedImages = [];
          if (Array.isArray(p.images) && p.images.length > 0) {
            // Check if the first item is an object with a url property
            if (p.images[0].url) {
              fixedImages = p.images.map(img => img.url);
            } 
            // Check if the first item is an object that's actually a string split into characters
            else if (p.images[0]['0'] === 'h' && p.images[0]['1'] === 't' && p.images[0]['2'] === 't') {
              // Reconstruct the URL from the character map
              const urlObj = p.images[0];
              const urlLength = Object.keys(urlObj).filter(key => !isNaN(parseInt(key))).length;
              let url = '';
              for (let i = 0; i < urlLength; i++) {
                url += urlObj[i];
              }
              fixedImages = [url];
            }
            // If it's already a proper array of URLs
            else if (typeof p.images[0] === 'string') {
              fixedImages = [...p.images];
            }
          }
          
          console.log('Fixed images array:', fixedImages);
          
          return {
            id: p._id,
            name: p.name,
            price: `₹${p.price?.toLocaleString?.('en-IN') || p.price}`,
            image: fixedImages[0] || '🧶',
            images: fixedImages
          };
        });
        
        console.log('Normalized products:', normalized);
        setProducts(normalized);
      } catch (e) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setSearchParams({ ...filters, [key]: value });
  };

  return (
    <ProductsContainer>
      <ProductsContent>
        <PageHeader>
          <h1>{t('products.title')}</h1>
          <p>Discover authentic Indian handicrafts from skilled artisans</p>
        </PageHeader>

        <FiltersContainer>
          <SearchInput
            type="text"
            placeholder={t('products.search')}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          
          <FilterSelect
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="pottery">Pottery</option>
            <option value="textiles">Textiles</option>
            <option value="jewelry">Jewelry</option>
            <option value="woodwork">Woodwork</option>
            <option value="metalwork">Metalwork</option>
            <option value="paintings">Paintings</option>
            <option value="sculptures">Sculptures</option>
            <option value="basketry">Basketry</option>
            <option value="leatherwork">Leatherwork</option>
          </FilterSelect>

          <FilterSelect
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </FilterSelect>
        </FiltersContainer>

        {loading ? (
          <LoadingMessage>Loading products...</LoadingMessage>
        ) : (
          <ProductsGrid>
            {products.map(product => (
              <ProductCard key={product.id}>
                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ProductImage>
                    {console.log('Rendering product card:', product.id, 'with images:', product.images)}
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]}
                        alt={product.name || 'Product'}
                        onError={(e) => {
                          console.log('Image failed to load, falling back to placeholder');
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                        }}
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f8f9fa',
                        fontSize: '2rem',
                        color: '#6b7280'
                      }}>
                        No Image
                      </div>
                    )}
                  </ProductImage>
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>{product.price}</ProductPrice>
                  </ProductInfo>
                </Link>
                <ProductActions>
                  <ActionButton 
                    className="primary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem({ 
                        id: product.id, 
                        name: product.name, 
                        price: product.price, 
                        image: product.image, 
                        quantity: 1 
                      });
                      toast.success(`${product.name} added to cart`);
                    }}
                  >
                    Add to Cart
                  </ActionButton>
                  <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                    <ActionButton className="secondary">View Details</ActionButton>
                  </Link>
                </ProductActions>
              </ProductCard>
            ))}
          </ProductsGrid>
        )}
      </ProductsContent>
    </ProductsContainer>
  );
};

export default Products;
