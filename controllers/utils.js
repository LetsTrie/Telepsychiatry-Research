exports.pagination = (page, LIMIT, totalItems, baseUrl) => {
  return {
    URL: baseUrl,
    currentPage: page,
    hasNextPage: page * LIMIT < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalItems / LIMIT)
  };
};
