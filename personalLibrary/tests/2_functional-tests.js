/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  let invalidBookId = 'invalid-----invalid';
  let validBookId = '';
  const bookTitle = 'Test Book';
  const comment = 'Test Comment';

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', (done) => {
    chai.request(server)
      .get('/api/books')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        if (res.body.length > 0) {
          assert.property(res.body[0], 'commentcount',
            'Books in array should contain commentcount');
          assert.property(res.body[0], 'title',
            'Books in array should contain title');
          assert.property(res.body[0], '_id',
            'Books in array should contain _id');
        }
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', () => {

    suite('POST /api/books with title => create book object/expect book object',
      function() {

        test('Test POST /api/books with title', (done) => {
          chai.request(server)
            .post(`/api/books`)
            .send({
              title: bookTitle,
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, '_id', 'Book should contain _id');
              assert.property(res.body, 'title', 'Book should contain title');
              assert.equal(res.body.title, bookTitle,
                'Book should have the same title');
              validBookId = res.body._id;
              done();
            });
        });

        test('Test POST /api/books with no title given', (done) => {
          chai.request(server)
            .post(`/api/books`)
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'missing required field title');
              done();
            });
        });

      });

    suite('GET /api/books => array of books', () => {

      test('Test GET /api/books', (done) => {
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            if (res.body.length > 0) {
              assert.property(res.body[0], 'commentcount',
                'Books in array should contain commentcount');
              assert.property(res.body[0], 'title',
                'Books in array should contain title');
              assert.property(res.body[0], '_id',
                'Books in array should contain _id');
            }
            done();
          });
      });

    });

    suite('GET /api/books/[id] => book object with [id]', () => {

      test('Test GET /api/books/[id] with id not in db', (done) => {
        chai.request(server)
          .get(`/api/books/${invalidBookId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists', 'Book should not exist');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', (done) => {
        chai.request(server)
          .get(`/api/books/${validBookId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id', 'Book should contain _id');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, 'comments',
              'Book should contain comments');
            assert.isArray(res.body.comments,
              'Book comments should be an array');
            done();
          });
      });

    });

    suite('POST /api/books/[id] => add comment/expect book object with id',
      () => {

        test('Test POST /api/books/[id] with comment', (done) => {
          chai.request(server)
            .post(`/api/books/${validBookId}`)
            .send({
              comment: comment,
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, '_id', 'Book should contain _id');
              assert.property(res.body, 'title', 'Book should contain title');
              assert.property(res.body, 'comments',
                'Book should contain comments');
              assert.isArray(res.body.comments,
                'Book comments should be an array');
              done();
            });
        });

        test('Test POST /api/books/[id] without comment field', (done) => {
          chai.request(server)
            .post(`/api/books/${validBookId}`)
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'missing required field comment',
                'Comment should be required');
              done();
            });
        });

        test('Test POST /api/books/[id] with comment, id not in db',
          (done) => {
            chai.request(server)
              .post(`/api/books/${invalidBookId}`)
              .send({
                comment: comment,
              })
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'no book exists',
                  'Book should not exist');
                done();
              });
          });

      });

    suite('DELETE /api/books/[id] => delete book object id', () => {

      test('Test DELETE /api/books/[id] with valid id in db', (done) => {
        chai.request(server)
          .delete(`/api/books/${validBookId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with id not in db', (done) => {
        chai.request(server)
          .delete(`/api/books/${invalidBookId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});
