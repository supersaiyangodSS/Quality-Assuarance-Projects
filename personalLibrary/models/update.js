'use strict';

module.exports = (Model, id, obj, done) => {
  Model.findByIdAndUpdate(id, obj)
    .then((doc) => {
      done(null, doc);
    })
    .catch((err) => {
      done(err);
    });
};
