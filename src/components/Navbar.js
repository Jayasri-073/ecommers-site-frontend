import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBookOpen, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#131921' }}>
      <div className="container-fluid px-3 px-lg-4">
        <Link className="navbar-brand navbar-brand-custom d-flex align-items-center gap-2" to="/">
          <FaBookOpen /> BookStore
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}>
          <div className="mx-lg-4 my-2 my-lg-0 flex-grow-1">
            <SearchBar />
          </div>

          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <Link className="nav-link" to="/books" onClick={() => setExpanded(false)}>
                Books
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/dashboard" onClick={() => setExpanded(false)}>
                      <FaTachometerAlt className="me-1" /> Admin
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link position-relative" to="/cart" onClick={() => setExpanded(false)}>
                    <FaShoppingCart size={18} />
                    {cartCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center gap-1"
                    href="#!"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    <FaUser /> {user?.username?.split(' ')[0]}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profile" onClick={() => setExpanded(false)}>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/orders" onClick={() => setExpanded(false)}>
                        My Orders
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <FaSignOutAlt className="me-2" /> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={() => setExpanded(false)}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn brand-btn btn-sm ms-lg-2 mt-2 mt-lg-0"
                    to="/register"
                    onClick={() => setExpanded(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
