import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange, paginate }) {
  const handlePageChange = onPageChange || paginate;
  if (totalPages <= 1) return null;

  const onPrevious = () => {
    if (currentPage > 1 && handlePageChange) handlePageChange(currentPage - 1);
  };

  const onNext = () => {
    if (currentPage < totalPages && handlePageChange) handlePageChange(currentPage + 1);
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="inline-flex items-center -space-x-px text-xs md:text-sm font-semibold">
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-1 px-3 py-2 leading-tight text-slate-600 bg-white border border-slate-300 rounded-l-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span className="hidden sm:inline">Sebelumnya</span>
      </button>

      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => handlePageChange && handlePageChange(1)}
            className="px-3 py-2 leading-tight border border-slate-300 text-slate-600 bg-white hover:bg-slate-50"
          >
            1
          </button>
          {pageNumbers[0] > 2 && (
            <span className="px-2 py-2 leading-tight border border-slate-300 text-slate-400 bg-slate-50">...</span>
          )}
        </>
      )}

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange && handlePageChange(page)}
          className={`px-3 py-2 leading-tight border border-slate-300 transition-colors ${
            currentPage === page
              ? 'z-10 text-blue-600 bg-blue-50 border-blue-500 font-bold'
              : 'text-slate-600 bg-white hover:bg-slate-50'
          }`}
        >
          {page}
        </button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-2 py-2 leading-tight border border-slate-300 text-slate-400 bg-slate-50">...</span>
          )}
          <button
            onClick={() => handlePageChange && handlePageChange(totalPages)}
            className="px-3 py-2 leading-tight border border-slate-300 text-slate-600 bg-white hover:bg-slate-50"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-1 px-3 py-2 leading-tight text-slate-600 bg-white border border-slate-300 rounded-r-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <span className="hidden sm:inline">Berikutnya</span>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
}
