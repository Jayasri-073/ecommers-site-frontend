import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaBookOpen } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row gy-4">
          <div className="col-md-4">
            <h5 className="text-white d-flex align-items-center gap-2">
              <FaBookOpen /> BookStore
            </h5>
            <p className="small">
              Your one-stop online bookshop for the latest bestsellers, timeless classics
              and everything in between.
            </p>
            <div className="d-flex gap-3 fs-5">
              <a href="#!"><FaFacebook /></a>
              <a href="#!"><FaTwitter /></a>
              <a href="#!"><FaInstagram /></a>
            </div>
          </div>

          <div className="col-md-2">
            <h6 className="text-white">Shop</h6>
            <ul className="list-unstyled small">
              <li><Link to="/books">All Books</Link></li>
              <li><Link to="/books?category=Fiction">Fiction</Link></li>
              <li><Link to="/books?category=Technology">Technology</Link></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6 className="text-white">Account</h6>
            <ul className="list-unstyled small">
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/orders">Order History</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6 className="text-white">Contact</h6>
            <ul className="list-unstyled small">
              <li>Email: support@bookstore.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Mon - Sat, 9am - 6pm</li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary mt-4" />
        <p className="text-center small mb-0">
          &copy; {new Date().getFullYear()} BookStore. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
