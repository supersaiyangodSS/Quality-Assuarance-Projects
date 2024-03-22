const createBook = require('./create');
const deleteBook = require('./delete');
const deleteManyBooks = require('./delete-many');
const fetchBooks = require('./find-many');
const getBook = require('./find');

module.exports = {
  createBook,
  deleteBook,
  deleteManyBooks,
  fetchBooks,
  getBook
};
