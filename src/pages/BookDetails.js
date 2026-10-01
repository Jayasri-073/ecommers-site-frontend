import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FALLBACK_BOOK_IMAGE, getBookByIdApi, getBookImageUrl, addBookReviewApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const res = await getBookByIdApi(id);
      setBook(res.data.book);
    } catch (error) {
      toast.error('Book not found');
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(book._id, quantity);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingReview(true);
      await addBookReviewApi(id, reviewForm);
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      fetchBook();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader />;
  if (!book) return null;

  const imageUrl = getBookImageUrl(book);
  const hasReviewed = book.reviews?.some((r) => r.user === user?._id);

  return (
    <div className="container my-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/books">Books</Link></li>
          <li className="breadcrumb-item active">{book.title}</li>
        </ol>
      </nav>

      <div className="row g-5">
        <div className="col-md-4">
          <img
            src={imageUrl}
            alt={book.title}
            className="img-fluid rounded shadow-sm w-100 book-cover"
            style={{ height: '420px' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_BOOK_IMAGE;
            }}
          />
        </div>

        <div className="col-md-8">
          <h2>{book.title}</h2>
          <p className="text-muted">by <strong>{book.author}</strong></p>

          <div className="rating-stars mb-2">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} color={i < Math.round(book.rating) ? '#ffa41c' : '#e0e0e0'} />
            ))}
            <span className="text-muted ms-2">
              {book.rating?.toFixed(1)} ({book.numReviews} reviews)
            </span>
          </div>

          <h3 className="price-tag">₹{book.price}</h3>

          <p className="mt-3">{book.description}</p>

          <table className="table table-sm w-auto">
            <tbody>
              <tr><th>Category</th><td>{book.category}</td></tr>
              <tr><th>Publisher</th><td>{book.publisher || 'N/A'}</td></tr>
              <tr><th>Language</th><td>{book.language}</td></tr>
              <tr><th>ISBN</th><td>{book.isbn || 'N/A'}</td></tr>
              <tr>
                <th>Availability</th>
                <td>{book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}</td>
              </tr>
            </tbody>
          </table>

          <div className="d-flex align-items-center gap-3 mt-3">
            <input
              type="number"
              min="1"
              max={book.stock}
              className="form-control"
              style={{ width: '90px' }}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              disabled={book.stock === 0}
            />
            <button
              className="btn brand-btn d-flex align-items-center gap-2"
              onClick={handleAddToCart}
              disabled={book.stock === 0}
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-5">
        <h4>Customer Reviews</h4>
        {book.reviews?.length === 0 && <p className="text-muted">No reviews yet. Be the first to review!</p>}

        {book.reviews?.map((review, idx) => (
          <div key={idx} className="border-bottom py-3">
            <div className="d-flex justify-content-between">
              <strong>{review.name}</strong>
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < review.rating ? '#ffa41c' : '#e0e0e0'} />
                ))}
              </div>
            </div>
            <p className="mb-0 text-muted small">{review.comment}</p>
          </div>
        ))}

        {isAuthenticated && !hasReviewed && (
          <form className="mt-4" onSubmit={handleReviewSubmit}>
            <h6>Write a Review</h6>
            <div className="mb-2">
              <select
                className="form-select w-auto"
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <textarea
              className="form-control mb-2"
              rows="3"
              placeholder="Share your thoughts about this book..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              required
            />
            <button className="btn btn-primary" type="submit" disabled={submittingReview}>
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
