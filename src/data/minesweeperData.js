/**
 * Minesweeper game logic helpers.
 */

export const DIFFICULTIES = [
  { label: 'Easy',   rows: 9,  cols: 9,  mines: 10 },
  { label: 'Medium', rows: 16, cols: 16, mines: 40 },
  { label: 'Hard',   rows: 16, cols: 30, mines: 99 },
];

/**
 * Build a fresh, unexploded grid (all cells hidden, no mines placed yet).
 * Mines are placed on the FIRST click so the first cell is always safe.
 */
export function buildEmptyGrid(rows, cols) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      row: r,
      col: c,
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  );
}

/**
 * Place mines randomly, avoiding `safeRow`/`safeCol` and its neighbours.
 * Returns a new grid with mines and adjacency counts filled in.
 */
export function placeMines(grid, rows, cols, mineCount, safeRow, safeCol) {
  // Build set of safe cells (the clicked cell + its 8 neighbours)
  const safe = new Set();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = safeRow + dr;
      const c = safeCol + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        safe.add(`${r},${c}`);
      }
    }
  }

  // Collect candidate positions
  const candidates = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!safe.has(`${r},${c}`)) candidates.push([r, c]);
    }
  }

  // Fisher-Yates shuffle, take first mineCount
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  const minePositions = new Set(
    candidates.slice(0, mineCount).map(([r, c]) => `${r},${c}`)
  );

  // Deep-clone grid and set mines
  const next = grid.map((row) =>
    row.map((cell) => ({
      ...cell,
      mine: minePositions.has(`${cell.row},${cell.col}`),
    }))
  );

  // Compute adjacency counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (next[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && next[nr][nc].mine) {
            count++;
          }
        }
      }
      next[r][c].adjacent = count;
    }
  }

  return next;
}

/**
 * Flood-fill reveal from (row, col).
 * Reveals the cell and, if adjacent === 0, recursively reveals neighbours.
 * Returns a new grid.
 */
export function revealFrom(grid, rows, cols, startRow, startCol) {
  const next = grid.map((row) => row.map((cell) => ({ ...cell })));
  const queue = [[startRow, startCol]];
  const visited = new Set();

  while (queue.length > 0) {
    const [r, c] = queue.shift();
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const cell = next[r][c];
    if (cell.revealed || cell.flagged) continue;
    cell.revealed = true;

    if (cell.adjacent === 0 && !cell.mine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            queue.push([nr, nc]);
          }
        }
      }
    }
  }

  return next;
}

/**
 * Reveal all mines (used on game-over).
 */
export function revealAllMines(grid) {
  return grid.map((row) =>
    row.map((cell) => (cell.mine ? { ...cell, revealed: true } : { ...cell }))
  );
}

/**
 * Check if the player has won:
 * every non-mine cell is revealed.
 */
export function checkWin(grid) {
  return grid.every((row) =>
    row.every((cell) => cell.mine || cell.revealed)
  );
}

/** Count remaining flags (mines - flagged cells). */
export function flagsRemaining(grid, mineCount) {
  let flagged = 0;
  grid.forEach((row) => row.forEach((cell) => { if (cell.flagged) flagged++; }));
  return mineCount - flagged;
}

/**
 * Adjacency number colours (classic Minesweeper palette).
 */
export const ADJ_COLORS = {
  1: '#1a73e8',
  2: '#2e7d32',
  3: '#c62828',
  4: '#1a237e',
  5: '#b71c1c',
  6: '#00838f',
  7: '#37474f',
  8: '#546e7a',
};
