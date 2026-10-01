import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBooksApi, getCategoriesApi } from '../services/api';
import BookCard from '../components/BookCard';
import CategoryFilter from '../components/CategoryFilter';
import Loader from '../components/Loader';

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page')) || 1;

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getBooksApi({ search, category, sort, page, limit: 12 });
      const payload = res?.data ?? {};
      const nextBooks = Array.isArray(payload.books)
        ? payload.books
        : Array.isArray(payload)
          ? payload
          : [];
      const paginationData = payload.pagination ?? {};

      setBooks(nextBooks);
      setPagination({
        page: Number(paginationData.page ?? payload.page ?? page),
        pages: Number(paginationData.pages ?? payload.pages ?? 1),
        total: Number(paginationData.total ?? payload.total ?? nextBooks.length),
      });
    } catch (error) {
      console.error('Failed to fetch books', error);
      setBooks([]);
      setPagination({ page: 1, pages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    getCategoriesApi()
      .then((res) => setCategories(Array.isArray(res?.data?.categories) ? res.data.categories : []))
      .catch(() => setCategories([]));
  }, []);

  const safeBooks = Array.isArray(books) ? books : [];

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const goToPage = (p) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', p);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container my-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h3 className="mb-0">
          {search ? `Results for "${search}"` : category !== 'All' ? category : 'All Books'}
        </h3>
        <select
          className="form-select w-auto"
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
        >
          <option value="">Sort by: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="title">Title: A-Z</option>
        </select>
      </div>

      <CategoryFilter
        categories={categories}
        selected={category}
        onSelect={(cat) => updateParam('category', cat === 'All' ? '' : cat)}
      />

      {loading ? (
        <Loader />
      ) : safeBooks.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <h5>No books found</h5>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {safeBooks.map((book) => (
              <div className="col-6 col-md-4 col-lg-3" key={book._id}>
                <BookCard book={book} />
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <nav className="mt-5">
              <ul className="pagination justify-content-center">
                {[...Array(pagination.pages)].map((_, idx) => (
                  <li key={idx} className={`page-item ${pagination.page === idx + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => goToPage(idx + 1)}>
                      {idx + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default Books;
