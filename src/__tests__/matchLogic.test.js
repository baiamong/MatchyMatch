/**
 * @jest-environment node
 */
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
} from '../utils/matchLogic';

describe('Match Logic', () => {
  // Mock puzzle data for testing
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

  describe('isValidSelection', () => {
    it('should return true for exactly 4 words', () => {
      expect(isValidSelection(['LAMP', 'TOASTER', 'FAN', 'ROUTER'])).toBe(true);
    });

    it('should return false for less than 4 words', () => {
      expect(isValidSelection(['LAMP', 'TOASTER', 'FAN'])).toBe(false);
      expect(isValidSelection(['LAMP'])).toBe(false);
      expect(isValidSelection([])).toBe(false);
    });

    it('should return false for more than 4 words', () => {
      expect(isValidSelection(['LAMP', 'TOASTER', 'FAN', 'ROUTER', 'MIRROR'])).toBe(false);
    });

    it('should return false for non-array inputs', () => {
      expect(isValidSelection(null)).toBe(false);
      expect(isValidSelection(undefined)).toBe(false);
      expect(isValidSelection('LAMP')).toBe(false);
      expect(isValidSelection(4)).toBe(false);
    });
  });

  describe('checkMatch', () => {
    it('should return true for a correct match (all 4 words in same category)', () => {
      const result = checkMatch(['LAMP', 'TOASTER', 'FAN', 'ROUTER'], mockAllWords);
      expect(result.isMatch).toBe(true);
      expect(result.categoryId).toBe('yellow');
    });

    it('should return false for completely wrong match (0 words correct)', () => {
      const result = checkMatch(['LAMP', 'MIRROR', 'TRAP', 'SCREEN'], mockAllWords);
      expect(result.isMatch).toBe(false);
      expect(result.categoryId).toBe(null);
    });

    it('should return false for "one away" scenario (3 out of 4 correct)', () => {
      const result = checkMatch(['LAMP', 'TOASTER', 'FAN', 'MIRROR'], mockAllWords);
      expect(result.isMatch).toBe(false);
      expect(result.categoryId).toBe(null);
    });

    it('should return false for 2 out of 4 correct', () => {
      const result = checkMatch(['LAMP', 'TOASTER', 'MIRROR', 'TOWEL'], mockAllWords);
      expect(result.isMatch).toBe(false);
      expect(result.categoryId).toBe(null);
    });

    it('should return false for invalid selection (not 4 words)', () => {
      const result = checkMatch(['LAMP', 'TOASTER'], mockAllWords);
      expect(result.isMatch).toBe(false);
      expect(result.categoryId).toBe(null);
    });

    it('should return false for words not in the puzzle', () => {
      const result = checkMatch(['INVALID', 'WORDS', 'NOT', 'FOUND'], mockAllWords);
      expect(result.isMatch).toBe(false);
      expect(result.categoryId).toBe(null);
    });

    it('should handle empty allWords array', () => {
      const result = checkMatch(['LAMP', 'TOASTER', 'FAN', 'ROUTER'], []);
      expect(result.isMatch).toBe(false);
      expect(result.categoryId).toBe(null);
    });

    it('should handle duplicate words in selection', () => {
      const result = checkMatch(['LAMP', 'LAMP', 'LAMP', 'LAMP'], mockAllWords);
      expect(result.isMatch).toBe(true);
      expect(result.categoryId).toBe('yellow');
    });
  });

  describe('isOneAway', () => {
    it('should return true when 3 out of 4 words match a category', () => {
      expect(isOneAway(['LAMP', 'TOASTER', 'FAN', 'MIRROR'], mockAllWords)).toBe(true);
      expect(isOneAway(['MIRROR', 'TOWEL', 'FAUCET', 'LAMP'], mockAllWords)).toBe(true);
    });

    it('should return false for a perfect match (4 out of 4)', () => {
      expect(isOneAway(['LAMP', 'TOASTER', 'FAN', 'ROUTER'], mockAllWords)).toBe(false);
    });

    it('should return false for 2 out of 4 correct', () => {
      expect(isOneAway(['LAMP', 'TOASTER', 'MIRROR', 'TOWEL'], mockAllWords)).toBe(false);
    });

    it('should return false for completely wrong selection', () => {
      expect(isOneAway(['LAMP', 'MIRROR', 'TRAP', 'SCREEN'], mockAllWords)).toBe(false);
    });

    it('should return false for invalid selection (not 4 words)', () => {
      expect(isOneAway(['LAMP', 'TOASTER', 'FAN'], mockAllWords)).toBe(false);
    });

    it('should return false for words not in the puzzle', () => {
      expect(isOneAway(['INVALID', 'WORDS', 'NOT', 'FOUND'], mockAllWords)).toBe(false);
    });

    it('should handle edge case with 2 words from one category and 2 from another', () => {
      expect(isOneAway(['LAMP', 'TOASTER', 'MIRROR', 'TOWEL'], mockAllWords)).toBe(false);
    });
  });

  describe('isCategoryGuessed', () => {
    const guessedCategories = [
      { id: 'yellow', color: 'yellow', title: 'Things you plug in', words: ['LAMP', 'TOASTER', 'FAN', 'ROUTER'] },
      { id: 'green', color: 'green', title: 'In the bathroom', words: ['MIRROR', 'TOWEL', 'FAUCET', 'DRAIN'] },
    ];

    it('should return true for already guessed category', () => {
      expect(isCategoryGuessed('yellow', guessedCategories)).toBe(true);
      expect(isCategoryGuessed('green', guessedCategories)).toBe(true);
    });

    it('should return false for not yet guessed category', () => {
      expect(isCategoryGuessed('blue', guessedCategories)).toBe(false);
      expect(isCategoryGuessed('purple', guessedCategories)).toBe(false);
    });

    it('should handle empty guessed categories array', () => {
      expect(isCategoryGuessed('yellow', [])).toBe(false);
    });

    it('should handle null or undefined inputs', () => {
      expect(isCategoryGuessed(null, guessedCategories)).toBe(false);
      expect(isCategoryGuessed('yellow', null)).toBe(false);
    });
  });

  describe('isGameWon', () => {
    it('should return true when all categories are guessed', () => {
      const guessedCategories = [
        { id: 'yellow' },
        { id: 'green' },
        { id: 'blue' },
      ];
      expect(isGameWon(guessedCategories, 3)).toBe(true);
    });

    it('should return false when not all categories are guessed', () => {
      const guessedCategories = [
        { id: 'yellow' },
        { id: 'green' },
      ];
      expect(isGameWon(guessedCategories, 3)).toBe(false);
    });

    it('should return false when no categories are guessed', () => {
      expect(isGameWon([], 3)).toBe(false);
    });

    it('should handle edge case with 0 total categories', () => {
      expect(isGameWon([], 0)).toBe(true);
    });
  });

  describe('isGameLost', () => {
    it('should return true when lives are 0', () => {
      expect(isGameLost(0)).toBe(true);
    });

    it('should return true when lives are negative', () => {
      expect(isGameLost(-1)).toBe(true);
    });

    it('should return false when lives are positive', () => {
      expect(isGameLost(1)).toBe(false);
      expect(isGameLost(5)).toBe(false);
    });
  });

  describe('decrementLives', () => {
    it('should decrement lives by 1', () => {
      expect(decrementLives(5)).toBe(4);
      expect(decrementLives(3)).toBe(2);
      expect(decrementLives(1)).toBe(0);
    });

    it('should not go below 0', () => {
      expect(decrementLives(0)).toBe(0);
      expect(decrementLives(-1)).toBe(0);
    });
  });

  describe('validatePuzzle', () => {
    it('should validate a correct puzzle', () => {
      const result = validatePuzzle(mockPuzzle);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject null or undefined puzzle', () => {
      const result1 = validatePuzzle(null);
      expect(result1.isValid).toBe(false);
      expect(result1.errors).toContain('Puzzle is null or undefined');

      const result2 = validatePuzzle(undefined);
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain('Puzzle is null or undefined');
    });

    it('should reject puzzle without categories array', () => {
      const result = validatePuzzle({ id: 1 });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Puzzle must have a categories array');
    });

    it('should reject puzzle with empty categories array', () => {
      const result = validatePuzzle({ id: 1, categories: [] });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Puzzle must have at least one category');
    });

    it('should reject category without id', () => {
      const invalidPuzzle = {
        id: 1,
        categories: [
          { color: 'yellow', title: 'Test', words: ['A', 'B', 'C', 'D'] },
        ],
      };
      const result = validatePuzzle(invalidPuzzle);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('missing an id'))).toBe(true);
    });

    it('should reject category without words array', () => {
      const invalidPuzzle = {
        id: 1,
        categories: [
          { id: 'yellow', color: 'yellow', title: 'Test' },
        ],
      };
      const result = validatePuzzle(invalidPuzzle);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('missing a words array'))).toBe(true);
    });

    it('should reject category with wrong number of words', () => {
      const invalidPuzzle = {
        id: 1,
        categories: [
          { id: 'yellow', color: 'yellow', title: 'Test', words: ['A', 'B', 'C'] },
        ],
      };
      const result = validatePuzzle(invalidPuzzle);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('must have exactly 4 words'))).toBe(true);
    });

    it('should reject puzzle with duplicate words', () => {
      const invalidPuzzle = {
        id: 1,
        categories: [
          { id: 'yellow', color: 'yellow', title: 'Test 1', words: ['LAMP', 'B', 'C', 'D'] },
          { id: 'green', color: 'green', title: 'Test 2', words: ['LAMP', 'E', 'F', 'G'] },
        ],
      };
      const result = validatePuzzle(invalidPuzzle);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Duplicate word found'))).toBe(true);
    });

    it('should handle multiple validation errors', () => {
      const invalidPuzzle = {
        id: 1,
        categories: [
          { color: 'yellow', title: 'Test 1', words: ['A', 'B'] },
          { id: 'green', title: 'Test 2', words: ['A', 'C', 'D', 'E'] },
        ],
      };
      const result = validatePuzzle(invalidPuzzle);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('getCorrectCount', () => {
    it('should return 4 for a perfect match', () => {
      expect(getCorrectCount(['LAMP', 'TOASTER', 'FAN', 'ROUTER'], mockAllWords, 'yellow')).toBe(4);
    });

    it('should return 3 for "one away"', () => {
      expect(getCorrectCount(['LAMP', 'TOASTER', 'FAN', 'MIRROR'], mockAllWords, 'yellow')).toBe(3);
    });

    it('should return 2 for half correct', () => {
      expect(getCorrectCount(['LAMP', 'TOASTER', 'MIRROR', 'TOWEL'], mockAllWords, 'yellow')).toBe(2);
    });

    it('should return 1 for one correct', () => {
      expect(getCorrectCount(['LAMP', 'MIRROR', 'TRAP', 'SCREEN'], mockAllWords, 'yellow')).toBe(1);
    });

    it('should return 0 for no correct words', () => {
      expect(getCorrectCount(['MIRROR', 'TOWEL', 'FAUCET', 'DRAIN'], mockAllWords, 'yellow')).toBe(0);
    });

    it('should return 0 for invalid selection', () => {
      expect(getCorrectCount(['LAMP', 'TOASTER'], mockAllWords, 'yellow')).toBe(0);
    });

    it('should return 0 for words not in puzzle', () => {
      expect(getCorrectCount(['INVALID', 'WORDS', 'NOT', 'FOUND'], mockAllWords, 'yellow')).toBe(0);
    });
  });

  describe('Edge Cases and Integration', () => {
    it('should handle empty selection gracefully', () => {
      expect(isValidSelection([])).toBe(false);
      expect(checkMatch([], mockAllWords).isMatch).toBe(false);
      expect(isOneAway([], mockAllWords)).toBe(false);
    });

    it('should handle selection with null/undefined values', () => {
      expect(isValidSelection([null, null, null, null])).toBe(true); // 4 items, but...
      const result = checkMatch([null, null, null, null], mockAllWords);
      expect(result.isMatch).toBe(false); // ...they won't match anything
    });

    it('should handle case sensitivity', () => {
      const result = checkMatch(['lamp', 'toaster', 'fan', 'router'], mockAllWords);
      expect(result.isMatch).toBe(false); // lowercase won't match uppercase
    });

    it('should handle selection with extra whitespace', () => {
      const result = checkMatch(['LAMP ', ' TOASTER', ' FAN ', 'ROUTER'], mockAllWords);
      expect(result.isMatch).toBe(false); // whitespace matters
    });

    it('should correctly identify game state transitions', () => {
      // Start with 5 lives
      let lives = 5;
      expect(isGameLost(lives)).toBe(false);

      // Make 4 wrong guesses
      lives = decrementLives(lives); // 4
      lives = decrementLives(lives); // 3
      lives = decrementLives(lives); // 2
      lives = decrementLives(lives); // 1
      expect(isGameLost(lives)).toBe(false);

      // Final wrong guess
      lives = decrementLives(lives); // 0
      expect(isGameLost(lives)).toBe(true);
    });

    it('should correctly track game progress', () => {
      const guessedCategories = [];
      expect(isGameWon(guessedCategories, 3)).toBe(false);

      guessedCategories.push({ id: 'yellow' });
      expect(isGameWon(guessedCategories, 3)).toBe(false);

      guessedCategories.push({ id: 'green' });
      expect(isGameWon(guessedCategories, 3)).toBe(false);

      guessedCategories.push({ id: 'blue' });
      expect(isGameWon(guessedCategories, 3)).toBe(true);
    });
  });
});
