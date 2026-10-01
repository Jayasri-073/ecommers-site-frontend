import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/books?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form className="d-flex" onSubmit={handleSubmit} role="search">
      <input
        type="search"
        className="form-control"
        placeholder="Search by title, author or category..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn brand-btn ms-2" type="submit">
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBar;
