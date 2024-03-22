'use strict';

module.exports = (Model, id, done) => {
  Model.findById(id)
    .then((doc) => {
      done(null, doc);
    })
    .catch((err) => {
      done(err);
    });
};
