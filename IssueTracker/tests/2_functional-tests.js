const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const myDB = require('../dbconnection.js');
const { ObjectId } = require('mongodb');
const deleteCollection = require('../cleanDB.js');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000);
  let createdIssues = [];
  let projectName = 'testproject1';
  
  test('Create an issue with every field: POST request to /api/issues/{project}', done => {
    let requester = chai.request(server).keepOpen();
    let testIssue = {
        'issue_title': 'Fix first error',
        'issue_text': 'Posted data has error',
        'created_by': 'Jim',
        'assigned_to': 'John',
        'status_text': 'Evaluating'
      };

    requester
      .post(`/api/issues/${projectName}`)
      .type('form')
      .send({ ...testIssue })
      .end((err, res) => {
        createdIssues.push(res.body);
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.issue_title, testIssue.issue_title);
        assert.equal(res.body.issue_text, testIssue.issue_text);
        assert.equal(res.body.created_by, testIssue.created_by);
        assert.equal(res.body.assigned_to, testIssue.assigned_to);
        assert.equal(res.body.status_text, testIssue.status_text);
        assert.isOk(res.body._id);
        assert.isOk(res.body.created_on);
        assert.isOk(res.body.updated_on);
        assert.equal(res.body.open, true);
        done();
      });
  });
  
  test('Create an issue with only required fields: POST request to /api/issues/{project}', done => {
    let requester = chai.request(server).keepOpen();
    let testIssue = {
        'issue_title': 'Fix Second error',
        'issue_text': 'Posted data definitely has errors',
        'created_by': 'Jim',
      };

    requester
      .post(`/api/issues/${projectName}`)
      .type('form')
      .send({ ...testIssue })
      .end((err, res) => {
        createdIssues.push(res.body);
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.issue_title, testIssue.issue_title);
        assert.equal(res.body.issue_text, testIssue.issue_text);
        assert.equal(res.body.created_by, testIssue.created_by);
        assert.equal(res.body.assigned_to, "");
        assert.equal(res.body.status_text, "");
        assert.isOk(res.body._id);
        assert.isOk(res.body.created_on);
        assert.isOk(res.body.updated_on);
        assert.equal(res.body.open, true);
        done();
      });
  });
  
  test('Create an issue with missing required fields: POST request to /api/issues/{project}', done => {
    let requester = chai.request(server).keepOpen();
    let testIssue = {
        'issue_title': '',
        'issue_text': 'Posted data definitely has errors',
        'created_by': 'Jim',
      };
    let expectedResponse = { error: 'required field(s) missing' };

    requester
      .post(`/api/issues/${projectName}`)
      .type('form')
      .send({ ...testIssue })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepEqual(res.body, expectedResponse);
        done();
      });
  });
  
  test('View issues on a project: GET request to /api/issues/{project}', done => {
    let requester = chai.request(server).keepOpen();

    requester
      .get(`/api/issues/${projectName}`)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.isArray(res.body);
        assert.deepEqual(res.body[0], createdIssues[0]);
        assert.deepEqual(res.body[1], createdIssues[1]);
        done();
      });
  });
  
  test('View issues on a project with one filter: GET request to /api/issues/{project}', done => {
    let requester = chai.request(server).keepOpen();

    requester
      .get(`/api/issues/${projectName}`)
      .query({ issue_title: 'Fix first error' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.isArray(res.body);
        assert.equal(res.body.length, 1)
        assert.deepEqual(res.body[0], createdIssues[0]);
        done();
      });
  });

  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', done => {
    let requester = chai.request(server).keepOpen();

    requester
      .get(`/api/issues/${projectName}`)
      .query({
        issue_title: 'Fix Second error',
        created_by: 'Jim'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.isArray(res.body);
        assert.equal(res.body.length, 1)
        assert.deepEqual(res.body[0], createdIssues[1]);
        done();
      });
  });

  test('Update one field on an issue: PUT request to /api/issues/{project}', done => {
    let requester = chai.request(server).keepOpen();

    requester
      .put(`/api/issues/${projectName}`)
      .send({
        _id: createdIssues[0]._id,
        assigned_to: 'Trina'
      })
      .end((err, res) => {
        

        myDB(async client => {
          const collection = await client.db('issueTracker').collection(projectName);

          let updatedIssue = await collection.findOne({ _id: new ObjectId(createdIssues[0]._id) });

          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.deepEqual(res.body, { result: 'successfully updated', _id: createdIssues[0]._id});

          assert.equal(updatedIssue.assigned_to, 'Trina');
          assert.isAbove(updatedIssue.updated_on, new Date(createdIssues[0].updated_on));
          done();
        });
        
      });
  });

  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', done => {
    let requester = chai.request(server).keepOpen();

    requester
      .put(`/api/issues/${projectName}`)
      .send({
        _id: createdIssues[1]._id,
        assigned_to: 'Vincent',
        status_text: 'In progress'
      })
      .end((err, res) => {
        myDB(async client => {
          const collection = await client.db('issueTracker').collection(projectName);

          let updatedIssue = await collection.findOne({ _id: new ObjectId(createdIssues[1]._id) });

          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.deepEqual(res.body, { result: 'successfully updated', _id: createdIssues[1]._id});
          assert.equal(updatedIssue.assigned_to, 'Vincent');
          assert.equal(updatedIssue.status_text, 'In progress');
          assert.isAbove(updatedIssue.updated_on, new Date(createdIssues[1].updated_on));
          done();
        });
      });

  });

  test('Update an issue with missing _id: PUT request to /api/issues/{project}', done => {
    let requester = chai.request(server).keepOpen();

    requester
      .put(`/api/issues/${projectName}`)
      .send({
        assigned_to: 'Vincent',
        status_text: 'In progress'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepEqual(res.body, { error: 'missing _id' });
        done();
      });
  });

  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', done => {
    let requester = chai.request(server).keepOpen();

    requester
      .put(`/api/issues/${projectName}`)
      .send({
        _id: createdIssues[1]._id
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: createdIssues[1]._id });
        done();
      });
  });

  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', done => {
    let requester = chai.request(server).keepOpen();

    requester
      .put(`/api/issues/${projectName}`)
      .send({
        _id: 'invalidID',
        created_by: 'Billy'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepEqual(res.body, { error: 'could not update', _id: 'invalidID' });
        done();
      });
  });

  test('Delete an issue: DELETE request to /api/issues/{project}', done => {
    let requester = chai.request(server).keepOpen();

    requester
      .delete(`/api/issues/${projectName}`)
      .send({
        _id: createdIssues[0]._id
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepEqual(res.body, { result: 'successfully deleted', _id: createdIssues[0]._id });
        done();
      });
  });

  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', done => {
    let requester = chai.request(server).keepOpen();

    requester
      .delete(`/api/issues/${projectName}`)
      .send({
        _id: 'invalidID'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepEqual(res.body, { error: 'could not delete', _id: 'invalidID' });
        done();
      });
  });

  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', done => {
    let requester = chai.request(server).keepOpen();

    requester
      .delete(`/api/issues/${projectName}`)
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepEqual(res.body, { error: 'missing _id' });

        myDB(async client => {
          const collection = await client.db('issueTracker').collection(projectName);
    
          await deleteCollection(collection);
          done();
        });
        
      });
  });
/*
  test('Clear database collection', done => {
    myDB(async client => {
      const collection = await client.db('issueTracker').collection(projectName);

      await deleteCollection(collection);
      done();
    });
    
  });
*/
  
  
});
