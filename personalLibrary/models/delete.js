'use strict';

module.exports = (Model, id, done) => {
  Model.findByIdAndDelete(id)
    .then((doc) => {
      done(null, doc);
    })
    .catch((err) => {
      done(err);
    });
};
