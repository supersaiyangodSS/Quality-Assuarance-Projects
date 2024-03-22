/*
*
*
*       Complete the API routing below
*
*
*/
'use strict';

const bookController = require('../controllers/book/index');
const commentController = require('../controllers/comment/index');

module.exports = function(app) {
  app.route('/api/books')
    .get(bookController.fetchBooks)
    .post(bookController.createBook)
    .delete(bookController.deleteManyBooks);

  app.route('/api/books/:id')
    .get(bookController.getBook)
    .post(commentController.createComment)
    .delete(bookController.deleteBook);
};
