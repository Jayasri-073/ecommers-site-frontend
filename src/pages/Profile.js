import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi } from '../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUserInContext } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
    password: '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        username: formData.username,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      };
      if (formData.password) payload.password = formData.password;

      const res = await updateProfileApi(payload);
      updateUserInContext(res.data.user);
      toast.success('Profile updated successfully');
      setFormData({ ...formData, password: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '600px' }}>
      <div className="card shadow-sm p-4">
        <h3 className="mb-4">My Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={user?.email} disabled />
          </div>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <h6 className="mt-4">Address</h6>
          <div className="mb-3">
            <label className="form-label">Street</label>
            <input type="text" name="street" className="form-control" value={formData.street} onChange={handleChange} />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">City</label>
              <input type="text" name="city" className="form-control" value={formData.city} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">State</label>
              <input type="text" name="state" className="form-control" value={formData.state} onChange={handleChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Zip Code</label>
              <input type="text" name="zipCode" className="form-control" value={formData.zipCode} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Country</label>
              <input type="text" name="country" className="form-control" value={formData.country} onChange={handleChange} />
            </div>
          </div>

          <h6 className="mt-4">Change Password</h6>
          <div className="mb-3">
            <label className="form-label">New Password (leave blank to keep current)</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn brand-btn w-100" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
