import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import { FALLBACK_BOOK_IMAGE, getBookImageUrl } from '../services/api';

const Cart = () => {
  const { cart, cartLoading, updateCartItem, removeCartItem } = useCart();
  const navigate = useNavigate();

  if (cartLoading) return <Loader />;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container my-5 text-center py-5">
        <h4>Your cart is empty</h4>
        <p className="text-muted">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/books" className="btn brand-btn mt-2">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h3 className="mb-4">Shopping Cart</h3>
      <div className="row g-4">
        <div className="col-lg-8">
          {cart.items.map((item) => {
            const book = item.book;
            const imageUrl = getBookImageUrl(book);
            return (
              <div key={item._id} className="card mb-3 shadow-sm">
                <div className="card-body d-flex gap-3 align-items-center">
                  <img
                    src={imageUrl}
                    alt={book?.title}
                    style={{ width: '70px', height: '90px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_BOOK_IMAGE;
                    }}
                  />
                  <div className="flex-grow-1">
                    <Link to={`/books/${book?._id}`} className="fw-semibold text-dark text-decoration-none">
                      {book?.title}
                    </Link>
                    <p className="text-muted small mb-1">{book?.author}</p>
                    <span className="price-tag">₹{item.price}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateCartItem(item._id, Math.max(1, item.quantity - 1))}
                    >
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateCartItem(item._id, item.quantity + 1)}
                      disabled={book && item.quantity >= book.stock}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeCartItem(item._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm p-3">
            <h5>Order Summary</h5>
            <div className="d-flex justify-content-between my-2">
              <span>Subtotal</span>
              <strong>₹{cart.totalPrice?.toFixed(2)}</strong>
            </div>
            <div className="d-flex justify-content-between mb-3 text-muted small">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-3">
              <strong>Total</strong>
              <strong className="price-tag">₹{cart.totalPrice?.toFixed(2)}</strong>
            </div>
            <button className="btn brand-btn w-100" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
