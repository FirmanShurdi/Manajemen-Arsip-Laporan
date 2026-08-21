import React from 'react';
import CategoryFilter from './CategoryFilter';
import SearchBar from '../common/SearchBar';

const Filsearch = ({
  selectedCategory,
  onCategoryChange,
  onCategoryClear,
  categoryOptions = [],
  keyword = '',
  onKeywordChange,
  onKeywordClear,
  onSearch
}) => {
  return (
    <div className="search-container-wrapper">
      <div className="search-container">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onChange={onCategoryChange}
          onClear={onCategoryClear}
          categoryOptions={categoryOptions}
          placeholder="Pilih Kategori"
          defaultLabel="Pilih Kategori"
          showIcon={false}
        />
        <div className="search-box">
          <SearchBar
            value={keyword}
            onChange={(e) => onKeywordChange && onKeywordChange(e.target.value)}
            onClear={onKeywordClear}
            placeholder="Masukkan Keyword Pencarian (nama, kategori, deskripsi)..."
          />
        </div>
        <button type="button" className="search-btn" onClick={onSearch}>
          <i className="fa-solid fa-magnifying-glass"></i> Cari
        </button>
      </div>
    </div>
  );
};

export default Filsearch;
