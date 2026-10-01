import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { getAllUsersApi, deleteUserApi } from '../services/api';
import AdminSidebar from './AdminSidebar';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsersApi();
      setUsers(res.data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUserApi(id);
      toast.success('User deleted');
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h3 className="mb-4">Manage Users</h3>

        <div className="card dashboard-card p-3">
          {loading ? (
            <Loader />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover admin-table align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || '-'}</td>
                      <td>
                        <span className={`badge bg-${u.role === 'admin' ? 'dark' : 'secondary'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(u._id)}
                          disabled={u._id === currentUser?._id}
                          title={u._id === currentUser?._id ? "You can't delete your own account" : 'Delete user'}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-center text-muted py-3">No users found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
