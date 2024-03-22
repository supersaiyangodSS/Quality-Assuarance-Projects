const BookModel = require('../../models/book/index.js');

// You can send a POST request to /api/books with title as part of
// the form data to add a book. The returned response will be an
// object with the title and a unique _id as keys.
// If title is not included in the request, the returned response
// should be the string missing required field title.
module.exports = (req, res) => {
  let bookTitle = req.body.title || '';

  if (!bookTitle) {
    return res.send('missing required field title');
  }

  BookModel.createAndSaveBook(bookTitle, (error, doc) => {
    if (error) {
      return res.json({
        error: error.message
      });
    }

    return res.json({
      _id: doc._id,
      title: doc.title
    });
  });
};
