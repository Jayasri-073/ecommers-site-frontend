import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { getBooksApi, deleteBookApi } from '../services/api';
import AdminSidebar from './AdminSidebar';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import './Dashboard.css';

const ViewBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await getBooksApi({ search, limit: 100 });
      setBooks(res.data.books);
    } catch (error) {
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await deleteBookApi(id);
      toast.success('Book deleted');
      setBooks(books.filter((b) => b._id !== id));
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">Manage Books</h3>
          <Link to="/admin/books/add" className="btn brand-btn d-flex align-items-center gap-2">
            <FaPlus /> Add Book
          </Link>
        </div>

        <form className="mb-3 d-flex gap-2" style={{ maxWidth: '400px' }} onSubmit={handleSearch}>
          <input
            type="text"
            className="form-control"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-outline-secondary" type="submit">Search</button>
        </form>

        <div className="card dashboard-card p-3">
          {loading ? (
            <Loader />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover admin-table align-middle">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book._id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.category}</td>
                      <td>₹{book.price}</td>
                      <td>
                        <span className={`badge bg-${book.stock > 0 ? 'success' : 'danger'}`}>
                          {book.stock}
                        </span>
                      </td>
                      <td>{book.rating?.toFixed(1) || 0}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link to={`/admin/books/edit/${book._id}`} className="btn btn-sm btn-outline-primary">
                            <FaEdit />
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(book._id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {books.length === 0 && <p className="text-center text-muted py-3">No books found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBooks;
