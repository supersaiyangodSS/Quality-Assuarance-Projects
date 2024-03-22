'use strict';

module.exports = (Model, objCriteria, done) => {
  Model.deleteMany(objCriteria)
    .then((data) => {
      done(null, data);
    })
    .catch((err) => {
      done(err);
    });
};
