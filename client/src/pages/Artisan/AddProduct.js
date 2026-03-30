import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiImage, FiX, FiUploadCloud, FiBox } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

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

const UploadZone = styled.div`
  border: 2px dashed ${p => p.$hasFiles ? '#d97706' : '#e5e7eb'};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${p => p.$hasFiles ? 'rgba(217,119,6,0.03)' : '#fafafa'};

  &:hover {
    border-color: #d97706;
    background: rgba(217,119,6,0.03);
  }

  input { display: none; }

  .icon {
    color: ${p => p.$hasFiles ? '#d97706' : '#9ca3af'};
    margin-bottom: 0.5rem;
  }

  .label {
    font-weight: 600;
    color: #374151;
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
  }

  .hint {
    color: #9ca3af;
    font-size: 0.8rem;
  }
`;

const PreviewGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const PreviewThumb = styled.div`
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

const SubmitButton = styled.button`
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

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem 1.5rem;
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e5e7eb;
    border-color: #d1d5db;
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

const CATEGORIES = [
  'pottery', 'textiles', 'jewelry', 'woodwork', 'metalwork',
  'paintings', 'sculptures', 'basketry', 'leatherwork', 'other'
];

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    tags: '',
    isActive: true,
    isFeatured: false,
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [modelFile, setModelFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    setFiles(prev => [...prev, ...selected]);

    // Generate previews
    selected.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews(prev => [...prev, { name: file.name, url: ev.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onModelSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.glb')) {
        toast.error('Please upload a .glb file');
        return;
      }
      setModelFile(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      toast.error('Name, price, and category are required');
      return;
    }
    if (files.length === 0) {
      toast.error('Please add at least one image');
      return;
    }
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('price', Number(form.price));
      fd.append('category', form.category);
      if (form.description) fd.append('description', form.description);
      if (form.tags) fd.append('tags', form.tags);
      fd.append('isActive', form.isActive);
      fd.append('isFeatured', form.isFeatured);
      files.forEach((f) => fd.append('images', f));
      if (modelFile) fd.append('model3d', modelFile);

      await api.post('/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Product created successfully!');
      navigate('/artisan/my-products');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create product';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <BackLink onClick={() => navigate('/artisan/my-products')}>
          <FiArrowLeft size={18} /> Back to My Products
        </BackLink>

        <PageTitle><FiPlus /> Add New Product</PageTitle>

        <FormCard>
          <FormGrid onSubmit={onSubmit}>
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
                  placeholder="Describe your product — materials, techniques, dimensions..."
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
                <label><FiBox style={{ verticalAlign: 'middle', marginRight: 6 }} /> 3D Model (.glb) - Optional</label>
                <UploadZone
                  $hasFiles={!!modelFile}
                  onClick={() => document.getElementById('model-input').click()}
                >
                  <input
                    id="model-input"
                    type="file"
                    accept=".glb"
                    onChange={onModelSelect}
                  />
                  <div className="icon"><FiBox size={32} /></div>
                  <div className="label">
                    {modelFile
                      ? modelFile.name
                      : 'Click to upload 3D model'}
                  </div>
                  <div className="hint">GLB format only. Max 25MB.</div>
                </UploadZone>
              </FieldGroup>
            </Full>

            <Full>
              <FieldGroup>
                <label><FiImage style={{ verticalAlign: 'middle', marginRight: 6 }} /> Product Images</label>
                <UploadZone
                  $hasFiles={files.length > 0}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onFileSelect}
                  />
                  <div className="icon"><FiUploadCloud size={32} /></div>
                  <div className="label">
                    {files.length > 0
                      ? `${files.length} image${files.length > 1 ? 's' : ''} selected`
                      : 'Click to upload images'}
                  </div>
                  <div className="hint">PNG, JPG, WEBP up to 10MB each</div>
                </UploadZone>

                {previews.length > 0 && (
                  <PreviewGrid>
                    {previews.map((preview, i) => (
                      <PreviewThumb key={i}>
                        <img src={preview.url} alt={preview.name} />
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                          title="Remove image"
                        >
                          <FiX />
                        </button>
                      </PreviewThumb>
                    ))}
                  </PreviewGrid>
                )}
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
                <SubmitButton type="submit" disabled={loading}>
                  {loading ? <Spinner /> : <FiPlus size={18} />}
                  {loading ? 'Creating…' : 'Create Product'}
                </SubmitButton>
                <CancelButton type="button" onClick={() => navigate('/artisan/my-products')}>
                  Cancel
                </CancelButton>
              </ButtonRow>
            </Full>
          </FormGrid>
        </FormCard>
      </Content>
    </Container>
  );
};

export default AddProduct;
