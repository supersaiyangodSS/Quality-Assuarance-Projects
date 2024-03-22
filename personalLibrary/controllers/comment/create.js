const BookModel = require('../../models/book/index.js');
const CommentModel = require('../../models/comment/index.js');

// You can send a POST request containing comment as the form body
// data to /api/books/{_id} to add a comment to a book.
// The returned response will be the books object similar to GET
// /api/books/{_id} request in an earlier test.
// If comment is not included in the request, return the string
// missing required field comment.
// If no book is found, return the string no book exists.
module.exports = (req, res) => {
  let bookId = req.params.id;
  let comment = req.body.comment || '';

  if (!bookId) {
    return res.send('missing required field id');
  }

  if (!comment) {
    return res.send('missing required field comment');
  }

  BookModel.getBookById(bookId, (error, book) => {
    if (error || !book) {
      return res.send('no book exists');
    }

    let commentCount = book.commentcount || 0;

    CommentModel.createAndSaveComment(bookId, comment, (error, doc) => {
      if (error || !doc) {
        return res.send('could not save comment');
      }

      CommentModel.fetchComments({
        book: bookId
      }, null, (error, comments) => {
        if (error) {
          return res.json([]);
        }

        commentCount++;

        BookModel.updateBook(bookId, {
          commentcount: commentCount
        }, (error, doc) => {
          if (error) {
            return res.send('could not update book');
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
    });
  });
};
