import assert from 'node:assert/strict';
import test from 'node:test';
import { calculate, modulo, power, squareRoot } from '../calculator.js';

test('provides modulo, power, and square root operations', () => {
  assert.equal(modulo(10, 3), 1);
  assert.equal(power(2, 3), 8);
  assert.equal(squareRoot(9), 3);
  assert.throws(() => squareRoot(-1), {
    name: 'RangeError',
    message: 'square root of a negative number is not allowed',
  });
});

test('adds numbers', () => {
  assert.equal(calculate('2 + 3'), '5');
  assert.equal(calculate('1.5 + 2.25'), '3.75');
});

test('subtracts numbers', () => {
  assert.equal(calculate('10 - 4'), '6');
  assert.equal(calculate('4 - 10'), '-6');
});

test('multiplies numbers', () => {
  assert.equal(calculate('45 * 2'), '90');
  assert.equal(calculate('-2.5 * 4'), '-10');
});

test('divides numbers', () => {
  assert.equal(calculate('20 / 5'), '4');
  assert.equal(calculate('1 / 4'), '0.25');
});

test('calculates modulo, powers, and square roots', () => {
  assert.equal(calculate('5 % 2'), '1');
  assert.equal(calculate('-5 % 2'), '-1');
  assert.equal(calculate('10 % 3'), '1');
  assert.equal(calculate('2 ^ 3'), '8');
  assert.equal(calculate('2 ^ -2'), '0.25');
  assert.equal(calculate('2 ** 3'), '8');
  assert.equal(calculate('2 ** -2'), '0.25');
  assert.equal(calculate('sqrt(9)'), '3');
  assert.equal(calculate('√16'), '4');
  assert.equal(calculate('√0'), '0');
});

test('accepts whitespace and signed decimal operands', () => {
  assert.equal(calculate('  -1.5   +   .5  '), '-1');
  assert.equal(calculate('2 + -3'), '-1');
});

test('rejects division by positive or negative zero', () => {
  assert.equal(calculate('2 / 0'), 'Error: division by zero is not allowed.');
  assert.equal(calculate('2 / -0'), 'Error: division by zero is not allowed.');
});

test('rejects modulo by positive or negative zero and negative square roots', () => {
  assert.equal(calculate('2 % 0'), 'Error: modulo by zero is not allowed.');
  assert.equal(calculate('2 % -0'), 'Error: modulo by zero is not allowed.');
  assert.equal(calculate('sqrt(-1)'), 'Error: square root of a negative number is not allowed.');
  assert.equal(calculate('√-1'), 'Error: square root of a negative number is not allowed.');
});

test('rejects malformed or unsupported expressions', () => {
  for (const expression of ['', '√', 'sqrt(1 + 3)', '2 + 3 + 4', 'hello']) {
    assert.equal(
      calculate(expression),
      'Invalid input. Enter an expression such as 2 + 3.',
      `expected "${expression}" to be rejected`,
    );
  }
});

test('rejects non-string input', () => {
  for (const expression of [null, undefined, 42]) {
    assert.equal(calculate(expression), 'Invalid input. Enter an expression such as 2 + 3.');
  }
});

test('rejects operands outside the supported numeric range', () => {
  const tooLarge = '9'.repeat(309);

  assert.equal(
    calculate(`${tooLarge} + 1`),
    'Invalid input. Please enter finite numbers.',
  );
});

test('rejects results outside the supported numeric range', () => {
  const largeFiniteNumber = '9'.repeat(308);

  assert.equal(
    calculate(`${largeFiniteNumber} * ${largeFiniteNumber}`),
    'Error: the result is outside the supported numeric range.',
  );
});
