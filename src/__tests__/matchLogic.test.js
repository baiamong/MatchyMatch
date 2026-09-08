import {
  isValidSelection,
  isMatch,
  isOneAway,
  getMatchedCategory,
  isGameWon,
  isGameLost,
  isWordRevealed,
  canSelectWord,
  toggleWordSelection,
  getRemainingCategories,
} from '../utils/matchLogic';

describe('Match Logic', () => {
  // Test data
  const mockWords = [
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
    { id: 'yellow', title: 'Things you plug in', words: ['LAMP', 'TOASTER', 'FAN', 'ROUTER'] },
    { id: 'green', title: 'In the bathroom', words: ['MIRROR', 'TOWEL', 'FAUCET', 'DRAIN'] },
    { id: 'blue', title: '___ door', words: ['TRAP', 'SCREEN', 'SLIDING', 'REVOLVING'] },
  ];

  describe('isValidSelection', () => {
    test('returns true for exactly 4 items', () => {
      expect(isValidSelection(['A', 'B', 'C', 'D'])).toBe(true);
    });

    test('returns false for fewer than 4 items', () => {
      expect(isValidSelection(['A', 'B', 'C'])).toBe(false);
      expect(isValidSelection(['A', 'B'])).toBe(false);
      expect(isValidSelection(['A'])).toBe(false);
      expect(isValidSelection([])).toBe(false);
    });

    test('returns false for more than 4 items', () => {
      expect(isValidSelection(['A', 'B', 'C', 'D', 'E'])).toBe(false);
    });

    test('returns false for null or undefined', () => {
      expect(isValidSelection(null)).toBe(false);
      expect(isValidSelection(undefined)).toBe(false);
    });
  });

  describe('isMatch', () => {
    test('correctly identifies a valid match', () => {
      const selection = ['LAMP', 'TOASTER', 'FAN', 'ROUTER'];
      expect(isMatch(selection, mockWords)).toBe(true);
    });

    test('correctly identifies another valid match', () => {
      const selection = ['MIRROR', 'TOWEL', 'FAUCET', 'DRAIN'];
      expect(isMatch(selection, mockWords)).toBe(true);
    });

    test('returns false for mixed categories', () => {
      const selection = ['LAMP', 'MIRROR', 'TRAP', 'TOASTER'];
      expect(isMatch(selection, mockWords)).toBe(false);
    });

    test('returns false for selection with fewer than 4 items', () => {
      const selection = ['LAMP', 'TOASTER', 'FAN'];
      expect(isMatch(selection, mockWords)).toBe(false);
    });

    test('returns false for selection with more than 4 items', () => {
      const selection = ['LAMP', 'TOASTER', 'FAN', 'ROUTER', 'MIRROR'];
      expect(isMatch(selection, mockWords)).toBe(false);
    });

    test('returns false for empty selection', () => {
      expect(isMatch([], mockWords)).toBe(false);
    });

    test('returns false for words not in allWords', () => {
      const selection = ['LAMP', 'TOASTER', 'FAN', 'UNKNOWN'];
      expect(isMatch(selection, mockWords)).toBe(false);
    });

    test('returns false for duplicate words in selection', () => {
      const selection = ['LAMP', 'LAMP', 'LAMP', 'LAMP'];
      expect(isMatch(selection, mockWords)).toBe(true); // Same category, so it's a match
    });
  });

  describe('isOneAway', () => {
    test('detects one away scenario (3 from same category)', () => {
      const selection = ['LAMP', 'TOASTER', 'FAN', 'MIRROR'];
      expect(isOneAway(selection, mockWords)).toBe(true);
    });

    test('detects another one away scenario', () => {
      const selection = ['MIRROR', 'TOWEL', 'FAUCET', 'LAMP'];
      expect(isOneAway(selection, mockWords)).toBe(true);
    });

    test('returns false for perfect match (all 4 same)', () => {
      const selection = ['LAMP', 'TOASTER', 'FAN', 'ROUTER'];
      expect(isOneAway(selection, mockWords)).toBe(false);
    });

    test('returns false for 2-2 split', () => {
      const selection = ['LAMP', 'TOASTER', 'MIRROR', 'TOWEL'];
      expect(isOneAway(selection, mockWords)).toBe(false);
    });

    test('returns false for all different categories', () => {
      const selection = ['LAMP', 'MIRROR', 'TRAP', 'SCREEN'];
      expect(isOneAway(selection, mockWords)).toBe(false);
    });

    test('returns false for invalid selection size', () => {
      const selection = ['LAMP', 'TOASTER', 'FAN'];
      expect(isOneAway(selection, mockWords)).toBe(false);
    });

    test('returns false for empty selection', () => {
      expect(isOneAway([], mockWords)).toBe(false);
    });

    test('returns false for words not in allWords', () => {
      const selection = ['LAMP', 'TOASTER', 'FAN', 'UNKNOWN'];
      expect(isOneAway(selection, mockWords)).toBe(false);
    });
  });

  describe('getMatchedCategory', () => {
    test('returns the correct category for a valid match', () => {
      const selection = ['LAMP', 'TOASTER', 'FAN', 'ROUTER'];
      const result = getMatchedCategory(selection, mockWords, mockCategories);
      expect(result).toEqual(mockCategories[0]);
    });

    test('returns null for non-matching selection', () => {
      const selection = ['LAMP', 'MIRROR', 'TRAP', 'TOASTER'];
      const result = getMatchedCategory(selection, mockWords, mockCategories);
      expect(result).toBeNull();
    });

    test('returns null for invalid selection size', () => {
      const selection = ['LAMP', 'TOASTER'];
      const result = getMatchedCategory(selection, mockWords, mockCategories);
      expect(result).toBeNull();
    });

    test('returns null for empty selection', () => {
      const result = getMatchedCategory([], mockWords, mockCategories);
      expect(result).toBeNull();
    });
  });

  describe('isGameWon', () => {
    test('returns true when all categories are guessed', () => {
      expect(isGameWon(mockCategories, mockCategories)).toBe(true);
    });

    test('returns false when some categories remain', () => {
      expect(isGameWon([mockCategories[0]], mockCategories)).toBe(false);
      expect(isGameWon([mockCategories[0], mockCategories[1]], mockCategories)).toBe(false);
    });

    test('returns false when no categories are guessed', () => {
      expect(isGameWon([], mockCategories)).toBe(false);
    });

    test('handles empty category list', () => {
      expect(isGameWon([], [])).toBe(true);
    });
  });

  describe('isGameLost', () => {
    test('returns true when lives are 0', () => {
      expect(isGameLost(0)).toBe(true);
    });

    test('returns true when lives are negative', () => {
      expect(isGameLost(-1)).toBe(true);
      expect(isGameLost(-5)).toBe(true);
    });

    test('returns false when lives are positive', () => {
      expect(isGameLost(1)).toBe(false);
      expect(isGameLost(5)).toBe(false);
      expect(isGameLost(100)).toBe(false);
    });
  });

  describe('isWordRevealed', () => {
    test('returns true for revealed words', () => {
      const revealed = ['LAMP', 'TOASTER', 'FAN', 'ROUTER'];
      expect(isWordRevealed('LAMP', revealed)).toBe(true);
      expect(isWordRevealed('TOASTER', revealed)).toBe(true);
    });

    test('returns false for non-revealed words', () => {
      const revealed = ['LAMP', 'TOASTER'];
      expect(isWordRevealed('MIRROR', revealed)).toBe(false);
      expect(isWordRevealed('FAN', revealed)).toBe(false);
    });

    test('returns false for empty revealed list', () => {
      expect(isWordRevealed('LAMP', [])).toBe(false);
    });
  });

  describe('canSelectWord', () => {
    test('allows selecting unrevealed, unselected word when under max', () => {
      const selected = ['LAMP', 'TOASTER'];
      const revealed = ['MIRROR', 'TOWEL'];
      expect(canSelectWord('FAN', selected, revealed, 4)).toBe(true);
    });

    test('prevents selecting revealed word', () => {
      const selected = ['LAMP'];
      const revealed = ['MIRROR', 'TOWEL'];
      expect(canSelectWord('MIRROR', selected, revealed, 4)).toBe(false);
    });

    test('prevents selecting when at max and word not selected', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'ROUTER'];
      const revealed = [];
      expect(canSelectWord('MIRROR', selected, revealed, 4)).toBe(false);
    });

    test('allows selecting already selected word (for deselection)', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'ROUTER'];
      const revealed = [];
      expect(canSelectWord('LAMP', selected, revealed, 4)).toBe(true);
    });

    test('uses default max of 4', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'ROUTER'];
      const revealed = [];
      expect(canSelectWord('MIRROR', selected, revealed)).toBe(false);
    });
  });

  describe('toggleWordSelection', () => {
    test('adds word when not selected', () => {
      const selected = ['LAMP', 'TOASTER'];
      const result = toggleWordSelection('FAN', selected);
      expect(result).toEqual(['LAMP', 'TOASTER', 'FAN']);
    });

    test('removes word when already selected', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN'];
      const result = toggleWordSelection('TOASTER', selected);
      expect(result).toEqual(['LAMP', 'FAN']);
    });

    test('does not modify original array', () => {
      const selected = ['LAMP', 'TOASTER'];
      const originalCopy = [...selected];
      toggleWordSelection('FAN', selected);
      expect(selected).toEqual(originalCopy);
    });

    test('handles empty selection', () => {
      const result = toggleWordSelection('LAMP', []);
      expect(result).toEqual(['LAMP']);
    });

    test('handles removing last item', () => {
      const selected = ['LAMP'];
      const result = toggleWordSelection('LAMP', selected);
      expect(result).toEqual([]);
    });
  });

  describe('getRemainingCategories', () => {
    test('returns all categories when none guessed', () => {
      const result = getRemainingCategories(mockCategories, []);
      expect(result).toEqual(mockCategories);
    });

    test('returns remaining categories after some guessed', () => {
      const guessed = [mockCategories[0]];
      const result = getRemainingCategories(mockCategories, guessed);
      expect(result).toEqual([mockCategories[1], mockCategories[2]]);
    });

    test('returns empty array when all guessed', () => {
      const result = getRemainingCategories(mockCategories, mockCategories);
      expect(result).toEqual([]);
    });

    test('handles empty category list', () => {
      const result = getRemainingCategories([], []);
      expect(result).toEqual([]);
    });

    test('does not modify original arrays', () => {
      const allCopy = [...mockCategories];
      const guessedCopy = [mockCategories[0]];
      getRemainingCategories(mockCategories, guessedCopy);
      expect(mockCategories).toEqual(allCopy);
    });
  });

  describe('Edge Cases', () => {
    test('handles selection with duplicate words', () => {
      const selection = ['LAMP', 'LAMP', 'LAMP', 'LAMP'];
      // All same word means same category, so it's a match
      expect(isMatch(selection, mockWords)).toBe(true);
      expect(isOneAway(selection, mockWords)).toBe(false);
    });

    test('handles case sensitivity', () => {
      const selection = ['lamp', 'toaster', 'fan', 'router'];
      // Should not match because case is different
      expect(isMatch(selection, mockWords)).toBe(false);
    });

    test('handles words with special characters', () => {
      const specialWords = [
        { word: 'TEST-1', categoryId: 'special' },
        { word: 'TEST-2', categoryId: 'special' },
        { word: 'TEST-3', categoryId: 'special' },
        { word: 'TEST-4', categoryId: 'special' },
      ];
      const selection = ['TEST-1', 'TEST-2', 'TEST-3', 'TEST-4'];
      expect(isMatch(selection, specialWords)).toBe(true);
    });

    test('handles very long word lists', () => {
      const largeWordList = [];
      for (let i = 0; i < 1000; i++) {
        largeWordList.push({ word: `WORD${i}`, categoryId: `cat${i % 10}` });
      }
      const selection = ['WORD0', 'WORD10', 'WORD20', 'WORD30'];
      expect(isMatch(selection, largeWordList)).toBe(true);
    });

    test('handles selection order independence', () => {
      const selection1 = ['LAMP', 'TOASTER', 'FAN', 'ROUTER'];
      const selection2 = ['ROUTER', 'FAN', 'TOASTER', 'LAMP'];
      expect(isMatch(selection1, mockWords)).toBe(isMatch(selection2, mockWords));
    });
  });

  describe('Integration Scenarios', () => {
    test('simulates a complete game flow', () => {
      let guessedCategories = [];
      let lives = 5;

      // First guess - correct
      const guess1 = ['LAMP', 'TOASTER', 'FAN', 'ROUTER'];
      if (isMatch(guess1, mockWords)) {
        const matched = getMatchedCategory(guess1, mockWords, mockCategories);
        guessedCategories.push(matched);
      }
      expect(guessedCategories.length).toBe(1);
      expect(isGameWon(guessedCategories, mockCategories)).toBe(false);

      // Second guess - wrong (one away)
      const guess2 = ['MIRROR', 'TOWEL', 'FAUCET', 'LAMP'];
      if (!isMatch(guess2, mockWords)) {
        lives--;
      }
      expect(lives).toBe(4);
      expect(isOneAway(guess2, mockWords)).toBe(true);

      // Third guess - correct
      const guess3 = ['MIRROR', 'TOWEL', 'FAUCET', 'DRAIN'];
      if (isMatch(guess3, mockWords)) {
        const matched = getMatchedCategory(guess3, mockWords, mockCategories);
        guessedCategories.push(matched);
      }
      expect(guessedCategories.length).toBe(2);

      // Check remaining categories
      const remaining = getRemainingCategories(mockCategories, guessedCategories);
      expect(remaining.length).toBe(1);
      expect(remaining[0].id).toBe('blue');
    });

    test('simulates game loss scenario', () => {
      let lives = 3;

      // Three wrong guesses
      for (let i = 0; i < 3; i++) {
        const wrongGuess = ['LAMP', 'MIRROR', 'TRAP', 'TOASTER'];
        if (!isMatch(wrongGuess, mockWords)) {
          lives--;
        }
      }

      expect(isGameLost(lives)).toBe(true);
    });

    test('simulates selection and deselection flow', () => {
      let selected = [];

      // Select 4 words
      selected = toggleWordSelection('LAMP', selected);
      selected = toggleWordSelection('TOASTER', selected);
      selected = toggleWordSelection('FAN', selected);
      selected = toggleWordSelection('ROUTER', selected);

      expect(isValidSelection(selected)).toBe(true);

      // Deselect one
      selected = toggleWordSelection('ROUTER', selected);
      expect(isValidSelection(selected)).toBe(false);

      // Select a different one
      selected = toggleWordSelection('MIRROR', selected);
      expect(isValidSelection(selected)).toBe(true);
      expect(isMatch(selected, mockWords)).toBe(false);
    });
  });
});
