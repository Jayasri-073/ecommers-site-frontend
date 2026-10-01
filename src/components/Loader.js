import React from 'react';

const Loader = ({ small = false }) => {
  if (small) {
    return (
      <div className="spinner-border spinner-border-sm text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  return (
    <div className="loader-wrapper">
      <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
