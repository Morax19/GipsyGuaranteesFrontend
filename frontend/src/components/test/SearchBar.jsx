import React from 'react';

const SearchBar = ({ value, onChange, onSearch, isLoading }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        id="barCode"
        name="barCode"
        placeholder="Código de Barras"
        required
        value={value}
        onChange={onChange}
        style={{ flex: 1 }}
        disabled={isLoading}
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Evitar submit del form
                onSearch(value);
            }
        }}
      />
      <button
        type='button'
        className='search-button'
        onClick={() => onSearch(value)}
        disabled={isLoading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="white"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85zm-5.242 1.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;