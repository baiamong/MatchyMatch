/**
 * Core match logic utilities for the connection game
 */

/**
 * Check if a selection is valid (exactly 4 words)
 * @param {Array} selected - Array of selected words
 * @returns {boolean} - True if selection is valid
 */
export function isValidSelection(selected) {
  if (!Array.isArray(selected)) return false;
  return selected.length === 4;
}

/**
 * Check if all selected words belong to the same category
 * @param {Array} selectedWords - Array of selected word strings
 * @param {Array} allWords - Array of {word, categoryId} objects
 * @returns {Object} - {isMatch: boolean, categoryId: string|null}
 */
export function checkMatch(selectedWords, allWords) {
  if (!isValidSelection(selectedWords)) {
    return { isMatch: false, categoryId: null };
  }

  const selectedCategoryIds = selectedWords.map((word) => {
    const tile = allWords.find((t) => t.word === word);
    return tile?.categoryId;
  });

  // Check if any category ID is undefined (word not found)
  if (selectedCategoryIds.some((id) => id === undefined)) {
    return { isMatch: false, categoryId: null };
  }

  const allSame = selectedCategoryIds.every((id) => id === selectedCategoryIds[0]);

  return {
    isMatch: allSame,
    categoryId: allSame ? selectedCategoryIds[0] : null,
  };
}

/**
 * Check if the selection is "one away" (3 out of 4 words match a category)
 * @param {Array} selectedWords - Array of selected word strings
 * @param {Array} allWords - Array of {word, categoryId} objects
 * @returns {boolean} - True if one away
 */
export function isOneAway(selectedWords, allWords) {
  if (!isValidSelection(selectedWords)) {
    return false;
  }

  const selectedCategoryIds = selectedWords.map((word) => {
    const tile = allWords.find((t) => t.word === word);
    return tile?.categoryId;
  });

  // Check if any category ID is undefined
  if (selectedCategoryIds.some((id) => id === undefined)) {
    return false;
  }

  // Check if any category appears exactly 3 times
  return selectedCategoryIds.some(
    (id) => selectedCategoryIds.filter((x) => x === id).length === 3
  );
}

/**
 * Check if a category has already been guessed
 * @param {string} categoryId - The category ID to check
 * @param {Array} guessedCategories - Array of already guessed category objects
 * @returns {boolean} - True if already guessed
 */
export function isCategoryGuessed(categoryId, guessedCategories) {
  if (!guessedCategories || !Array.isArray(guessedCategories)) {
    return false;
  }
  return guessedCategories.some((cat) => cat.id === categoryId);
}

/**
 * Check if the game is won (all categories guessed)
 * @param {Array} guessedCategories - Array of guessed category objects
 * @param {number} totalCategories - Total number of categories in the puzzle
 * @returns {boolean} - True if game is won
 */
export function isGameWon(guessedCategories, totalCategories) {
  return guessedCategories.length === totalCategories;
}

/**
 * Check if the game is lost (no lives remaining)
 * @param {number} lives - Current number of lives
 * @returns {boolean} - True if game is lost
 */
export function isGameLost(lives) {
  return lives <= 0;
}

/**
 * Calculate remaining lives after a wrong guess
 * @param {number} currentLives - Current number of lives
 * @returns {number} - New number of lives
 */
export function decrementLives(currentLives) {
  return Math.max(0, currentLives - 1);
}

/**
 * Validate puzzle structure
 * @param {Object} puzzle - The puzzle object
 * @returns {Object} - {isValid: boolean, errors: Array}
 */
export function validatePuzzle(puzzle) {
  const errors = [];

  if (!puzzle) {
    errors.push('Puzzle is null or undefined');
    return { isValid: false, errors };
  }

  if (!puzzle.categories || !Array.isArray(puzzle.categories)) {
    errors.push('Puzzle must have a categories array');
    return { isValid: false, errors };
  }

  if (puzzle.categories.length === 0) {
    errors.push('Puzzle must have at least one category');
  }

  const allWords = [];
  puzzle.categories.forEach((category, index) => {
    if (!category.id) {
      errors.push(`Category at index ${index} is missing an id`);
    }
    if (!category.words || !Array.isArray(category.words)) {
      errors.push(`Category at index ${index} is missing a words array`);
    } else {
      if (category.words.length !== 4) {
        errors.push(`Category "${category.id}" must have exactly 4 words, has ${category.words.length}`);
      }
      category.words.forEach((word) => {
        if (allWords.includes(word)) {
          errors.push(`Duplicate word found: "${word}"`);
        }
        allWords.push(word);
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get the number of correct words in a selection for a given category
 * @param {Array} selectedWords - Array of selected word strings
 * @param {Array} allWords - Array of {word, categoryId} objects
 * @param {string} categoryId - The category ID to check against
 * @returns {number} - Number of correct words (0-4)
 */
export function getCorrectCount(selectedWords, allWords, categoryId) {
  if (!isValidSelection(selectedWords)) {
    return 0;
  }

  return selectedWords.filter((word) => {
    const tile = allWords.find((t) => t.word === word);
    return tile?.categoryId === categoryId;
  }).length;
}
