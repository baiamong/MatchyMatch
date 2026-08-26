# Crossword Game - Bug Report

## Game Overview
**File:** `src/components/crossword/CrosswordBoard.jsx`  
**Size:** 767 lines  
**Description:** The largest game in the repository - a 5x5 crossword puzzle game with multiple puzzles, clue navigation, and keyboard/touch input support.

---

## 🔴 Critical Bugs

### 1. **Race Condition in State Updates During Rapid Input**
**Location:** Lines 545-570 (handleKeyDown function)  
**Severity:** Critical  
**Description:**  
When typing rapidly, multiple state updates (`setLetters`, `updateSolvedClues`, `checkWin`, `advanceCell`) happen in quick succession without proper batching. This can cause:
- Letters to be skipped or duplicated
- Active cell to jump incorrectly
- Win condition to be checked with stale state

**Example:**
```javascript
next[r][c] = key;
setLetters(next);
updateSolvedClues(next);  // May use old letters state
if (checkWin(next)) {     // May use old letters state
  setTimeout(() => setGameState("won"), 200);
  return;
}
advanceCell(next, [r, c]); // May use old activeClue state
```

**Impact:** User experience degradation, incorrect game state, potential data loss

---

### 2. **Memory Leak from Uncleared Timeout**
**Location:** Line 567  
**Severity:** Critical  
**Description:**  
The `setTimeout` for setting game state to "won" is not tracked or cleaned up. If the component unmounts before the timeout fires (e.g., user navigates away), it will attempt to update unmounted component state.

```javascript
if (checkWin(next)) {
  setTimeout(() => setGameState("won"), 200);  // No cleanup!
  return;
}
```

**Impact:** Memory leak, React warnings, potential crashes

---

### 3. **Missing Input Validation for Grid Boundaries**
**Location:** Lines 545-570 (handleKeyDown), Lines 616-630 (handleCellClick)  
**Severity:** Critical  
**Description:**  
No validation that `activeCell` coordinates are within grid bounds before accessing `letters[r][c]` or `puzzle.grid[r][c]`. If state becomes corrupted, this could cause crashes.

**Example:**
```javascript
const [r, c] = activeCell;
if (letters[r][c]) {  // No check if r,c are valid indices
  // ...
}
```

**Impact:** Potential runtime errors, app crashes

---

## 🟡 Major Bugs

### 4. **Incorrect Clue Cycling Logic**
**Location:** Lines 575-591  
**Severity:** Major  
**Description:**  
When using arrow keys or Tab to cycle through clues, the logic doesn't account for the current direction preference. If a user is working on "Across" clues and presses Tab, they might jump to a "Down" clue unexpectedly.

```javascript
if (key === "TAB" || key === "ARROWRIGHT" || key === "ARROWDOWN") {
  e.preventDefault();
  const allKeys = Object.keys(puzzle.clueStarts);  // Mixed A and D keys
  const idx = allKeys.indexOf(activeClue);
  const nextKey = allKeys[(idx + 1) % allKeys.length];
  // No logic to stay within Across or Down
}
```

**Impact:** Confusing navigation, poor UX

---

### 5. **Backspace Behavior Inconsistency**
**Location:** Lines 555-569  
**Severity:** Major  
**Description:**  
Backspace has two different behaviors: clear current cell if filled, or move back if empty. However, this doesn't match standard crossword behavior where backspace should always delete and move back.

```javascript
if (letters[r][c]) {
  // Clear current cell
  const next = letters.map((row) => [...row]);
  next[r][c] = "";
  setLetters(next);
  updateSolvedClues(next);
} else {
  // Move back
  const cells = getClueCells(activeClue, puzzle);
  const idx = cells.findIndex(([cr, cc]) => cr === r && cc === c);
  if (idx > 0) setActiveCell(cells[idx - 1]);
}
```

**Impact:** Unexpected behavior, user frustration

---

