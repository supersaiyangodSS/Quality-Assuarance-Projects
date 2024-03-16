function ConvertHandler() {
  const NUMBER_REGEX = /[.\d\/]+/g;
  const UNIT_REGEX = /[a-zA-Z]+$/;
  const INVALID_NUMBER_ERROR = 'invalid number';
  const INVALID_UNIT_ERROR = 'invalid unit';
  const NUMBER_PRECISION = 6;

  const unitConversions = {
    gal: { rate: 3.78541, name: 'gallons', returnUnit: 'L' },
    L: { rate: 1 / 3.78541, name: 'liters', returnUnit: 'gal' },
    mi: { rate: 1.60934, name: 'miles', returnUnit: 'km' },
    km: { rate: 1 / 1.60934, name: 'kilometers', returnUnit: 'mi' },
    lbs: { rate: 0.453592, name: 'pounds', returnUnit: 'kg' },
    kg: { rate: 1 / 0.453592, name: 'kilograms', returnUnit: 'lbs' }
  };

  const handleConversionError = (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error: ${error}`);
    }
    return error;
  };

  const parseFraction = (input) => {
    const parts = input.split('/');
    if (parts.length > 2) {
      return INVALID_NUMBER_ERROR;
    }
    const numerator = parseFloat(parts[0]);
    const denominator = parts[1] ? parseFloat(parts[1]) : 1;
    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
      return INVALID_NUMBER_ERROR;
    }
    return numerator / denominator;
  };

  const getUnitDetails = (input) => {
    const match = input.match(UNIT_REGEX);
    if (!match) {
      return INVALID_UNIT_ERROR;
    }
    const unit = match[0];
    const normalizedUnit = unit.toLowerCase() === 'l' ? 'L' : unit.toLowerCase();
    const unitDetail = unitConversions[normalizedUnit];
    if (!unitDetail) {
      return INVALID_UNIT_ERROR;
    }
    return unitDetail;
  };

  this.getNum = function (input) {
    const matches = input.match(NUMBER_REGEX);
    const result = matches ? matches[0] : '1';
    return parseFraction(result);
  };

  this.getUnit = function (input) {
    const match = input.match(UNIT_REGEX);
    if (!match) {
      return INVALID_UNIT_ERROR;
    }
    const unit = match[0].toLowerCase();
    const normalizedUnit = unit === 'l' ? 'L' : unit; 
    return unitConversions[normalizedUnit] ? normalizedUnit : INVALID_UNIT_ERROR;
  };

  this.getReturnUnit = function (initUnit) {
    const unitDetails = getUnitDetails(initUnit);
    return unitDetails !== INVALID_UNIT_ERROR ? unitDetails.returnUnit : INVALID_UNIT_ERROR;
  };

  this.spellOutUnit = function (unit) {
    const unitDetails = getUnitDetails(unit);
    return unitDetails !== INVALID_UNIT_ERROR ? unitDetails.name : INVALID_UNIT_ERROR;
  };

  this.convert = function (initNum, initUnit) {
    const unitDetails = getUnitDetails(initUnit);
    if (unitDetails === INVALID_UNIT_ERROR) {
      return 'cannot convert';
    }

    const number = this.getNum(initNum);
    if (number === INVALID_NUMBER_ERROR) {
      return 'cannot convert';
    }

    const result = number * unitDetails.rate;
    return parseFloat(result.toFixed(NUMBER_PRECISION));
  };
}

module.exports = ConvertHandler;
