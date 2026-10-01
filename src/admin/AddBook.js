import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBookApi } from '../services/api';
import AdminSidebar from './AdminSidebar';
import { toast } from 'react-toastify';
import './Dashboard.css';

const AddBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    publisher: '',
    language: 'English',
    isbn: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (imageFile) data.append('image', imageFile);

      await createBookApi(data);
      toast.success('Book added successfully!');
      navigate('/admin/books');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add book');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h3 className="mb-4">Add New Book</h3>
        <div className="card dashboard-card admin-form-card p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Title *</label>
                <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Author *</label>
                <input type="text" name="author" className="form-control" value={formData.author} onChange={handleChange} required />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Category *</label>
                <input type="text" name="category" className="form-control" value={formData.category} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Publisher</label>
                <input type="text" name="publisher" className="form-control" value={formData.publisher} onChange={handleChange} />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Description *</label>
              <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange} required />
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Price (₹) *</label>
                <input type="number" name="price" min="0" step="0.01" className="form-control" value={formData.price} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Stock *</label>
                <input type="number" name="stock" min="0" className="form-control" value={formData.stock} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Language</label>
                <input type="text" name="language" className="form-control" value={formData.language} onChange={handleChange} />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">ISBN</label>
              <input type="text" name="isbn" className="form-control" value={formData.isbn} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Cover Image</label>
              <input type="file" accept="image/*" className="form-control" onChange={handleImageChange} />
              {preview && (
                <img src={preview} alt="preview" className="mt-2 rounded" style={{ height: '120px' }} />
              )}
            </div>

            <button type="submit" className="btn brand-btn" disabled={saving}>
              {saving ? 'Adding Book...' : 'Add Book'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
