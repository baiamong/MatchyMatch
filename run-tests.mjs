// Simple test runner for match logic
import {
  isValidSelection,
  checkMatch,
  isOneAway,
  isCategoryGuessed,
  isGameWon,
  isGameLost,
  decrementLives,
  validatePuzzle,
  getCorrectCount,
} from './src/utils/matchLogic.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  ${error.message}`);
    failed++;
  }
}

function expect(value) {
  return {
    toBe(expected) {
      if (value !== expected) {
        throw new Error(`Expected ${expected} but got ${value}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(value) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(value)}`);
      }
    }
  };
}

// Mock data
const mockAllWords = [
  { word: 'LAMP', categoryId: 'yellow' },
  { word: 'TOASTER', categoryId: 'yellow' },
  { word: 'FAN', categoryId: 'yellow' },
  { word: 'ROUTER', categoryId: 'yellow' },
  { word: 'MIRROR', categoryId: 'green' },
  { word: 'TOWEL', categoryId: 'green' },
  { word: 'FAUCET', categoryId: 'green' },
  { word: 'DRAIN', categoryId: 'green' },
  { word: 'TRAP', categoryId: 'blue' },
  { word: 'SCREEN', categoryId: 'blue' },
  { word: 'SLIDING', categoryId: 'blue' },
  { word: 'REVOLVING', categoryId: 'blue' },
];

const mockPuzzle = {
  id: 1,
  categories: [
    { id: 'yellow', color: 'yellow', title: 'Things you plug in', words: ['LAMP', 'TOASTER', 'FAN', 'ROUTER'] },
    { id: 'green', color: 'green', title: 'In the bathroom', words: ['MIRROR', 'TOWEL', 'FAUCET', 'DRAIN'] },
    { id: 'blue', color: 'blue', title: '___ door', words: ['TRAP', 'SCREEN', 'SLIDING', 'REVOLVING'] },
  ],
};

console.log('\n=== Match Logic Tests ===\n');

// isValidSelection tests
console.log('isValidSelection:');
test('should return true for exactly 4 words', () => {
  expect(isValidSelection(['LAMP', 'TOASTER', 'FAN', 'ROUTER'])).toBe(true);
});

test('should return false for less than 4 words', () => {
  expect(isValidSelection(['LAMP', 'TOASTER', 'FAN'])).toBe(false);
});

test('should return false for more than 4 words', () => {
  expect(isValidSelection(['LAMP', 'TOASTER', 'FAN', 'ROUTER', 'MIRROR'])).toBe(false);
});

test('should return false for non-array inputs', () => {
  expect(isValidSelection(null)).toBe(false);
});

// checkMatch tests
console.log('\ncheckMatch:');
test('should return true for a correct match', () => {
  const result = checkMatch(['LAMP', 'TOASTER', 'FAN', 'ROUTER'], mockAllWords);
  expect(result.isMatch).toBe(true);
  expect(result.categoryId).toBe('yellow');
});

test('should return false for one away', () => {
  const result = checkMatch(['LAMP', 'TOASTER', 'FAN', 'MIRROR'], mockAllWords);
  expect(result.isMatch).toBe(false);
});

test('should return false for invalid selection', () => {
  const result = checkMatch(['LAMP', 'TOASTER'], mockAllWords);
  expect(result.isMatch).toBe(false);
});

// isOneAway tests
console.log('\nisOneAway:');
test('should return true when 3 out of 4 words match', () => {
  expect(isOneAway(['LAMP', 'TOASTER', 'FAN', 'MIRROR'], mockAllWords)).toBe(true);
});

test('should return false for a perfect match', () => {
  expect(isOneAway(['LAMP', 'TOASTER', 'FAN', 'ROUTER'], mockAllWords)).toBe(false);
});

test('should return false for 2 out of 4 correct', () => {
  expect(isOneAway(['LAMP', 'TOASTER', 'MIRROR', 'TOWEL'], mockAllWords)).toBe(false);
});

// isGameWon tests
console.log('\nisGameWon:');
test('should return true when all categories are guessed', () => {
  const guessedCategories = [{ id: 'yellow' }, { id: 'green' }, { id: 'blue' }];
  expect(isGameWon(guessedCategories, 3)).toBe(true);
});

test('should return false when not all categories are guessed', () => {
  const guessedCategories = [{ id: 'yellow' }, { id: 'green' }];
  expect(isGameWon(guessedCategories, 3)).toBe(false);
});

// isGameLost tests
console.log('\nisGameLost:');
test('should return true when lives are 0', () => {
  expect(isGameLost(0)).toBe(true);
});

test('should return false when lives are positive', () => {
  expect(isGameLost(5)).toBe(false);
});

// decrementLives tests
console.log('\ndecrementLives:');
test('should decrement lives by 1', () => {
  expect(decrementLives(5)).toBe(4);
});

test('should not go below 0', () => {
  expect(decrementLives(0)).toBe(0);
});

// validatePuzzle tests
console.log('\nvalidatePuzzle:');
test('should validate a correct puzzle', () => {
  const result = validatePuzzle(mockPuzzle);
  expect(result.isValid).toBe(true);
});

test('should reject null puzzle', () => {
  const result = validatePuzzle(null);
  expect(result.isValid).toBe(false);
});

test('should reject puzzle with duplicate words', () => {
  const invalidPuzzle = {
    id: 1,
    categories: [
      { id: 'yellow', color: 'yellow', title: 'Test 1', words: ['LAMP', 'B', 'C', 'D'] },
      { id: 'green', color: 'green', title: 'Test 2', words: ['LAMP', 'E', 'F', 'G'] },
    ],
  };
  const result = validatePuzzle(invalidPuzzle);
  expect(result.isValid).toBe(false);
});

// getCorrectCount tests
console.log('\ngetCorrectCount:');
test('should return 4 for a perfect match', () => {
  expect(getCorrectCount(['LAMP', 'TOASTER', 'FAN', 'ROUTER'], mockAllWords, 'yellow')).toBe(4);
});

test('should return 3 for one away', () => {
  expect(getCorrectCount(['LAMP', 'TOASTER', 'FAN', 'MIRROR'], mockAllWords, 'yellow')).toBe(3);
});

test('should return 0 for no correct words', () => {
  expect(getCorrectCount(['MIRROR', 'TOWEL', 'FAUCET', 'DRAIN'], mockAllWords, 'yellow')).toBe(0);
});

console.log(`\n=== Results ===`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}\n`);

process.exit(failed > 0 ? 1 : 0);