### 6. **advanceCell Logic Doesn't Handle End of Clue**
**Location:** Lines 524-540  
**Severity:** Major  
**Description:**  
When reaching the end of a clue, `advanceCell` doesn't automatically move to the next clue. It just stays at the last cell, requiring manual navigation.

```javascript
// Move to next cell regardless
if (idx + 1 < cells.length) {
  setActiveCell(cells[idx + 1]);
}
// No else clause to move to next clue!
```

**Impact:** Poor UX, requires extra keystrokes

---

### 7. **Puzzle Selection Not Truly Random**
**Location:** Lines 157-160  
**Severity:** Major  
**Description:**  
The puzzle selection uses `Date.now() / 86400000` which gives the same puzzle for the entire day. While this might be intentional (daily puzzle), there's no way for users to get a different puzzle on the same day, and the "New Puzzle" button just resets the same puzzle.

```javascript
function pickPuzzle() {
  const day = Math.floor(Date.now() / 86400000);
  return PUZZLES[day % PUZZLES.length];  // Same puzzle all day
}
```

**Impact:** Limited replayability, misleading "New Puzzle" button

---

## 🟠 Moderate Bugs

### 8. **No Validation of Puzzle Data Structure**
**Location:** Lines 8-154 (PUZZLES array)  
**Severity:** Moderate  
**Description:**  
No runtime validation that puzzle data is correctly formatted. Missing clues, incorrect grid dimensions, or mismatched clueStarts could cause crashes.

**Impact:** Fragile code, difficult to add new puzzles

---

### 9. **getClueCells Doesn't Handle Edge Cases**
**Location:** Lines 163-178  
**Severity:** Moderate  
**Description:**  
The function assumes clues always start within bounds and don't wrap. No validation for:
- Start position outside grid
- Clue extending beyond grid
- Invalid clue keys

```javascript
function getClueCells(clueKey, puzzle) {
  const start = puzzle.clueStarts[clueKey];
  if (!start) return [];  // Good
  const [sr, sc] = start;
  // No validation that sr, sc are valid
  const cells = [];
  if (clueKey.startsWith("A")) {
    for (let c = sc; c < 5; c++) {  // Hardcoded 5
      if (puzzle.grid[sr][c] === null) break;  // Could crash if sr invalid
      cells.push([sr, c]);
    }
  }
  // ...
}
```

**Impact:** Potential crashes with malformed puzzle data

---

### 10. **buildCellNumbers Has Incorrect Comparison Logic**
**Location:** Lines 192-201  
**Severity:** Moderate  
**Description:**  
The function tries to pick the smallest clue number for cells with multiple clues, but the comparison is flawed:

```javascript
const num = key.slice(1);  // String, not number
const existing = map[`${r},${c}`];
if (!existing || parseInt(num) < parseInt(existing)) {
  map[`${r},${c}`] = num;  // Stores string, not parsed int
}
```

Should store parsed integers consistently or compare as strings throughout.

**Impact:** Incorrect clue numbers displayed on cells

---

### 11. **Mobile Input Focus Issues**
**Location:** Lines 265-283, Lines 606-608  
**Severity:** Moderate  
**Description:**  
The hidden input for mobile keyboard is recreated on every render when `activeCell` changes. This can cause:
- Focus loss during rapid typing
- Keyboard flickering on mobile
- Input lag

```javascript
{isActiveCell && (
  <input
    ref={inputRef}
    value=""
    onChange={() => {}}  // Empty handler
    onKeyDown={onKeyDown}
    // ... recreated every time
  />
)}
```

**Impact:** Poor mobile experience

---

### 12. **Progress Calculation Includes Black Squares**
**Location:** Lines 648-650  
**Severity:** Moderate  
**Description:**  
The progress bar counts all filled cells, but the total only counts non-black cells. This is correct, but the `filledCount` calculation could be more explicit:

```javascript
const filledCount = letters.flat().filter(Boolean).length;
const totalCells = puzzle.grid.flat().filter((c) => c !== null).length;
```

