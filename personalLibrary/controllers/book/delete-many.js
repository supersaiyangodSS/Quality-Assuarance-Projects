const BookModel = require('../../models/book/index.js');

// You can send a DELETE request to /api/books to delete all books
// in the database. The returned response will be the string complete
// delete successful if successful.
module.exports = (req, res) => {
  BookModel.deleteManyBooks({}, (error, data) => {
    if (error) {
      return res.send('could not delete');
    }

    return res.send('complete delete successful');
  });
};
