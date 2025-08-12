// import React, { useState, useEffect } from "react";
// import Icon from "@/components/ui/Icon";

// const Pagination = ({ totalPages, currentPage, handlePageChange, text, className = "custom-class" }) => {
  
// 	const [pages, setPages] = useState([]);

//   	const rangeStart 		= useEffect(() => {
// 		let pages = [];
//     	for (let i = 1; i <= totalPages; i++) {
//       		pages.push(i);
//     	}
//     	setPages(pages);
//   	}, [totalPages]);

// 	return (
// 		<div className={className}>
// 		<ul className="pagination">
// 			<li>
// 			{text ? (
// 				<button className=" text-slate-600 dark:text-slate-300 prev-next-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
// 				Previous
// 				</button>
// 			) : (
// 				<button className="text-xl leading-4 text-slate-900 dark:text-white h-6  w-6 flex  items-center justify-center flex-col prev-next-btn " onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
// 				<Icon icon="heroicons-outline:chevron-left" />
// 				</button>
// 			)}
// 			</li>

// 			{pages.map((page) => (
// 			<li key={page}>
// 				<button
// 				className={`${page === currentPage ? "active" : ""} page-link`}
// 				onClick={() => handlePageChange(page)}
// 				disabled={page === currentPage}
// 				>
// 				{page}
// 				</button>
// 			</li>
// 			))}

// 			<li>
// 			{text ? (
// 				<button
// 				onClick={() => handlePageChange(currentPage + 1)}
// 				disabled={currentPage === totalPages}
// 				className=" text-slate-600 dark:text-slate-300 prev-next-btn"
// 				>
// 				Next
// 				</button>
// 			) : (
// 				<button
// 				className="text-xl leading-4 text-slate-900 dark:text-white  h-6  w-6 flex  items-center justify-center flex-col prev-next-btn"
// 				onClick={() => handlePageChange(currentPage + 1)}
// 				disabled={currentPage === totalPages}
// 				>
// 				<Icon icon="heroicons-outline:chevron-right" />
// 				</button>
// 			)}
// 			</li>
// 		</ul>
// 		</div>
// 	);
// };

// export default Pagination;
import React, { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";

const Pagination = ({ totalPages, currentPage, handlePageChange, text, className = "custom-class" }) => {
  const [pages, setPages] = useState([]);

  // Function to generate pages with ellipsis
  const generatePages = () => {
    const maxVisiblePages = 5;
    const paginationRange = [];

    // Always include the first page
    paginationRange.push(1);

    // Add ellipsis if currentPage > maxVisiblePages
    if (currentPage > maxVisiblePages) {
      paginationRange.push("...");
    }

    // Include pages around the current page
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
    for (let i = startPage; i <= endPage; i++) {
      paginationRange.push(i);
    }

    // Add ellipsis if the current page is far from the last page
    if (currentPage + 2 < totalPages - 1) {
      paginationRange.push("...");
    }

    // Always include the last page
    if (totalPages > 1) {
      paginationRange.push(totalPages);
    }

    setPages(paginationRange);
  };

  useEffect(() => {
    generatePages();
  }, [currentPage, totalPages]);

  return (
    <div className={className}>
      <ul className="pagination flex items-center space-x-2">
        {/* Previous Button */}
        <li>
          <button
            className={`${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
            } text-slate-600 dark:text-slate-300 prev-next-btn`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {text ? "Previous" : <Icon icon="heroicons-outline:chevron-left" />}
          </button>
        </li>

        {/* Page Numbers */}
        {pages.map((page, index) => (
          <li key={index}>
            {typeof page === "number" ? (
              <button
                className={`${
                  page === currentPage ? "active bg-blue-500 text-white" : ""
                } page-link px-3 py-1 rounded-md text-slate-900 dark:text-white`}
                onClick={() => handlePageChange(page)}
                disabled={page === currentPage}
              >
                {page}
              </button>
            ) : (
              <span className="px-3 py-1 text-slate-500">...</span>
            )}
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            className={`${
              currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
            } text-slate-600 dark:text-slate-300 prev-next-btn`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {text ? "Next" : <Icon icon="heroicons-outline:chevron-right" />}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
