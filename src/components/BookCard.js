import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FALLBACK_BOOK_IMAGE, getBookImageUrl } from '../services/api';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const imageUrl = getBookImageUrl(book);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(book._id, 1);
  };

  return (
    <div className="card book-card shadow-sm">
      <Link to={`/books/${book._id}`}>
        <img
          src={imageUrl}
          alt={book.title}
          className="card-img-top book-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_BOOK_IMAGE;
          }}
        />
      </Link>
      <div className="card-body d-flex flex-column">
        <Link to={`/books/${book._id}`} className="text-decoration-none text-dark">
          <h6 className="card-title mb-1 text-truncate" title={book.title}>
            {book.title}
          </h6>
        </Link>
        <p className="text-muted small mb-1">{book.author}</p>
        <div className="rating-stars small mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} color={i < Math.round(book.rating) ? '#ffa41c' : '#e0e0e0'} />
          ))}
          <span className="text-muted ms-1">({book.numReviews || 0})</span>
        </div>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="price-tag">₹{book.price}</span>
          <button
            className="btn btn-sm brand-btn d-flex align-items-center gap-1"
            onClick={handleAddToCart}
            disabled={book.stock === 0}
          >
            <FaShoppingCart /> {book.stock === 0 ? 'Out of stock' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
