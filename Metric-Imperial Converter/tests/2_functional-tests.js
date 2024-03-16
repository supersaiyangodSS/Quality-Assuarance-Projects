const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  suite('GET /api/convert => conversion object', () => {

    suite('Valid Inputs', () => {
      test('Convert a valid input such as 10L', (done) => {
        // Setup
        const input = '10L';
        const expectedNum = 10;
        const expectedUnit = 'L';
        const expectedReturnNum = 2.64172; // Gallons in 10 liters
        const expectedReturnUnit = 'gal';
        const expectedString = '10 liters converts to 2.64172 gallons';

        // Execute
        chai.request(server)
          .get('/api/convert')
          .query({input})
          .end(function(err, res) {
            // Assert
            assert.equal(res.status, 200);
            assert.equal(res.body.initNum, expectedNum);
            assert.equal(res.body.initUnit, expectedUnit);
            assert.approximately(res.body.returnNum, expectedReturnNum, 0.1);
            assert.equal(res.body.returnUnit, expectedReturnUnit);
            assert.equal(res.body.string, expectedString);
            done();
          });
      });
    });

    suite('Invalid Inputs', () => {
      test('Convert an invalid input such as 32g', (done) => {
        // Setup
        const input = '32g';
        const expectedError = 'invalid unit';

        // Execute
        chai.request(server)
          .get('/api/convert')
          .query({input})
          .end(function(err, res) {
            // Assert
            assert.equal(res.status, 200);
            assert.equal(res.body.error, expectedError);
            done();
          });
      });

      test('Convert an invalid number such as 3/7.2/4kg', (done) => {
        // Setup
        const input = '3/7.2/4kg';
        const expectedError = 'invalid number';

        // Execute
        chai.request(server)
          .get('/api/convert')
          .query({input})
          .end(function(err, res) {
            // Assert
            assert.equal(res.status, 200);
            assert.equal(res.body.error, expectedError);
            done();
          });
      });

      test('Convert an invalid number AND unit such as 3/7.2/4kilomegagram', (done) => {
        // Setup
        const input = '3/7.2/4kilomegagram';
        const expectedError = 'invalid number and unit';

        // Execute
        chai.request(server)
          .get('/api/convert')
          .query({input})
          .end(function(err, res) {
            // Assert
            assert.equal(res.status, 200);
            assert.equal(res.body.error, expectedError);
            done();
          });
      });
    });

    suite('Inputs without a number', () => {
      test('Convert with no number such as kg', (done) => {
        // Setup
        const input = 'kg';
        const expectedNum = 1; // Default number when no number is provided
        const expectedUnit = 'kg';
        const expectedReturnNum = 2.20462; // Pounds in 1 kilogram
        const expectedReturnUnit = 'lbs';
        const expectedString = '1 kilograms converts to 2.20462 pounds';

        // Execute
        chai.request(server)
          .get('/api/convert')
          .query({input})
          .end(function(err, res) {
            // Assert
            assert.equal(res.status, 200);
            assert.equal(res.body.initNum, expectedNum);
            assert.equal(res.body.initUnit, expectedUnit);
            assert.approximately(res.body.returnNum, expectedReturnNum, 0.1);
            assert.equal(res.body.returnUnit, expectedReturnUnit);
            assert.equal(res.body.string, expectedString);
            done();
          });
      });
    });

  });

});
