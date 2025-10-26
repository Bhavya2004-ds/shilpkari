import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

const AddProductContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const AddProductContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
`;

const Full = styled.div`
  grid-column: 1 / -1;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  min-height: 120px;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Submit = styled.button`
  padding: 0.9rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
`;

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onFile = (e) => {
    setFiles(Array.from(e.target.files || []));
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
      if (form.tags) {
        // server expects tags array; send as comma-separated, server will accept string too
        fd.append('tags', form.tags);
      }
      fd.append('isActive', form.isActive);
      fd.append('isFeatured', form.isFeatured);
      files.forEach((f) => fd.append('images', f));

      await api.post('/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Product created');
      navigate('/products');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create product';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddProductContainer>
      <AddProductContent>
        <h1 style={{ marginBottom: '1rem' }}>Add Product</h1>
        <Form onSubmit={onSubmit}>
          <Full>
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </Full>
          <div>
            <Label>Price (INR)</Label>
            <Input name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
          </div>
          <div>
            <Label>Category</Label>
            <Input name="category" value={form.category} onChange={handleChange} placeholder="e.g. pottery" required />
          </div>
          <Full>
            <Label>Description</Label>
            <TextArea name="description" value={form.description} onChange={handleChange} />
          </Full>
          <Full>
            <Label>Tags (comma separated)</Label>
            <Input name="tags" value={form.tags} onChange={handleChange} placeholder="handmade, clay" />
          </Full>
          <Full>
            <Label>Images</Label>
            <Input type="file" accept="image/*" multiple onChange={onFile} />
          </Full>
          <CheckboxRow>
            <label><input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} /> Active</label>
            <label><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} /> Featured</label>
          </CheckboxRow>
          <Full>
            <Submit type="submit" disabled={loading}>{loading ? 'Saving…' : 'Create Product'}</Submit>
          </Full>
        </Form>
      </AddProductContent>
    </AddProductContainer>
  );
};

export default AddProduct;
