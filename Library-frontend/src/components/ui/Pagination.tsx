import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2 mt-6 justify-center">
      <button
        className={`px-3 py-1 rounded text-white ${currentPage === 1
            ? "bg-gray-700 opacity-50 cursor-not-allowed"
            : "bg-gray-700 hover:bg-gray-600"
          }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>


      {pages.map((page) => (
        <button
          key={page}
          className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700"}`}

          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className={`px-3 py-1 rounded text-white ${currentPage === totalPages
            ? "bg-gray-700 opacity-50 cursor-not-allowed"
            : "bg-gray-700 hover:bg-gray-600"
          }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>

    </div>
  );
};

export default Pagination;