If a user fills a black square (which shouldn't be possible but isn't prevented), the progress would be incorrect.

**Impact:** Incorrect progress display

---

## 🟢 Minor Bugs

### 13. **Inconsistent Key Naming Convention**
**Location:** Throughout  
**Severity:** Minor  
**Description:**  
Clue keys use "A1", "D2" format, but the code sometimes uses `${title[0]}${num}` which could break if title changes.

**Impact:** Code fragility

---

### 14. **No Debouncing on Clue Click**
**Location:** Lines 632-635  
**Severity:** Minor  
**Description:**  
Rapid clicking on clues can cause multiple state updates. Should debounce or disable during transitions.

**Impact:** Minor performance issue

---

### 15. **Hard-coded Grid Size**
**Location:** Multiple locations (lines 163-178, 493-495, etc.)  
**Severity:** Minor  
**Description:**  
Grid size is hard-coded as 5x5 throughout. Should be derived from puzzle data for flexibility.

```javascript
for (let c = sc; c < 5; c++) {  // Hard-coded 5
```

**Impact:** Cannot support different grid sizes

---

### 16. **Missing Accessibility Features**
**Location:** Throughout  
**Severity:** Minor  
**Description:**  
- No ARIA labels for cells or clues
- No screen reader announcements for state changes
- No keyboard shortcuts help
- No focus indicators for keyboard-only users

**Impact:** Inaccessible to users with disabilities

---

### 17. **No Error Boundary**
**Location:** N/A  
**Severity:** Minor  
**Description:**  
No error boundary wrapping the game. Any runtime error will crash the entire app.

**Impact:** Poor error handling

---

### 18. **Toast State Not Used**
**Location:** Line 476, Line 652  
**Severity:** Minor  
**Description:**  
Toast state is initialized and rendered, but never actually set anywhere in the code. Dead code.

```javascript
const [toast, setToast] = useState(null);
// ...
{toast && <Toast message={toast} onDone={() => setToast(null)} />}
// setToast is never called!
```

**Impact:** Unused code, potential confusion

---

### 19. **Inefficient Array Copying**
**Location:** Lines 556, 563, 595  
**Severity:** Minor  
**Description:**  
Letters array is deep-copied on every keystroke using `letters.map((row) => [...row])`. For a 5x5 grid this is fine, but it's inefficient.

**Impact:** Minor performance issue

---

### 20. **No Input Sanitization**
**Location:** Lines 593-602  
**Severity:** Minor  
**Description:**  
While the regex `/^[A-Z]$/` validates input, there's no sanitization for special characters or emoji that might slip through on mobile keyboards.

**Impact:** Potential display issues

---

## 🔵 Design Issues (Not Bugs, But Worth Noting)

### 21. **No Undo/Redo Functionality**
Users cannot undo mistakes without manually backspacing.

### 22. **No Hint System**
No way to reveal a letter or check if current answers are correct.

### 23. **No Save/Resume**
If user navigates away, all progress is lost.

### 24. **No Timer or Scoring**
No way to track completion time or compare performance.

### 25. **Limited Puzzle Pool**
Only 5 puzzles total, will repeat quickly.

---

## Summary

**Total Bugs Found:** 20 actual bugs + 5 design issues

**Breakdown by Severity:**
- 🔴 Critical: 3
- 🟡 Major: 5  
- 🟠 Moderate: 6
- 🟢 Minor: 6

**Most Critical Issues to Fix:**
1. Race condition in state updates (#1)
2. Memory leak from timeout (#2)
3. Missing input validation (#3)
4. Incorrect clue cycling (#4)
5. Puzzle selection not working as expected (#7)

**Recommended Next Steps:**
1. Add proper state management (useReducer or state machine)
2. Implement cleanup for timeouts
3. Add input validation and bounds checking
4. Fix navigation logic
5. Add error boundaries
6. Improve accessibility
7. Add comprehensive tests
