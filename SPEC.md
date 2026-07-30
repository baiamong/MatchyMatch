��# Puzzlr — 5-Group Game Mode Spec

## Overview

Puzzlr is migrating fully to a **5-group format**. All puzzles consist of **5 groups of 4 words** (20 words total). The 4-group format is retired. A **mode toggle** on the game screen allows players to switch between a standard solve attempt and a relaxed/hard difficulty, as described below.

---

## Grid Layout

- **20 tiles** displayed in a **5×4 grid** (5 columns, 4 rows).
- Tiles are shuffled randomly at game start.
- Layout should remain responsive on mobile (consider 4 or 5 columns depending on screen width).

---

## Categories

- Each puzzle contains exactly **5 categories**.
- Each category has exactly **4 words**.
- Categories are assigned a **difficulty tier** and a **color**:

| Tier | Color  | Difficulty        |
|------|--------|-------------------|
| 1    | Yellow | Easiest           |
| 2    | Green  | Easy              |
| 3    | Blue   | Medium            |
| 4    | Purple | Hard              |
| 5    | Pink   | Trickiest / Tricky twist |

- The 5th (Pink) category should always contain the most surprising or lateral-thinking connection.

---

## Puzzle Data Structure

Each puzzle includes:
- `id` — unique integer
- `date` — ISO date string (optional, for daily puzzle use)
- `categories` — array of 5 category objects, each with:
  - `id` — unique string key (e.g. `"yellow"`, `"pink"`)
  - `color` — one of: `yellow`, `green`, `blue`, `purple`, `pink`
  - `title` — the revealed category label shown after solving (e.g. `"___ house"`)
  - `words` — array of exactly 4 uppercase strings

---

## Gameplay Rules

### Selection
- Player taps/clicks tiles to select them.
- Maximum **4 tiles** selected at a time.
- Selecting a 5th tile when 4 are already selected does nothing (no auto-deselect).
- Selected tiles have a distinct visual highlight.

### Submission
- The **Submit** button is only enabled when exactly 4 tiles are selected.
- On submission, check if all 4 selected words belong to the same category:
  - **Correct** → reveal the matched category row with its color; remove those tiles from the grid.
  - **Incorrect** → lose one life; shake animation plays; toast feedback appears.

### "One Away" Hint
- If exactly 3 of the 4 selected words belong to the same category, show a toast: **"So close — one away!"**

### Lives
- Player starts with **5 lives** (up from 4, to account for increased difficulty).
- Each wrong guess costs 1 life.
- Lives are displayed as heart icons (💜), greying out as they are lost.
- Reaching 0 lives ends the game immediately (loss state).

### Shuffle
- The **Shuffle** button randomizes the order of remaining (unrevealed) tiles.
- Does not affect already-revealed category rows.

### Deselect All
- Clears the current tile selection.
- Disabled when no tiles are selected.

---

## Win / Loss Conditions

### Win
- All 5 categories are correctly identified before running out of lives.
- Show a celebration screen with:
  - Emoji animation
  - Number of lives remaining
  - "Play Again" button

### Loss
- Player runs out of lives.
- All unrevealed categories are immediately revealed in order (tier 1 → 5).
- Show a consolation screen with:
  - Sympathetic message
  - "Try Again" button

---

## UI / Visual Changes vs. 4-Group Mode

| Element             | 4-Group Mode     | 5-Group Mode           |
|---------------------|------------------|------------------------|
| Grid                | 4×4 (16 tiles)   | 4×5 or 5×4 (20 tiles)  |
| Category colors     | Yellow–Purple    | Yellow–Purple + Pink   |
| Lives               | 4 hearts         | 5 hearts               |
| Revealed rows       | Up to 4          | Up to 5                |
| Grid columns        | 4                | 5 (desktop), 4 (mobile)|

---

## Category Color Styles (5-Group Extension)

A new `pink` entry must be added to `COLOR_STYLES`:

- **Background:** soft pink pastel (e.g. `bg-pink-200`)
- **Text:** deep pink (e.g. `text-pink-800`)
- **Emoji:** 🌸

---

## Sample Puzzle (5 Groups)

**Puzzle Title:** "Around the House"

| Color  | Title                    | Words                              |
|--------|--------------------------|------------------------------------|
| Yellow | Things you plug in       | LAMP, TOASTER, FAN, ROUTER         |
| Green  | In the bathroom          | MIRROR, TOWEL, FAUCET, DRAIN       |
| Blue   | ___ door                 | TRAP, SCREEN, SLIDING, REVOLVING   |
| Purple | Types of flooring        | TILE, HARDWOOD, CARPET, VINYL      |
| Pink   | Things with rings        | SATURN, CIRCUS, BOXING, STOVE      |

---

## Mode Toggle

A toggle control is displayed in the header or just above the game grid. It switches between two difficulty modes for the **same puzzle**:

| Mode     | Lives | Description                                    |
|----------|-------|------------------------------------------------|
| Normal   | 5     | Default mode. Full hint system active.         |
| Hard     | 3     | Reduced lives. "One away" hint is suppressed.  |

- The toggle is only available **before the first submission**. Once play begins, the mode is locked for that session.
- Switching mode resets the board (re-shuffles tiles, clears selection, restores lives).
- The active mode should be visually indicated (e.g. pill toggle with pastel highlight).

---

## Puzzle Library & Selection

### Library Size
- The app ships with exactly **20 puzzles**, all in the 5-group format.
- The 3 existing 4-group puzzles are removed and replaced entirely.

### Random Selection at Build Time
- At build time, the Vite build process injects a **randomly selected puzzle index** (0–19) as an environment variable (e.g. `VITE_PUZZLE_INDEX`).
- The app reads this value at runtime via `import.meta.env.VITE_PUZZLE_INDEX` and loads the corresponding puzzle.
- This means every deploy serves a single fixed puzzle for that deployment lifetime — consistent for all players until the next deploy.
- A scheduled CI trigger can re-deploy daily to rotate the puzzle automatically in the future (out of scope for now).

### Fallback
- If `VITE_PUZZLE_INDEX` is missing or out of range, default to puzzle index `0`.

### Build Script
- A small Node.js script (`scripts/pick-puzzle.js`) is added and called as part of the build command:
  - Generates a random integer between 0 and 19.
  - Writes it as `VITE_PUZZLE_INDEX=<n>` to a `.env.production` file before Vite builds.
- The build command becomes: `node scripts/pick-puzzle.js && npm run build`
- `.env.production` is **gitignored** so it is never committed.

---

## Puzzle Library Requirements

- 20 unique puzzles, each with 5 categories (Yellow, Green, Blue, Purple, Pink).
- No word should appear in more than one puzzle.
- The Pink (tier 5) category in every puzzle must have a lateral-thinking or trick connection that isn't immediately obvious.
- Puzzle themes should be varied (pop culture, nature, language, food, sport, etc.).

---

## Out of Scope (for this spec)

- Daily puzzle rotation via scheduling service
- Score tracking or streaks
- User accounts or persistence
- Puzzle editor / admin UI
- Animations beyond the existing shake / bounce-in
- Per-user puzzle state (same puzzle shown to all players per deploy)
