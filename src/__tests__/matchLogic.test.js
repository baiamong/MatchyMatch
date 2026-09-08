import {
  checkMatch,
  isOneAway,
  validateSelection,
  isGameWon,
  isGameLost,
  getRemainingCategories,
} from '../utils/matchLogic';

describe('Match Logic', () => {
  // Test data fixtures
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

  const mockCategories = [
    { id: 'yellow', color: 'yellow', title: 'Things you plug in', words: ['LAMP', 'TOASTER', 'FAN', 'ROUTER'] },
    { id: 'green', color: 'green', title: 'In the bathroom', words: ['MIRROR', 'TOWEL', 'FAUCET', 'DRAIN'] },
    { id: 'blue', color: 'blue', title: '___ door', words: ['TRAP', 'SCREEN', 'SLIDING', 'REVOLVING'] },
  ];

  describe('checkMatch', () => {
    it('should return true for a valid match (all 4 words from same category)', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'ROUTER'];
      const result = checkMatch(selected, mockAllWords);
      expect(result.isMatch).toBe(true);
      expect(result.categoryId).toBe('yellow');
    });

    it('should return false for words from different categories', () => {
      const selected = ['LAMP', 'MIRROR', 'TRAP', 'TOASTER'];
      const result = checkMatch(selected, mockAllWords);
      expect(result.isMatch).toBe(false);
      expect(result.categoryId).toBe(null);
    });

    it('should return false when selecting fewer than 4 words', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN'];
      const result = checkMatch(selected, mockAllWords);
      expect(result.isMatch).toBe(false);
      expect(result.categoryId).toBe(null);
    });

    it('should return false when selecting more than 4 words', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'ROUTER', 'MIRROR'];
      const result = checkMatch(selected, mockAllWords);
      expect(result.isMatch).toBe(false);
      expect(result.categoryId).toBe(null);
    });

    it('should return false for empty selection', () => {
      const result = checkMatch([], mockAllWords);
      expect(result.isMatch).toBe(false);
      expect(result.categoryId).toBe(null);
    });

    it('should return false when selectedWords is null', () => {
      const result = checkMatch(null, mockAllWords);
      expect(result.isMatch).toBe(false);
      expect(result.categoryId).toBe(null);
    });

    it('should return false when selectedWords is undefined', () => {
      const result = checkMatch(undefined, mockAllWords);
      expect(result.isMatch).toBe(false);
      expect(result.categoryId).toBe(null);
    });

    it('should return false when allWords is null', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'ROUTER'];
      const result = checkMatch(selected, null);
      expect(result.isMatch).toBe(false);
      expect(result.categoryId).toBe(null);
    });

    it('should return false when allWords is undefined', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'ROUTER'];
      const result = checkMatch(selected, undefined);
      expect(result.isMatch).toBe(false);
      expect(result.categoryId).toBe(null);
    });

    it('should return false when selected word does not exist in allWords', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'NONEXISTENT'];
      const result = checkMatch(selected, mockAllWords);
      expect(result.isMatch).toBe(false);
      expect(result.categoryId).toBe(null);
    });

    it('should handle different valid category matches', () => {
      const selected = ['MIRROR', 'TOWEL', 'FAUCET', 'DRAIN'];
      const result = checkMatch(selected, mockAllWords);
      expect(result.isMatch).toBe(true);
      expect(result.categoryId).toBe('green');
    });
  });

  describe('isOneAway', () => {
    it('should return true when 3 words are from same category and 1 is different', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'MIRROR'];
      const result = isOneAway(selected, mockAllWords);
      expect(result).toBe(true);
    });

    it('should return false for a perfect match (all 4 from same category)', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'ROUTER'];
      const result = isOneAway(selected, mockAllWords);
      expect(result).toBe(false);
    });

    it('should return false when 2 words are from one category and 2 from another', () => {
      const selected = ['LAMP', 'TOASTER', 'MIRROR', 'TOWEL'];
      const result = isOneAway(selected, mockAllWords);
      expect(result).toBe(false);
    });

    it('should return false when all 4 words are from different categories', () => {
      const selected = ['LAMP', 'MIRROR', 'TRAP', 'SCREEN'];
      const result = isOneAway(selected, mockAllWords);
      expect(result).toBe(false);
    });

    it('should return false for fewer than 4 words', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN'];
      const result = isOneAway(selected, mockAllWords);
      expect(result).toBe(false);
    });

    it('should return false for more than 4 words', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'ROUTER', 'MIRROR'];
      const result = isOneAway(selected, mockAllWords);
      expect(result).toBe(false);
    });

    it('should return false for empty selection', () => {
      const result = isOneAway([], mockAllWords);
      expect(result).toBe(false);
    });

    it('should return false when selectedWords is null', () => {
      const result = isOneAway(null, mockAllWords);
      expect(result).toBe(false);
    });

    it('should return false when allWords is null', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'MIRROR'];
      const result = isOneAway(selected, null);
      expect(result).toBe(false);
    });

    it('should return false when a selected word does not exist', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'NONEXISTENT'];
      const result = isOneAway(selected, mockAllWords);
      expect(result).toBe(false);
    });

    it('should handle one away with different category combinations', () => {
      const selected = ['MIRROR', 'TOWEL', 'FAUCET', 'LAMP'];
      const result = isOneAway(selected, mockAllWords);
      expect(result).toBe(true);
    });
  });

  describe('validateSelection', () => {
    it('should return valid for exactly 4 unique words', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'ROUTER'];
      const result = validateSelection(selected);
      expect(result.isValid).toBe(true);
      expect(result.reason).toBe(null);
    });

    it('should return invalid for fewer than 4 words', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN'];
      const result = validateSelection(selected);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('Not enough');
    });

    it('should return invalid for more than 4 words', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'ROUTER', 'MIRROR'];
      const result = validateSelection(selected);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('Too many');
    });

    it('should return invalid for empty selection', () => {
      const result = validateSelection([]);
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('No words selected');
    });

    it('should return invalid for null selection', () => {
      const result = validateSelection(null);
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('Invalid selection array');
    });

    it('should return invalid for undefined selection', () => {
      const result = validateSelection(undefined);
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('Invalid selection array');
    });

    it('should return invalid for duplicate words', () => {
      const selected = ['LAMP', 'LAMP', 'TOASTER', 'FAN'];
      const result = validateSelection(selected);
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('Duplicate words in selection');
    });

    it('should support custom maxSelected parameter', () => {
      const selected = ['LAMP', 'TOASTER'];
      const result = validateSelection(selected, 2);
      expect(result.isValid).toBe(true);
      expect(result.reason).toBe(null);
    });

    it('should validate against custom maxSelected', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN'];
      const result = validateSelection(selected, 2);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('Too many');
    });
  });

  describe('isGameWon', () => {
    it('should return true when all categories are guessed', () => {
      const guessed = mockCategories;
      const result = isGameWon(guessed, 3);
      expect(result).toBe(true);
    });

    it('should return false when not all categories are guessed', () => {
      const guessed = [mockCategories[0], mockCategories[1]];
      const result = isGameWon(guessed, 3);
      expect(result).toBe(false);
    });

    it('should return false when no categories are guessed', () => {
      const result = isGameWon([], 3);
      expect(result).toBe(false);
    });

    it('should return false when guessedCategories is null', () => {
      const result = isGameWon(null, 3);
      expect(result).toBe(false);
    });

    it('should return false when guessedCategories is undefined', () => {
      const result = isGameWon(undefined, 3);
      expect(result).toBe(false);
    });

    it('should return false when totalCategories is 0', () => {
      const result = isGameWon([], 0);
      expect(result).toBe(false);
    });

    it('should return false when totalCategories is negative', () => {
      const result = isGameWon([], -1);
      expect(result).toBe(false);
    });

    it('should return false when totalCategories is not a number', () => {
      const result = isGameWon([], 'three');
      expect(result).toBe(false);
    });

    it('should handle edge case of single category puzzle', () => {
      const guessed = [mockCategories[0]];
      const result = isGameWon(guessed, 1);
      expect(result).toBe(true);
    });
  });

  describe('isGameLost', () => {
    it('should return true when lives is 0', () => {
      const result = isGameLost(0);
      expect(result).toBe(true);
    });

    it('should return true when lives is negative', () => {
      const result = isGameLost(-1);
      expect(result).toBe(true);
    });

    it('should return false when lives is positive', () => {
      const result = isGameLost(1);
      expect(result).toBe(false);
    });

    it('should return false when lives is 5 (normal mode)', () => {
      const result = isGameLost(5);
      expect(result).toBe(false);
    });

    it('should return false when lives is 3 (hard mode)', () => {
      const result = isGameLost(3);
      expect(result).toBe(false);
    });

    it('should return false when lives is not a number', () => {
      const result = isGameLost('zero');
      expect(result).toBe(false);
    });

    it('should return false when lives is null', () => {
      const result = isGameLost(null);
      expect(result).toBe(false);
    });

    it('should return false when lives is undefined', () => {
      const result = isGameLost(undefined);
      expect(result).toBe(false);
    });
  });

  describe('getRemainingCategories', () => {
    it('should return all categories when none are guessed', () => {
      const result = getRemainingCategories(mockCategories, []);
      expect(result).toEqual(mockCategories);
      expect(result.length).toBe(3);
    });

    it('should return remaining categories after some are guessed', () => {
      const guessed = [mockCategories[0]];
      const result = getRemainingCategories(mockCategories, guessed);
      expect(result).toEqual([mockCategories[1], mockCategories[2]]);
      expect(result.length).toBe(2);
    });

    it('should return empty array when all categories are guessed', () => {
      const result = getRemainingCategories(mockCategories, mockCategories);
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should return all categories when guessedCategories is null', () => {
      const result = getRemainingCategories(mockCategories, null);
      expect(result).toEqual(mockCategories);
    });

    it('should return all categories when guessedCategories is undefined', () => {
      const result = getRemainingCategories(mockCategories, undefined);
      expect(result).toEqual(mockCategories);
    });

    it('should return empty array when allCategories is null', () => {
      const result = getRemainingCategories(null, []);
      expect(result).toEqual([]);
    });

    it('should return empty array when allCategories is undefined', () => {
      const result = getRemainingCategories(undefined, []);
      expect(result).toEqual([]);
    });

    it('should handle multiple guessed categories', () => {
      const guessed = [mockCategories[0], mockCategories[2]];
      const result = getRemainingCategories(mockCategories, guessed);
      expect(result).toEqual([mockCategories[1]]);
      expect(result.length).toBe(1);
    });

    it('should correctly identify categories by id', () => {
      const guessed = [{ id: 'yellow', color: 'yellow', title: 'Different title', words: [] }];
      const result = getRemainingCategories(mockCategories, guessed);
      expect(result.length).toBe(2);
      expect(result.find(c => c.id === 'yellow')).toBeUndefined();
    });
  });

  describe('Edge Cases - Integration', () => {
    it('should handle a complete game flow scenario', () => {
      // Start with no guesses
      expect(isGameWon([], 3)).toBe(false);
      expect(isGameLost(5)).toBe(false);

      // Make a correct guess
      const guess1 = ['LAMP', 'TOASTER', 'FAN', 'ROUTER'];
      const match1 = checkMatch(guess1, mockAllWords);
      expect(match1.isMatch).toBe(true);

      // Make an incorrect guess (one away)
      const guess2 = ['MIRROR', 'TOWEL', 'FAUCET', 'LAMP'];
      const match2 = checkMatch(guess2, mockAllWords);
      expect(match2.isMatch).toBe(false);
      expect(isOneAway(guess2, mockAllWords)).toBe(true);

      // Check game state after losing a life
      expect(isGameLost(4)).toBe(false);

      // Win the game
      const guessed = mockCategories;
      expect(isGameWon(guessed, 3)).toBe(true);
    });

    it('should handle losing scenario', () => {
      let lives = 3; // Hard mode

      // Make 3 wrong guesses
      for (let i = 0; i < 3; i++) {
        const wrongGuess = ['LAMP', 'MIRROR', 'TRAP', 'TOASTER'];
        const match = checkMatch(wrongGuess, mockAllWords);
        expect(match.isMatch).toBe(false);
        lives--;
      }

      expect(isGameLost(lives)).toBe(true);
    });

    it('should validate selection before checking match', () => {
      const selected = ['LAMP', 'TOASTER'];
      const validation = validateSelection(selected);
      expect(validation.isValid).toBe(false);

      // Should not check match if validation fails
      if (!validation.isValid) {
        const match = checkMatch(selected, mockAllWords);
        expect(match.isMatch).toBe(false);
      }
    });

    it('should handle all words from different categories (worst case)', () => {
      const selected = ['LAMP', 'MIRROR', 'TRAP', 'SCREEN'];
      const match = checkMatch(selected, mockAllWords);
      expect(match.isMatch).toBe(false);
      expect(isOneAway(selected, mockAllWords)).toBe(false);
    });

    it('should handle 2-2 split (two words from each of two categories)', () => {
      const selected = ['LAMP', 'TOASTER', 'MIRROR', 'TOWEL'];
      const match = checkMatch(selected, mockAllWords);
      expect(match.isMatch).toBe(false);
      expect(isOneAway(selected, mockAllWords)).toBe(false);
    });
  });
});
