// Additional edge case tests for match logic
import {
  isValidSelection,
  checkMatch,
  isOneAway,
  isCategoryGuessed,
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
    },
    toBeGreaterThan(expected) {
      if (value <= expected) {
        throw new Error(`Expected ${value} to be greater than ${expected}`);
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
];

console.log('\n=== Additional Edge Case Tests ===\n');

// Edge case: Selecting same word multiple times
console.log('Duplicate word selection:');
test('should handle duplicate words in selection (all same word)', () => {
  const result = checkMatch(['LAMP', 'LAMP', 'LAMP', 'LAMP'], mockAllWords);
  expect(result.isMatch).toBe(true);
  expect(result.categoryId).toBe('yellow');
});

test('should handle duplicate words in selection (mixed)', () => {
  const result = checkMatch(['LAMP', 'LAMP', 'TOASTER', 'FAN'], mockAllWords);
  expect(result.isMatch).toBe(true);
  expect(result.categoryId).toBe('yellow');
});

// Edge case: Case sensitivity
console.log('\nCase sensitivity:');
test('should be case-sensitive for word matching', () => {
  const result = checkMatch(['lamp', 'toaster', 'fan', 'router'], mockAllWords);
  expect(result.isMatch).toBe(false);
});

test('should be case-sensitive for one away detection', () => {
  expect(isOneAway(['lamp', 'toaster', 'fan', 'MIRROR'], mockAllWords)).toBe(false);
});

// Edge case: Whitespace handling
console.log('\nWhitespace handling:');
test('should not match words with leading whitespace', () => {
  const result = checkMatch([' LAMP', 'TOASTER', 'FAN', 'ROUTER'], mockAllWords);
  expect(result.isMatch).toBe(false);
});

test('should not match words with trailing whitespace', () => {
  const result = checkMatch(['LAMP ', 'TOASTER', 'FAN', 'ROUTER'], mockAllWords);
  expect(result.isMatch).toBe(false);
});

// Edge case: Empty and null values
console.log('\nEmpty and null values:');
test('should handle empty string in selection', () => {
  const result = checkMatch(['', '', '', ''], mockAllWords);
  expect(result.isMatch).toBe(false);
});

test('should handle null values in selection', () => {
  const result = checkMatch([null, null, null, null], mockAllWords);
  expect(result.isMatch).toBe(false);
});

test('should handle undefined values in selection', () => {
  const result = checkMatch([undefined, undefined, undefined, undefined], mockAllWords);
  expect(result.isMatch).toBe(false);
});

test('should handle mixed null and valid words', () => {
  const result = checkMatch(['LAMP', null, 'FAN', 'ROUTER'], mockAllWords);
  expect(result.isMatch).toBe(false);
});

// Edge case: Category guessing with edge cases
console.log('\nCategory guessing edge cases:');
test('should handle checking against empty guessed categories', () => {
  expect(isCategoryGuessed('yellow', [])).toBe(false);
});

test('should handle checking with null category ID', () => {
  const guessed = [{ id: 'yellow' }];
  expect(isCategoryGuessed(null, guessed)).toBe(false);
});

test('should handle checking with undefined category ID', () => {
  const guessed = [{ id: 'yellow' }];
  expect(isCategoryGuessed(undefined, guessed)).toBe(false);
});

// Edge case: Puzzle validation edge cases
console.log('\nPuzzle validation edge cases:');
test('should reject puzzle with category missing words', () => {
  const puzzle = {
    id: 1,
    categories: [
      { id: 'yellow', color: 'yellow', title: 'Test' }
    ]
  };
  const result = validatePuzzle(puzzle);
  expect(result.isValid).toBe(false);
});

test('should reject puzzle with too few words in category', () => {
  const puzzle = {
    id: 1,
    categories: [
      { id: 'yellow', color: 'yellow', title: 'Test', words: ['A', 'B'] }
    ]
  };
  const result = validatePuzzle(puzzle);
  expect(result.isValid).toBe(false);
});

test('should reject puzzle with too many words in category', () => {
  const puzzle = {
    id: 1,
    categories: [
      { id: 'yellow', color: 'yellow', title: 'Test', words: ['A', 'B', 'C', 'D', 'E'] }
    ]
  };
  const result = validatePuzzle(puzzle);
  expect(result.isValid).toBe(false);
});

test('should detect multiple errors in one puzzle', () => {
  const puzzle = {
    id: 1,
    categories: [
      { color: 'yellow', title: 'Test 1', words: ['A', 'B'] }, // missing id, wrong word count
      { id: 'green', title: 'Test 2', words: ['A', 'C', 'D', 'E'] } // duplicate word 'A'
    ]
  };
  const result = validatePuzzle(puzzle);
  expect(result.isValid).toBe(false);
  expect(result.errors.length).toBeGreaterThan(1);
});

// Edge case: getCorrectCount edge cases
console.log('\ngetCorrectCount edge cases:');
test('should return 0 for empty selection', () => {
  expect(getCorrectCount([], mockAllWords, 'yellow')).toBe(0);
});

test('should return 0 for selection with wrong length', () => {
  expect(getCorrectCount(['LAMP', 'TOASTER'], mockAllWords, 'yellow')).toBe(0);
});

test('should return 0 for non-existent category', () => {
  expect(getCorrectCount(['LAMP', 'TOASTER', 'FAN', 'ROUTER'], mockAllWords, 'nonexistent')).toBe(0);
});

test('should handle mixed case in category ID', () => {
  expect(getCorrectCount(['LAMP', 'TOASTER', 'FAN', 'ROUTER'], mockAllWords, 'YELLOW')).toBe(0);
});

// Edge case: One away with all different categories
console.log('\nOne away edge cases:');
test('should return false when all 4 words are from different categories', () => {
  const mixedWords = [
    { word: 'A', categoryId: 'cat1' },
    { word: 'B', categoryId: 'cat2' },
    { word: 'C', categoryId: 'cat3' },
    { word: 'D', categoryId: 'cat4' },
  ];
  expect(isOneAway(['A', 'B', 'C', 'D'], mixedWords)).toBe(false);
});

test('should return false when 2 words from each of 2 categories', () => {
  expect(isOneAway(['LAMP', 'TOASTER', 'MIRROR', 'TOWEL'], mockAllWords)).toBe(false);
});

test('should return true for one away with first word wrong', () => {
  expect(isOneAway(['MIRROR', 'TOASTER', 'FAN', 'ROUTER'], mockAllWords)).toBe(true);
});

test('should return true for one away with last word wrong', () => {
  expect(isOneAway(['LAMP', 'TOASTER', 'FAN', 'MIRROR'], mockAllWords)).toBe(true);
});

test('should return true for one away with middle word wrong', () => {
  expect(isOneAway(['LAMP', 'MIRROR', 'FAN', 'ROUTER'], mockAllWords)).toBe(true);
});

console.log(`\n=== Results ===`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}\n`);

process.exit(failed > 0 ? 1 : 0);
