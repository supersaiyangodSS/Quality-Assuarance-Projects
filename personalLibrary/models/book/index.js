'use strict';

let mongoose = require('../../models/connection.js');

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    commentcount: {
      type: Number,
      default: 0,
    },
  },
  // timestamps: true,
  {
    toJSON: {
      transform: function(doc, ret) {
        delete ret.id;
        delete ret.__v;
      },
    },
    toObject: {
      transform: function(doc, ret) {
        delete ret.id;
        delete ret.__v;
      },
    },
  },
);

const BookModel = mongoose.model('Book', BookSchema);

const fetchBooks = require('../find-many');
const getBookById = require('../find-by-id');
const createAndSaveBook = require('../create');
const updateBook = require('../update');
const deleteBook = require('../delete');
const deleteManyBooks = require('../delete-many');

module.exports = {
  BookModel,
  fetchBooks: (objCriteria, limit, done) => {
    fetchBooks(BookModel, objCriteria, limit, done);
  },
  getBookById: (bookId, done) => {
    getBookById(BookModel, bookId, done);
  },
  createAndSaveBook: (bookTitle, done) => {
    createAndSaveBook(BookModel, {title: bookTitle}, done);
  },
  updateBook: (bookId, obj, done) => {
    updateBook(BookModel, bookId, obj, done);
  },
  deleteBook: (bookId, done) => {
    deleteBook(BookModel, bookId, done);
  },
  deleteManyBooks: (objCriteria, done) => {
    deleteManyBooks(BookModel, objCriteria, done);
  },
};
