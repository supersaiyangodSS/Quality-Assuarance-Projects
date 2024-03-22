const BookModel = require('../../models/book/index.js');
const CommentModel = require('../../models/comment/index.js');

// You can send a GET request to /api/books/{_id} to retrieve a
// single object of a book containing the properties title, _id,
// and a comments array (empty array if no comments present).
// If no book is found, return the string no book exists.
module.exports = (req, res) => {
  let bookId = req.params.id;

  if (!bookId) {
    return res.send('missing required field id');
  }

  BookModel.getBookById(bookId, (error, book) => {
    if (error || !book) {
      return res.send('no book exists');
    }

    CommentModel.fetchComments({
      book: bookId
    }, null, (error, comments) => {
      if (error) {
        return res.json([]);
      }

      let objBook = {
        _id: book._id,
        title: book.title
      };

      let arrComments = [];
      for (let comment of comments) {
        arrComments.push(comment.comment);
      }

      objBook.comments = arrComments;

      return res.json(objBook);
    });
  });
};
