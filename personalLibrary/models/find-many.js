'use strict';

module.exports = (Model, objCriteria, limit, done) => {
  let query = Model.find(objCriteria);
  if (limit) {
    query.limit(limit);
  }

  query.then((data) => {
    done(null, data);
  })
    .catch((err) => {
      done(err);
    });
};
