const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

suite('Unit Tests for ConvertHandler', () => {
    let convertHandler;

    setup(() => {
        convertHandler = new ConvertHandler();
    });

    suite('getNum()', () => {
        test('Whole number input', () => {
            // Setup
            const input = '42L';
            const expected = 42;

            // Execute
            const result = convertHandler.getNum(input);

            // Assert
            assert.strictEqual(result, expected);
        });

        test('Decimal number input', () => {
            // Setup
            const input = '4.2L';
            const expected = 4.2;

            // Execute
            const result = convertHandler.getNum(input);

            // Assert
            assert.strictEqual(result, expected);
        });

        test('Fractional input', () => {
            // Setup
            const input = '1/2L';
            const expected = 0.5;

            // Execute
            const result = convertHandler.getNum(input);

            // Assert
            assert.strictEqual(result, expected);
        });

        test('Fractional input with a decimal', () => {
            // Setup
            const input = '2.5/5L';
            const expected = 0.5;

            // Execute
            const result = convertHandler.getNum(input);

            // Assert
            assert.strictEqual(result, expected);
        });

        test('Double-fraction input', () => {
            // Setup
            const input = '3/2/3L';
            const expected = 'invalid number';

            // Execute
            const result = convertHandler.getNum(input);

            // Assert
            assert.strictEqual(result, expected);
        });

        test('No numerical input defaults to 1', () => {
            // Setup
            const input = 'L';
            const expected = 1;

            // Execute
            const result = convertHandler.getNum(input);

            // Assert
            assert.strictEqual(result, expected);
        });
    });

    suite('getUnit()', () => {
        test('Valid input unit', () => {
            // Setup
            const input = '42L';
            const expectedUnit = 'L';

            // Execute
            const result = convertHandler.getUnit(input);

            // Assert
            assert.strictEqual(result, expectedUnit);
        });

        test('Invalid input unit', () => {
            // Setup
            const input = '42g';
            const expectedUnit = 'invalid unit';

            // Execute
            const result = convertHandler.getUnit(input);

            // Assert
            assert.strictEqual(result, expectedUnit);
        });
    });

    suite('getReturnUnit()', () => {
        test('Return unit for valid input', () => {
            // Setup
            const input = '42L';
            const expectedReturnUnit = 'gal';

            // Execute
            const result = convertHandler.getReturnUnit(input);

            // Assert
            assert.strictEqual(result, expectedReturnUnit);
        });
    });

    suite('spellOutUnit()', () => {
        test('Spelled-out string unit for valid input', () => {
            // Setup
            const input = '42L';
            const expectedSpelledOut = 'liters';

            // Execute
            const result = convertHandler.spellOutUnit(input);

            // Assert
            assert.strictEqual(result, expectedSpelledOut);
        });
    });

    suite('convert()', () => {
        test('Gallons to liters', () => {
            // Setup
            const input = '1gal';
            const unit = 'gal';
            const expected = 3.78541;

            // Execute
            const result = convertHandler.convert(input, unit);

            // Assert
            assert.strictEqual(result, expected);
        });

        test('Liters to gallons', () => {
            // Setup
            const input = '3.78541L';
            const unit = 'L';
            const expected = 1;

            // Execute
            const result = convertHandler.convert(input, unit);

            // Assert
            assert.strictEqual(result, expected);
        });

        test('Miles to kilometers', () => {
            // Setup
            const input = '1mi';
            const unit = 'mi';
            const expected = 1.60934;

            // Execute
            const result = convertHandler.convert(input, unit);

            // Assert
            assert.strictEqual(result, expected);
        });

        test('Kilometers to miles', () => {
            // Setup
            const input = '1.60934km';
            const unit = 'km';
            const expected = 1;

            // Execute
            const result = convertHandler.convert(input, unit);

            // Assert
            assert.strictEqual(result, expected);
        });

        test('Pounds to kilograms', () => {
            // Setup
            const input = '1lbs';
            const unit = 'lbs';
            const expected = 0.453592;

            // Execute
            const result = convertHandler.convert(input, unit);

            // Assert
            assert.strictEqual(result, expected);
        });

        test('Kilograms to pounds', () => {
            // Setup
            const input = '0.453592kg';
            const unit = 'kg';
            const expected = 1;

            // Execute
            const result = convertHandler.convert(input, unit);

            // Assert
            assert.strictEqual(result, expected);
        });
    });
});
