const BookModel = require('../../models/book/index.js');

// * You can send a GET request to /api/books and receive a JSON
// response representing all the books. The JSON response will be
// an array of objects with each object (book) containing title,
// _id, and commentcount properties.
module.exports = (req, res) => {
  BookModel.fetchBooks({}, null, (error, books) => {
    if (error) {
      return res.json({
        error: error.message
      });
    }

    return res.json(books);
  });
};
