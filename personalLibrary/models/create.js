'use strict';

module.exports = (Model, obj, done) => {
  let document = new Model(obj);

  document.save()
    .then((doc) => {
      done(null, doc);
    })
    .catch((err) => {
      done(err);
    });
};
