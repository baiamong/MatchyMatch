/**
 * Match logic utilities for the game
 */

/**
 * Check if a selection is valid (exactly 4 items)
 * @param {Array} selection - Array of selected words
 * @returns {boolean} - True if selection has exactly 4 items
 */
export function isValidSelection(selection) {
  return Boolean(selection && selection.length === 4);
}

/**
 * Check if all selected items belong to the same category
 * @param {Array} selectedWords - Array of selected word strings
 * @param {Array} allWords - Array of {word, categoryId} objects
 * @returns {boolean} - True if all words belong to the same category
 */
export function isMatch(selectedWords, allWords) {
  if (!isValidSelection(selectedWords)) {
    return false;
  }

  const categoryIds = selectedWords.map((word) => {
    const tile = allWords.find((t) => t.word === word);
    return tile?.categoryId;
  });

  // Check if any categoryId is undefined
  if (categoryIds.some((id) => id === undefined)) {
    return false;
  }

  // Check if all categoryIds are the same
  return categoryIds.every((id) => id === categoryIds[0]);
}

/**
 * Check if the selection is "one away" (exactly 3 items from same category)
 * @param {Array} selectedWords - Array of selected word strings
 * @param {Array} allWords - Array of {word, categoryId} objects
 * @returns {boolean} - True if exactly 3 words belong to the same category
 */
export function isOneAway(selectedWords, allWords) {
  if (!isValidSelection(selectedWords)) {
    return false;
  }

  const categoryIds = selectedWords.map((word) => {
    const tile = allWords.find((t) => t.word === word);
    return tile?.categoryId;
  });

  // Check if any categoryId is undefined
  if (categoryIds.some((id) => id === undefined)) {
    return false;
  }

  // Count occurrences of each category
  const categoryCounts = {};
  categoryIds.forEach((id) => {
    categoryCounts[id] = (categoryCounts[id] || 0) + 1;
  });

  // Check if any category appears exactly 3 times
  return Object.values(categoryCounts).some((count) => count === 3);
}

/**
 * Get the matched category from a valid selection
 * @param {Array} selectedWords - Array of selected word strings
 * @param {Array} allWords - Array of {word, categoryId} objects
 * @param {Array} categories - Array of category objects
 * @returns {Object|null} - The matched category object or null
 */
export function getMatchedCategory(selectedWords, allWords, categories) {
  if (!isMatch(selectedWords, allWords)) {
    return null;
  }

  const firstWord = selectedWords[0];
  const tile = allWords.find((t) => t.word === firstWord);
  const categoryId = tile?.categoryId;

  return categories.find((c) => c.id === categoryId) || null;
}

/**
 * Check if the game is won (all categories have been guessed)
 * @param {Array} guessedCategories - Array of guessed category objects
 * @param {Array} allCategories - Array of all category objects
 * @returns {boolean} - True if all categories have been guessed
 */
export function isGameWon(guessedCategories, allCategories) {
  return guessedCategories.length === allCategories.length;
}

/**
 * Check if the game is lost (no lives remaining)
 * @param {number} lives - Current number of lives
 * @returns {boolean} - True if no lives remaining
 */
export function isGameLost(lives) {
  return lives <= 0;
}

/**
 * Check if a word is already revealed
 * @param {string} word - The word to check
 * @param {Array} revealedWords - Array of revealed word strings
 * @returns {boolean} - True if word is revealed
 */
export function isWordRevealed(word, revealedWords) {
  return revealedWords.includes(word);
}

/**
 * Check if a word can be selected
 * @param {string} word - The word to check
 * @param {Array} selectedWords - Array of currently selected words
 * @param {Array} revealedWords - Array of revealed words
 * @param {number} maxSelected - Maximum number of selections allowed
 * @returns {boolean} - True if word can be selected
 */
export function canSelectWord(word, selectedWords, revealedWords, maxSelected = 4) {
  // Can't select if already revealed
  if (isWordRevealed(word, revealedWords)) {
    return false;
  }

  // Can't select if already selected and at max
  if (!selectedWords.includes(word) && selectedWords.length >= maxSelected) {
    return false;
  }

  return true;
}

/**
 * Toggle word selection
 * @param {string} word - The word to toggle
 * @param {Array} selectedWords - Array of currently selected words
 * @returns {Array} - New selection array
 */
export function toggleWordSelection(word, selectedWords) {
  if (selectedWords.includes(word)) {
    return selectedWords.filter((w) => w !== word);
  }
  return [...selectedWords, word];
}

/**
 * Get remaining categories that haven't been guessed
 * @param {Array} allCategories - Array of all category objects
 * @param {Array} guessedCategories - Array of guessed category objects
 * @returns {Array} - Array of remaining category objects
 */
export function getRemainingCategories(allCategories, guessedCategories) {
  return allCategories.filter(
    (category) => !guessedCategories.find((g) => g.id === category.id)
  );
}
