/**
 * Core match logic utilities for the word matching game
 */

/**
 * Check if a selection of words forms a valid match (all from same category)
 * @param {Array<string>} selectedWords - Array of selected word strings
 * @param {Array<{word: string, categoryId: string}>} allWords - All words with their category IDs
 * @returns {{isMatch: boolean, categoryId: string|null}} - Match result and category ID if matched
 */
export function checkMatch(selectedWords, allWords) {
  if (!selectedWords || !Array.isArray(selectedWords)) {
    return { isMatch: false, categoryId: null };
  }

  if (!allWords || !Array.isArray(allWords)) {
    return { isMatch: false, categoryId: null };
  }

  if (selectedWords.length !== 4) {
    return { isMatch: false, categoryId: null };
  }

  // Get category IDs for selected words
  const selectedCategoryIds = selectedWords.map((word) => {
    const tile = allWords.find((t) => t.word === word);
    return tile?.categoryId;
  });

  // Check if any category ID is undefined (word not found)
  if (selectedCategoryIds.some((id) => id === undefined)) {
    return { isMatch: false, categoryId: null };
  }

  // Check if all category IDs are the same
  const allSame = selectedCategoryIds.every((id) => id === selectedCategoryIds[0]);

  return {
    isMatch: allSame,
    categoryId: allSame ? selectedCategoryIds[0] : null,
  };
}

/**
 * Check if a selection is "one away" (3 words from same category, 1 from different)
 * @param {Array<string>} selectedWords - Array of selected word strings
 * @param {Array<{word: string, categoryId: string}>} allWords - All words with their category IDs
 * @returns {boolean} - True if selection is one away from a match
 */
export function isOneAway(selectedWords, allWords) {
  if (!selectedWords || !Array.isArray(selectedWords)) {
    return false;
  }

  if (!allWords || !Array.isArray(allWords)) {
    return false;
  }

  if (selectedWords.length !== 4) {
    return false;
  }

  // Get category IDs for selected words
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
 * Validate selection constraints
 * @param {Array<string>} selectedWords - Array of selected word strings
 * @param {number} maxSelected - Maximum number of words that can be selected
 * @returns {{isValid: boolean, reason: string|null}} - Validation result
 */
export function validateSelection(selectedWords, maxSelected = 4) {
  if (!selectedWords || !Array.isArray(selectedWords)) {
    return { isValid: false, reason: 'Invalid selection array' };
  }

  if (selectedWords.length === 0) {
    return { isValid: false, reason: 'No words selected' };
  }

  if (selectedWords.length > maxSelected) {
    return { isValid: false, reason: `Too many words selected (max ${maxSelected})` };
  }

  if (selectedWords.length < maxSelected) {
    return { isValid: false, reason: `Not enough words selected (need ${maxSelected})` };
  }

  // Check for duplicates
  const uniqueWords = new Set(selectedWords);
  if (uniqueWords.size !== selectedWords.length) {
    return { isValid: false, reason: 'Duplicate words in selection' };
  }

  return { isValid: true, reason: null };
}

/**
 * Check if the game is won (all categories guessed)
 * @param {Array<Object>} guessedCategories - Array of guessed category objects
 * @param {number} totalCategories - Total number of categories in the puzzle
 * @returns {boolean} - True if all categories are guessed
 */
export function isGameWon(guessedCategories, totalCategories) {
  if (!guessedCategories || !Array.isArray(guessedCategories)) {
    return false;
  }

  if (typeof totalCategories !== 'number' || totalCategories <= 0) {
    return false;
  }

  return guessedCategories.length === totalCategories;
}

/**
 * Check if the game is lost (no lives remaining)
 * @param {number} lives - Current number of lives
 * @returns {boolean} - True if no lives remaining
 */
export function isGameLost(lives) {
  if (typeof lives !== 'number') {
    return false;
  }

  return lives <= 0;
}

/**
 * Get remaining categories that haven't been guessed
 * @param {Array<Object>} allCategories - All categories in the puzzle
 * @param {Array<Object>} guessedCategories - Categories that have been guessed
 * @returns {Array<Object>} - Array of remaining categories
 */
export function getRemainingCategories(allCategories, guessedCategories) {
  if (!allCategories || !Array.isArray(allCategories)) {
    return [];
  }

  if (!guessedCategories || !Array.isArray(guessedCategories)) {
    return allCategories;
  }

  return allCategories.filter(
    (category) => !guessedCategories.find((guessed) => guessed.id === category.id)
  );
}
