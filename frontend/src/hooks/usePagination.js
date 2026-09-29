import { useMemo, useState } from "react";

const usePagination = (items = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = items.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / itemsPerPage)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedItems = useMemo(() => {
    const startIndex =
      (safeCurrentPage - 1) * itemsPerPage;

    const endIndex = startIndex + itemsPerPage;

    return items.slice(startIndex, endIndex);
  }, [items, safeCurrentPage, itemsPerPage]);

  const goToPage = (page) => {
    const pageNumber = Number(page);

    if (
      Number.isInteger(pageNumber) &&
      pageNumber >= 1 &&
      pageNumber <= totalPages
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const nextPage = () => {
    setCurrentPage((page) =>
      Math.min(page + 1, totalPages)
    );
  };

  const previousPage = () => {
    setCurrentPage((page) =>
      Math.max(page - 1, 1)
    );
  };

  const firstPage = () => {
    setCurrentPage(1);
  };

  const lastPage = () => {
    setCurrentPage(totalPages);
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    currentPage: safeCurrentPage,
    totalPages,
    totalItems,
    paginatedItems,
    hasNextPage: safeCurrentPage < totalPages,
    hasPreviousPage: safeCurrentPage > 1,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    resetPagination,
  };
};

export default usePagination;