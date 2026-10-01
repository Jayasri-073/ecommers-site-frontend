import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBook, FaPlusCircle, FaShoppingBag, FaUsers } from 'react-icons/fa';

const AdminSidebar = () => {
  const linkClass = ({ isActive }) => (isActive ? 'active' : '');

  return (
    <div className="admin-sidebar" style={{ width: '230px' }}>
      <div className="p-3">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <FaTachometerAlt className="me-2" /> Dashboard
        </NavLink>
        <NavLink to="/admin/books" className={linkClass}>
          <FaBook className="me-2" /> View Books
        </NavLink>
        <NavLink to="/admin/books/add" className={linkClass}>
          <FaPlusCircle className="me-2" /> Add Book
        </NavLink>
        <NavLink to="/admin/orders" className={linkClass}>
          <FaShoppingBag className="me-2" /> Orders
        </NavLink>
        <NavLink to="/admin/users" className={linkClass}>
          <FaUsers className="me-2" /> Users
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
