'use strict';

import { createInterface } from 'node:readline';
import { pathToFileURL } from 'node:url';

export function modulo(a, b) {
  return a % b;
}

export function power(base, exponent) {
  return base ** exponent;
}

export function squareRoot(n) {
  if (n < 0) {
    throw new RangeError('square root of a negative number is not allowed');
  }

  return Math.sqrt(n);
}

const OPERATIONS = {
  '+': (first, second) => first + second,
  '-': (first, second) => first - second,
  '*': (first, second) => first * second,
  '/': (first, second) => first / second,
  '%': modulo,
  '^': power,
  '**': power,
};

// Supported operations: +, -, *, /, %, ^, **, sqrt(n), and √n.
export function calculate(expression) {
  if (typeof expression !== 'string') {
    return 'Invalid input. Enter an expression such as 2 + 3.';
  }

  const numberPattern = '-?(?:\\d+(?:\\.\\d*)?|\\.\\d+)';
  const squareRootMatch = expression.match(new RegExp(`^\\s*(?:sqrt\\(\\s*(${numberPattern})\\s*\\)|√\\s*(${numberPattern}))\\s*$`));

  if (squareRootMatch) {
    const number = Number(squareRootMatch[1] || squareRootMatch[2]);

    if (!Number.isFinite(number)) {
      return 'Invalid input. Please enter finite numbers.';
    }

    if (number < 0) {
      return 'Error: square root of a negative number is not allowed.';
    }

    return String(squareRoot(number));
  }

  const match = expression.match(new RegExp(`^\\s*(${numberPattern})\\s*(\\*\\*|\\^|[+\\-*/%])\\s*(${numberPattern})\\s*$`));

  if (!match) {
    return 'Invalid input. Enter an expression such as 2 + 3.';
  }

  const first = Number(match[1]);
  const operator = match[2];
  const second = Number(match[3]);

  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    return 'Invalid input. Please enter finite numbers.';
  }

  if (operator === '/' && second === 0) {
    return 'Error: division by zero is not allowed.';
  }

  if (operator === '%' && second === 0) {
    return 'Error: modulo by zero is not allowed.';
  }

  const result = OPERATIONS[operator](first, second);

  if (!Number.isFinite(result)) {
    return 'Error: the result is outside the supported numeric range.';
  }

  return String(result);
}

function startCalculator() {
  const interface_ = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function prompt() {
    interface_.question('Enter a calculation (or q to quit): ', (input) => {
      if (['q', 'quit', 'exit'].includes(input.trim().toLowerCase())) {
        interface_.close();
        return;
      }

      console.log(calculate(input));
      prompt();
    });
  }

  prompt();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startCalculator();
}
