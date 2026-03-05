import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSave, FiTrash2, FiArrowLeft, FiImage, FiX, FiAlertCircle, FiPackage
} from 'react-icons/fi';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%);
  padding: 2rem 0 4rem;
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.95rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  padding: 0;

  &:hover { color: #d97706; }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg { color: #d97706; }
`;

const FormCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  border: 1px solid rgba(217,119,6,0.08);
`;

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Full = styled.div`
  grid-column: 1 / -1;
`;

const FieldGroup = styled.div`
  label {
    display: block;
    font-weight: 600;
    color: #374151;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #1f2937;
  transition: border-color 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #d97706;
    box-shadow: 0 0 0 3px rgba(217,119,6,0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #1f2937;
  background: white;
  cursor: pointer;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #d97706;
    box-shadow: 0 0 0 3px rgba(217,119,6,0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #1f2937;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #d97706;
    box-shadow: 0 0 0 3px rgba(217,119,6,0.1);
  }
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-top: 0.5rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    color: #374151;
    font-size: 0.9rem;
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #d97706;
    cursor: pointer;
  }
`;

const ImagesSection = styled.div`
  margin-top: 0.5rem;
`;

const ImagesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const ImageThumb = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #e5e7eb;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .remove-btn {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(220,38,38,0.9);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover .remove-btn { opacity: 1; }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
`;

const SaveButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem 1.5rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(217,119,6,0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(217,119,6,0.4);
  }

  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem 1.5rem;
  background: #fef2f2;
  color: #dc2626;
  border: 2px solid #fecaca;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #dc2626;
    color: white;
    border-color: #dc2626;
  }
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #6b7280;

  .spinner-lg {
    width: 40px;
    height: 40px;
    border: 3px solid #fde68a;
    border-top-color: #d97706;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
    margin: 0 auto 1rem;
  }
`;

/* ── Delete Modal ── */
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalBox = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
`;

const ModalIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #fef2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #dc2626;
  font-size: 1.5rem;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const ModalBtn = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.95rem;

  &.cancel {
    background: #f3f4f6;
    color: #374151;
    &:hover { background: #e5e7eb; }
  }

  &.delete {
    background: #dc2626;
    color: white;
    &:hover { background: #b91c1c; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
`;

const CATEGORIES = [
  'pottery', 'textiles', 'jewelry', 'woodwork', 'metalwork',
  'paintings', 'sculptures', 'basketry', 'leatherwork', 'other'
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    tags: '',
    isActive: true,
    isFeatured: false,
  });
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const product = res.data;

        setForm({
          name: product.name || '',
          price: product.price || '',
          category: product.category || '',
          description: product.description || '',
          tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
          isActive: product.isActive !== false,
          isFeatured: product.isFeatured || false,
        });

        // Normalize images
        const imgs = (product.images || []).map(img => {
          if (typeof img === 'object' && img.url) return img;
          if (typeof img === 'string') return { url: img, alt: product.name };
          return null;
        }).filter(Boolean);
        setExistingImages(imgs);
      } catch (err) {
        toast.error('Failed to load product');
        navigate('/artisan/my-products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const removeImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      toast.error('Name, price, and category are required');
      return;
    }

    try {
      setSaving(true);
      const updateData = {
        name: form.name,
        price: Number(form.price),
        category: form.category,
        description: form.description,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        images: existingImages,
      };

      await api.put(`/products/${id}`, updateData);
      toast.success('Product updated successfully!');
      navigate('/artisan/my-products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/products/${id}`);
      toast.success('Product deleted successfully');
      navigate('/artisan/my-products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Content>
          <LoadingState>
            <div className="spinner-lg" />
            <p>Loading product details...</p>
          </LoadingState>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <BackLink onClick={() => navigate('/artisan/my-products')}>
          <FiArrowLeft size={18} /> Back to My Products
        </BackLink>

        <PageTitle><FiPackage /> Edit Product</PageTitle>

        <FormCard>
          <FormGrid onSubmit={handleSubmit}>
            <Full>
              <FieldGroup>
                <label>Product Name</label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </FieldGroup>
            </Full>

            <FieldGroup>
              <label>Price (INR)</label>
              <Input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 1299"
                required
              />
            </FieldGroup>

            <FieldGroup>
              <label>Category</label>
              <Select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </Select>
            </FieldGroup>

            <Full>
              <FieldGroup>
                <label>Description</label>
                <TextArea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your product..."
                />
              </FieldGroup>
            </Full>

            <Full>
              <FieldGroup>
                <label>Tags (comma separated)</label>
                <Input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="e.g. handmade, traditional, clay"
                />
              </FieldGroup>
            </Full>

            <Full>
              <FieldGroup>
                <label><FiImage style={{ verticalAlign: 'middle', marginRight: 6 }} /> Current Images</label>
                <ImagesSection>
                  {existingImages.length > 0 ? (
                    <ImagesGrid>
                      {existingImages.map((img, i) => (
                        <ImageThumb key={i}>
                          <img src={img.url} alt={img.alt || 'Product'} />
                          <button
                            type="button"
                            className="remove-btn"
                            onClick={() => removeImage(i)}
                            title="Remove image"
                          >
                            <FiX />
                          </button>
                        </ImageThumb>
                      ))}
                    </ImagesGrid>
                  ) : (
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No images</p>
                  )}
                </ImagesSection>
              </FieldGroup>
            </Full>

            <Full>
              <CheckboxRow>
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                  />
                  Active (visible to buyers)
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                  />
                  Featured
                </label>
              </CheckboxRow>
            </Full>

            <Full>
              <ButtonRow>
                <SaveButton type="submit" disabled={saving}>
                  {saving ? <Spinner /> : <FiSave size={18} />}
                  {saving ? 'Saving…' : 'Save Changes'}
                </SaveButton>
                <DeleteButton type="button" onClick={() => setShowDeleteModal(true)}>
                  <FiTrash2 size={18} /> Delete
                </DeleteButton>
              </ButtonRow>
            </Full>
          </FormGrid>
        </FormCard>
      </Content>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !deleting && setShowDeleteModal(false)}
          >
            <ModalBox
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <ModalIcon><FiAlertCircle /></ModalIcon>
              <h3 style={{ margin: '0 0 0.5rem', color: '#1f2937' }}>Delete Product?</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>
                Are you sure you want to delete <strong>"{form.name}"</strong>?
                This action cannot be undone.
              </p>
              <ModalActions>
                <ModalBtn
                  className="cancel"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                >
                  Cancel
                </ModalBtn>
                <ModalBtn className="delete" onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Deleting…' : 'Delete'}
                </ModalBtn>
              </ModalActions>
            </ModalBox>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default EditProduct;
