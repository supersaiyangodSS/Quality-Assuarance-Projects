'use strict';

let mongoose = require('../../models/connection.js');

const CommentSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: function(doc, ret) {
        delete ret.id;
        delete ret.__v;
        delete ret.book;
      },
    },
    toObject: {
      transform: function(doc, ret) {
        delete ret.id;
        delete ret.__v;
        delete ret.book;
      },
    },
  },
);

const CommentModel = mongoose.model('Comment', CommentSchema);

const fetchComments = require('../find-many');
const getCommentById = require('../find-by-id');
const createAndSaveComment = require('../create');
const updateComment = require('../update');
const deleteComment = require('../delete');

module.exports = {
  CommentModel,
  fetchComments: (objCriteria, limit, done) => {
    fetchComments(CommentModel, objCriteria, limit, done);
  },
  getCommentById: (commentId, done) => {
    getCommentById(CommentModel, commentId, done);
  },
  createAndSaveComment: (bookId, comment, done) => {
    createAndSaveComment(CommentModel, {
      book: bookId,
      comment: comment
    }, done);
  },
  updateComment: (commentId, obj, done) => {
    updateComment(CommentModel, commentId, obj, done);
  },
  deleteComment: (commentId, done) => {
    deleteComment(CommentModel, commentId, done);
  },
};
