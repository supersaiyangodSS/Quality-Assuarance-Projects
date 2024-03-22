const BookModel = require('../../models/book/index.js');

// You can send a DELETE request to /api/books/{_id} to delete
// a book from the collection. The returned response will be
// the string delete successful if successful. If no book is
// found, return the string no book exists.
module.exports = (req, res) => {
  let bookId = req.params.id;

  if (!bookId) {
    return res.send('missing required field id');
  }

  BookModel.getBookById(bookId, (error, doc) => {
    if (error || !doc) {
      return res.send('no book exists');
    }

    BookModel.deleteBook(bookId, (error, doc) => {
      if (error) {
        return res.send('could not delete');
      }

      return res.send('delete successful');
    });
  });
};
