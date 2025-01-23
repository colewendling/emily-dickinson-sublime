'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate an array of page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle clicking on a page number
  const handleClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center items-center mt-4 space-x-2">
      {/* Previous Button */}
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-base rounded ${
          currentPage === 1
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-pink-500 text-white hover:bg-pink-600'
        }`}
      >
        <span className="hidden sm:inline">Previous</span>
        <span className="inline sm:hidden">&lt;</span>
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => handleClick(number)}
          className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-base rounded ${
            number === currentPage
              ? 'bg-pink-800 text-white'
              : 'bg-pink-500 text-white hover:bg-pink-600'
          }`}
        >
          {number}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-base rounded ${
          currentPage === totalPages
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-pink-500 text-white hover:bg-pink-600'
        }`}
      >
        <span className="hidden sm:inline">Next</span>
        <span className="inline sm:hidden">&gt;</span>
      </button>
    </div>
  );
};

export default Pagination;
