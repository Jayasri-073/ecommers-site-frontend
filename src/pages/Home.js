import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBooksApi, getCategoriesApi } from '../services/api';
import BookCard from '../components/BookCard';
import Loader from '../components/Loader';
import { FaBookReader, FaTruck, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [booksRes, catRes] = await Promise.all([
          getBooksApi({ sort: 'rating', limit: 8 }),
          getCategoriesApi(),
        ]);
        setFeaturedBooks(booksRes.data.books || []);
        setCategories(catRes.data.categories || []);
      } catch (error) {
        console.error('Failed to load home page data', error);
        setFeaturedBooks([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div>
      <div className="container pt-4">
        <p className="mb-0 text-uppercase fw-semibold text-primary">Home</p>
      </div>
      {/* Hero Banner */}
      <div className="hero-banner text-center">
        <div className="container">
          <h1 className="display-5 fw-bold">Discover Your Next Favorite Book</h1>
          <p className="lead mt-3">
            Thousands of titles across every genre - delivered right to your door.
          </p>
          <Link to="/books" className="btn brand-btn btn-lg mt-3 px-4">
            Shop Now
          </Link>
        </div>
      </div>

      <div className="container my-5">
        {/* Feature Highlights */}
        <div className="row text-center g-4 mb-5">
          <div className="col-md-4">
            <FaBookReader size={32} className="mb-2 text-primary" />
            <h6>Huge Collection</h6>
            <p className="small text-muted">Curated books across every category imaginable.</p>
          </div>
          <div className="col-md-4">
            <FaTruck size={32} className="mb-2 text-primary" />
            <h6>Fast Delivery</h6>
            <p className="small text-muted">Get your books delivered quickly and safely.</p>
          </div>
          <div className="col-md-4">
            <FaShieldAlt size={32} className="mb-2 text-primary" />
            <h6>Secure Checkout</h6>
            <p className="small text-muted">Your data and payments are always protected.</p>
          </div>
        </div>

        {/* Categories */}
        {Array.isArray(categories) && categories.length > 0 && (
          <div className="mb-5">
            <h4 className="mb-3">Browse Categories</h4>
            <div className="d-flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link key={cat} to={`/books?category=${encodeURIComponent(cat)}`} className="category-pill">
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Featured Books */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Top Rated Books</h4>
          <Link to="/books" className="small">View all &rarr;</Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="row g-4">
            {featuredBooks.map((book) => (
              <div className="col-6 col-md-4 col-lg-3" key={book._id}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
