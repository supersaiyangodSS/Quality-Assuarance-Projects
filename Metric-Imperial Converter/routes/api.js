'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {

  let convertHandler = new ConvertHandler();

  app.get('/api/convert', function(req, res){
    let input = req.query.input;
    let initNum = convertHandler.getNum(input);
    let initUnit = convertHandler.getUnit(input);

    if (initNum === 'invalid number' && initUnit === 'invalid unit') {
      return res.json({ error: 'invalid number and unit' });
    } else if (initNum === 'invalid number') {
      return res.json({ error: 'invalid number' });
    } else if (initUnit === 'invalid unit') {
      return res.json({ error: 'invalid unit' });
    }

    let returnNum = convertHandler.convert(input, initUnit);
    let returnUnit = convertHandler.getReturnUnit(initUnit);
    let spelledOutInitUnit = convertHandler.spellOutUnit(initUnit);
    let spelledOutReturnUnit = convertHandler.spellOutUnit(returnUnit);
    let toString = `${initNum} ${spelledOutInitUnit} converts to ${returnNum.toFixed(5)} ${spelledOutReturnUnit}`;

    res.json({
      initNum: initNum,
      initUnit: initUnit,
      returnNum: returnNum,
      returnUnit: returnUnit,
      string: toString
    });
  });

};
