'use strict';
const { ObjectId } = require('mongodb');

module.exports = function (app, myDataBase) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      //console.log(`project: ${req.params.project}`);
      let collection = myDataBase.collection(req.params.project);
      let query = {};
      let issuesArray = [];
      
      for (let [key, value] of Object.entries(req.query)) {
        if (key === '_id') {
          query[key] = new ObjectId(value);
        } else {
          query[key] = value;
        }
        
      }

      collection
        .find(query)
        .toArray()
        .then(resultArray => res.json(resultArray))
        .catch(err => console.error(err));
      
    })

    .post(function (req, res){
      //console.log(req.params);
      //console.log(req.body);
      let collection = myDataBase.collection(req.params.project);
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        res.json({ error: 'required field(s) missing' });
      } else {
        let timeNow = new Date();
        let newIssue = {
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_on: timeNow,
          updated_on: timeNow,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || "",
          open: true,
          status_text: req.body.status_text || ""
        };

        collection
          .insertOne(newIssue)
          .then(result => {
            res.json({
              _id: result.insertedId, ...newIssue
            });
          })
          .catch(err => console.error(err));
        
      }
    })
    
    .put(function (req, res){
      let collection = myDataBase.collection(req.params.project);
      let updateIssue = {};
      let updateKeyCount = 0;
      let updateAbleKeys = [
        'issue_title',
        'issue_text',
        'created_by',
        'assigned_to',
        'open',
        'status_text'
      ];
      
      if (!req.body._id) {
        res.json({ error: 'missing _id' });
      } else if (req.body._id.length !== 24) {
        res.json({
          error: 'could not update',
          _id: req.body._id
        });
      } else {
        updateAbleKeys.forEach(el => {
          if (Object.hasOwn(req.body, el)) {
            if (el === "open") {
              updateIssue[el] = req.body[el] === "true" ? true : false;
            } else {
              updateIssue[el] = req.body[el];
            }
            updateKeyCount ++;
          }
        });
        
        if (updateKeyCount == 0) {
          res.json({
            error: 'no update field(s) sent',
            _id: req.body._id
          });
        } else {
          updateIssue.updated_on = new Date();
          const filter = { _id: new ObjectId(req.body._id) };
          const updateDoc = { $set: { ...updateIssue } };

          collection
            .updateOne(filter, updateDoc)
            .then(result => {
              console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
              if (result.modifiedCount === 1) {
                res.json({
                  result: 'successfully updated',
                  _id: req.body._id
                });
              } else {
                res.json({
                  error: 'could not update',
                  _id: req.body._id
                });
              }
            })
            .catch(err => {
              console.error(err);
              res.json({
                  error: 'could not update',
                  _id: req.body._id
                });
            });
          
        }
      }
    })
    
    .delete(function (req, res){
      let collection = myDataBase.collection(req.params.project);

      if (!req.body._id) {
        res.json({ error: 'missing _id' });
      } else if (req.body._id.length !== 24) {
        res.json({
           error: 'could not delete',
           _id: req.body._id
         });
      } else {
        collection
          .deleteOne({ _id: new ObjectId(req.body._id) })
          .then(result => {
            if (result.deletedCount === 1) {
              res.json({
                result: 'successfully deleted',
                _id: req.body._id
              });
            } else {
              res.json({
                error: 'could not delete',
                _id: req.body._id
              });
            }
          }).catch(err => console.error(err));
      }
    });

  //404 Not Found Middleware
  app.use(function(req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found');
  });
    
};
