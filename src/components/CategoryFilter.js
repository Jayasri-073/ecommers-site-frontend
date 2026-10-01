import React from 'react';

const CategoryFilter = ({ categories, selected, onSelect }) => {
  return (
    <div className="d-flex flex-wrap gap-2 mb-4">
      <span
        className={`category-pill ${selected === 'All' ? 'active' : ''}`}
        onClick={() => onSelect('All')}
      >
        All
      </span>
      {categories.map((cat) => (
        <span
          key={cat}
          className={`category-pill ${selected === cat ? 'active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </span>
      ))}
    </div>
  );
};

export default CategoryFilter;
