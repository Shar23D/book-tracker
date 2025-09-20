export const filterBooks = (books, currentShelf, searchTerm, filters) => {
  let filtered = books;

  // Filter by shelf
  if (currentShelf !== "all") {
    filtered = filtered.filter((book) => book.shelf === currentShelf);
  }

  // Search
  if (searchTerm) {
    filtered = filtered.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply filters
  if (filters.author) {
    filtered = filtered.filter((book) =>
      book.author.toLowerCase().includes(filters.author.toLowerCase())
    );
  }

  if (filters.tags.length > 0) {
    filtered = filtered.filter((book) =>
      filters.tags.every((tag) => book.tags && book.tags.includes(tag))
    );
  }

  if (filters.minPages) {
    filtered = filtered.filter(
      (book) => book.pages >= parseInt(filters.minPages)
    );
  }

  if (filters.maxPages) {
    filtered = filtered.filter(
      (book) => book.pages <= parseInt(filters.maxPages)
    );
  }

  if (filters.minRating) {
    filtered = filtered.filter(
      (book) => book.rating >= parseFloat(filters.minRating)
    );
  }

  if (filters.maxRating) {
    filtered = filtered.filter(
      (book) => book.rating <= parseFloat(filters.maxRating)
    );
  }

  if (filters.minSpice) {
    filtered = filtered.filter(
      (book) => book.spiceRating >= parseFloat(filters.minSpice)
    );
  }

  if (filters.maxSpice) {
    filtered = filtered.filter(
      (book) => book.spiceRating <= parseFloat(filters.maxSpice)
    );
  }

  if (filters.form) {
    filtered = filtered.filter((book) => book.form === filters.form);
  }

  return filtered.sort((a, b) => a.title.localeCompare(b.title));
};
