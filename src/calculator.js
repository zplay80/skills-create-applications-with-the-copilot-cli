'use strict';

import { createInterface } from 'node:readline';
import { pathToFileURL } from 'node:url';

const OPERATIONS = {
  '+': (first, second) => first + second,
  '-': (first, second) => first - second,
  '*': (first, second) => first * second,
  '/': (first, second) => first / second,
};

// Supported operations: addition (+), subtraction (-), multiplication (*), and division (/).
export function calculate(expression) {
  if (typeof expression !== 'string') {
    return 'Invalid input. Enter an expression such as 2 + 3.';
  }

  const match = expression.match(/^\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*([+\-*/])\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*$/);

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
