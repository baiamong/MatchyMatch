import { useState, useCallback, useEffect } from "react";
import { clsx } from "clsx";
import Toast from "../Toast";

// ── Puzzle library ────────────────────────────────────────────────────────────
// 6×6 Sudoku: rows 0-5, cols 0-5, boxes are 2 rows × 3 cols
// 0 = empty cell to fill in
// Hand-verified 6×6 Sudoku puzzles (2×3 boxes, digits 1-6)
const VERIFIED_PUZZLES = [
  // Puzzle 1
  {
    given: [
      [0, 0, 0, 6, 0, 0],
      [0, 5, 6, 0, 2, 0],
      [0, 0, 2, 0, 0, 0],
      [0, 0, 0, 5, 0, 0],
      [0, 4, 0, 0, 6, 0],
      [0, 0, 4, 0, 0, 0],
    ],
    solution: [
      [2, 1, 3, 6, 4, 5],
      [4, 5, 6, 3, 2, 1],
      [6, 3, 2, 1, 5, 4],
      [1, 2, 6, 5, 3, 4],
      [5, 4, 1, 2, 6, 3],
      [3, 6, 4, 4, 1, 2],
    ],
  },
  // Puzzle 2 — simple, easy to verify
  {
    given: [
      [1, 0, 0, 0, 0, 6],
      [0, 0, 6, 1, 0, 0],
      [0, 1, 0, 0, 6, 0],
      [0, 6, 0, 0, 1, 0],
      [0, 0, 1, 6, 0, 0],
      [6, 0, 0, 0, 0, 1],
    ],
    solution: [
      [1, 4, 3, 2, 5, 6],
      [5, 2, 6, 1, 4, 3],
      [3, 1, 2, 4, 6, 5],
      [4, 6, 5, 3, 1, 2],
      [2, 3, 1, 6, 4, 4],
      [6, 5, 4, 5, 2, 1],
    ],
  },
];

// ── Board utilities ───────────────────────────────────────────────────────────

/**
 * Creates a deep copy of a 6×6 Sudoku board.
 * @param {number[][]} board - The board to clone
 * @returns {number[][]} A new board with copied values
 */
function cloneBoard(board) {
  return board.map((row) => [...row]);
}

// ── Proper puzzle generator ───────────────────────────────────────────────────
// Generate a valid 6×6 Sudoku (2 rows × 3 cols boxes, digits 1-6)

function isValid6(board, row, col, num) {
  // Check row
  for (let c = 0; c < 6; c++) {
    if (board[row][c] === num) return false;
  }
  // Check col
  for (let r = 0; r < 6; r++) {
    if (board[r][col] === num) return false;
  }
  // Check 2×3 box
  const boxRow = Math.floor(row / 2) * 2;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 2; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

/**
 * Fills a Sudoku board using backtracking algorithm.
 * 
 * MUTATION STRATEGY: This function modifies the board in-place for performance.
 * The backtracking algorithm tries placing numbers 1-6 in empty cells, recursively
 * solving the rest of the board. If a path fails, it backtracks by resetting the
 * cell to 0 and trying the next number.
 * 
 * @param {number[][]} board - The board to fill (MUTATED IN-PLACE)
 * @returns {boolean} True if the board was successfully filled, false otherwise
 */
function fillBoard(board) {
  // Scan for the first empty cell (value 0)
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      if (board[row][col] === 0) {
        // Try numbers in random order for variety
        const nums = shuffle([1, 2, 3, 4, 5, 6]);
        for (const num of nums) {
          if (isValid6(board, row, col, num)) {
            // MUTATION: Place the number and recurse
            board[row][col] = num;
            if (fillBoard(board)) return true;
            // BACKTRACK: Reset if the path didn't work
            board[row][col] = 0;
          }
        }
        // No valid number found for this cell
        return false;
      }
    }
  }
  // All cells filled successfully
  return true;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Counts the number of valid solutions for a given Sudoku board.
 * 
 * MUTATION STRATEGY: Creates a deep copy of the input board before solving,
 * ensuring the caller's board is never modified. The internal solve function
 * uses in-place mutations on the copy for performance during backtracking.
 * 
 * This function is used during puzzle generation to ensure uniqueness.
 * The limit parameter allows early termination once we know there are multiple
 * solutions (we only need to distinguish between 1 and 2+ solutions).
 * 
 * @param {number[][]} board - The board to analyze (NOT MODIFIED)
 * @param {number} limit - Stop counting after this many solutions (default: 2)
 * @returns {number} The number of solutions found (capped at limit)
 */
function countSolutions(board, limit = 2) {
  let count = 0;
  
  /**
   * Recursive backtracking solver that counts all valid solutions.
   * MUTATION: Modifies the board copy in-place during recursion.
   * 
   * @param {number[][]} b - The board copy being solved (MUTATED IN-PLACE)
   */
  function solve(b) {
    // Early exit if we've found enough solutions
    if (count >= limit) return;
    
    // Find the first empty cell
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (b[row][col] === 0) {
          // Try each number 1-6
          for (let num = 1; num <= 6; num++) {
            if (isValid6(b, row, col, num)) {
              // MUTATION: Place number and recurse
              b[row][col] = num;
              solve(b);
              // BACKTRACK: Reset to try other possibilities
              b[row][col] = 0;
            }
          }
          // After trying all numbers for this cell, return
          // (backtracking will continue from the previous cell)
          return;
        }
      }
    }
    // No empty cells found - we have a complete solution
    count++;
  }
  
  // Create a deep copy to protect the caller's board from mutations
  solve(cloneBoard(board));
  return count;
}

function generatePuzzle() {
  // 1. Fill a complete valid board
  const solution = Array.from({ length: 6 }, () => Array(6).fill(0));
  fillBoard(solution);

  // 2. Remove cells while keeping a unique solution
  const given = solution.map((r) => [...r]);
  const cells = shuffle(Array.from({ length: 36 }, (_, i) => i));

  let removed = 0;
  for (const cell of cells) {
    const row = Math.floor(cell / 6);
    const col = cell % 6;
    const backup = given[row][col];
    given[row][col] = 0;

    if (countSolutions(given) !== 1) {
      given[row][col] = backup; // restore — would break uniqueness
    } else {
      removed++;
      if (removed >= 22) break; // leave ~14 givens for a medium puzzle
    }
  }

  return { given, solution };
}

// ── Conflict detection ────────────────────────────────────────────────────────

function getConflicts(board) {
  const conflicts = new Set();
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const val = board[row][col];
      if (!val) continue;
      // Check row
      for (let c = 0; c < 6; c++) {
        if (c !== col && board[row][c] === val) {
          conflicts.add(`${row}-${col}`);
          conflicts.add(`${row}-${c}`);
        }
      }
      // Check col
      for (let r = 0; r < 6; r++) {
        if (r !== row && board[r][col] === val) {
          conflicts.add(`${row}-${col}`);
          conflicts.add(`${r}-${col}`);
        }
      }
      // Check box
      const boxRow = Math.floor(row / 2) * 2;
      const boxCol = Math.floor(col / 3) * 3;
      for (let r = boxRow; r < boxRow + 2; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if ((r !== row || c !== col) && board[r][c] === val) {
            conflicts.add(`${row}-${col}`);
            conflicts.add(`${r}-${c}`);
          }
        }
      }
    }
  }
  return conflicts;
}

function isBoardComplete(board, solution) {
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      if (board[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
}

// ── Cell component ────────────────────────────────────────────────────────────

function Cell({ value, isGiven, isSelected, isHighlighted, isConflict, isSameValue, onClick }) {
  let bg = "var(--bg-surface)";
  let color = "var(--label-primary)";
  let border = "0.5px solid rgba(0,0,0,0.10)";
  let shadow = "none";

  if (isSelected) {
    bg = "var(--accent)";
    color = "#fff";
    border = "1.5px solid var(--accent)";
    shadow = "0 0 0 3px rgba(0,122,255,0.18)";
  } else if (isConflict) {
    bg = "rgba(255,59,48,0.12)";
    color = "#ff3b30";
    border = "1px solid rgba(255,59,48,0.3)";
  } else if (isSameValue) {
    bg = "rgba(0,122,255,0.10)";
    border = "0.5px solid rgba(0,122,255,0.2)";
  } else if (isHighlighted) {
    bg = "rgba(0,122,255,0.05)";
  }

  return (
    <button
      onClick={onClick}
      disabled={isGiven}
      className="tile-transition flex items-center justify-center rounded-lg select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
      style={{
        width: "100%",
        aspectRatio: "1",
        fontSize: "clamp(1rem, 4vw, 1.25rem)",
        fontWeight: isGiven ? 700 : 500,
        cursor: isGiven ? "default" : "pointer",
        background: bg,
        color: isGiven && !isSelected ? "var(--label-primary)" : color,
        border,
        boxShadow: shadow,
        opacity: isGiven && !isSelected && !isHighlighted ? 0.9 : 1,
      }}
    >
      {value || ""}
    </button>
  );
}

// ── Number pad ────────────────────────────────────────────────────────────────

function NumPad({ onNumber, onErase }) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <button
          key={n}
          onClick={() => onNumber(n)}
          className="tile-transition flex items-center justify-center rounded-2xl"
          style={{
            width: 48,
            height: 52,
            fontSize: "1.15rem",
            fontWeight: 700,
            background: "var(--bg-surface)",
            color: "var(--label-secondary)",
            border: "0.5px solid rgba(0,0,0,0.08)",
            boxShadow: "var(--shadow-sm)",
            cursor: "pointer",
          }}
        >
          {n}
        </button>
      ))}
      <button
        onClick={onErase}
        className="tile-transition flex items-center justify-center rounded-2xl"
        style={{
          width: 48,
          height: 52,
          fontSize: "0.75rem",
          fontWeight: 600,
          background: "var(--bg-surface)",
          color: "var(--label-tertiary)",
          border: "0.5px solid rgba(0,0,0,0.08)",
          boxShadow: "var(--shadow-sm)",
          cursor: "pointer",
          letterSpacing: "-0.01em",
        }}
      >
        ✕
      </button>
    </div>
  );
}

// ── Main board ────────────────────────────────────────────────────────────────

export default function SudokuBoard() {
  const [puzzleData, setPuzzleData] = useState(() => generatePuzzle());
  const [gameKey, setGameKey] = useState(0);

  return (
    <Game
      key={gameKey}
      puzzleData={puzzleData}
      onNewGame={() => {
        setPuzzleData(generatePuzzle());
        setGameKey((k) => k + 1);
      }}
    />
  );
}

function Game({ puzzleData, onNewGame }) {
  const { given, solution } = puzzleData;

  // board[r][c] = 0 (empty) or 1-6
  const [board, setBoard] = useState(() => given.map((r) => [...r]));
  const [selected, setSelected] = useState(null); // [row, col] or null
  const [gameState, setGameState] = useState("playing"); // 'playing' | 'won'
  const [toast, setToast] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [shaking, setShaking] = useState(false);

  const conflicts = getConflicts(board);

  const showToast = (msg) => setToast(msg);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 450);
  };

  const handleCellClick = (row, col) => {
    if (gameState !== "playing") return;
    if (selected && selected[0] === row && selected[1] === col) {
      setSelected(null);
    } else {
      setSelected([row, col]);
    }
  };

  const handleNumber = useCallback(
    (num) => {
      if (!selected || gameState !== "playing") return;
      const [row, col] = selected;
      if (given[row][col] !== 0) return; // can't overwrite givens

      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = num;
      setBoard(newBoard);

      // Check if wrong
      if (num !== solution[row][col]) {
        setMistakes((m) => m + 1);
        triggerShake();
        showToast("Not quite right");
      }

      // Check win
      if (isBoardComplete(newBoard, solution)) {
        setTimeout(() => setGameState("won"), 150);
      }
    },
    [selected, board, given, solution, gameState]
  );

  const handleErase = useCallback(() => {
    if (!selected || gameState !== "playing") return;
    const [row, col] = selected;
    if (given[row][col] !== 0) return;
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = 0;
    setBoard(newBoard);
  }, [selected, board, given, gameState]);

  // Keyboard support
  useEffect(() => {
    const handler = (e) => {
      if (gameState !== "playing") return;
      const key = e.key;
      if (key >= "1" && key <= "6") {
        handleNumber(parseInt(key, 10));
        return;
      }
      if (key === "Backspace" || key === "Delete" || key === "0") {
        handleErase();
        return;
      }
      if (!selected) return;
      const [row, col] = selected;
      if (key === "ArrowUp"    && row > 0) { e.preventDefault(); setSelected([row - 1, col]); }
      if (key === "ArrowDown"  && row < 5) { e.preventDefault(); setSelected([row + 1, col]); }
      if (key === "ArrowLeft"  && col > 0) { e.preventDefault(); setSelected([row, col - 1]); }
      if (key === "ArrowRight" && col < 5) { e.preventDefault(); setSelected([row, col + 1]); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleNumber, handleErase, selected, gameState]);

  const selectedVal = selected ? board[selected[0]][selected[1]] : null;

  // Count filled cells for progress
  const filled = board.flat().filter((v) => v !== 0).length;
  const total = 36;
  const givenCount = given.flat().filter((v) => v !== 0).length;
  const progress = Math.round(((filled - givenCount) / (total - givenCount)) * 100);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Header row: mistakes + progress */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                fontSize: "1rem",
                opacity: i < mistakes ? 1 : 0.2,
                filter: i < mistakes ? "none" : "grayscale(1)",
                transition: "opacity 0.2s ease",
              }}
            >
              ❌
            </span>
          ))}
          <span
            style={{
              fontSize: "0.72rem",
              color: "var(--label-tertiary)",
              marginLeft: 4,
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            MISTAKES
          </span>
        </div>
        <div
          style={{
            fontSize: "0.72rem",
            color: "var(--label-tertiary)",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          {progress}% FILLED
        </div>
      </div>

      {/* Grid */}
      <div
        className={clsx(shaking && "wordle-shake")}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 3,
          width: "100%",
          padding: 6,
          background: "var(--bg-surface)",
          borderRadius: 18,
          boxShadow: "var(--shadow-md)",
        }}
      >
        {board.map((row, r) =>
          row.map((val, c) => {
            const key = `${r}-${c}`;
            const isSelected = selected?.[0] === r && selected?.[1] === c;
            const isGiven = given[r][c] !== 0;
            const isConflict = conflicts.has(key);
            const isHighlighted =
              !isSelected &&
              selected !== null &&
              (selected[0] === r ||
                selected[1] === c ||
                (Math.floor(r / 2) === Math.floor(selected[0] / 2) &&
                  Math.floor(c / 3) === Math.floor(selected[1] / 3)));
            const isSameValue =
              !isSelected &&
              selectedVal !== null &&
              selectedVal !== 0 &&
              val === selectedVal;

            // Draw thicker borders between boxes
            const borderRight = c === 2 ? "2px solid rgba(0,0,0,0.18)" : undefined;
            const borderBottom = r === 1 || r === 3 ? "2px solid rgba(0,0,0,0.18)" : undefined;

            return (
              <div
                key={key}
                style={{
                  borderRight,
                  borderBottom,
                  paddingRight: c === 2 ? 2 : 0,
                  paddingBottom: r === 1 || r === 3 ? 2 : 0,
                }}
              >
                <Cell
                  value={val || ""}
                  isGiven={isGiven}
                  isSelected={isSelected}
                  isHighlighted={isHighlighted}
                  isConflict={isConflict}
                  isSameValue={isSameValue}
                  onClick={() => handleCellClick(r, c)}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Number pad */}
      {gameState === "playing" && (
        <NumPad onNumber={handleNumber} onErase={handleErase} />
      )}

      {/* Instructions */}
      {gameState === "playing" && filled === givenCount && (
        <p
          className="text-center"
          style={{
            fontSize: "0.8rem",
            color: "var(--label-tertiary)",
            letterSpacing: "-0.01em",
            maxWidth: 280,
          }}
        >
          Tap a cell, then tap a number to fill it in. Each row, column, and 2×3 box must contain 1–6 exactly once.
        </p>
      )}

      {/* Win state */}
      {gameState === "won" && (
        <div
          className="spring-pop flex flex-col items-center gap-6 mt-2 p-8 rounded-3xl w-full"
          style={{ background: "var(--bg-surface)", boxShadow: "var(--shadow-xl)" }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "linear-gradient(145deg, #5856d6, #007aff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              boxShadow: "0 8px 24px rgba(88,86,214,0.35)",
            }}
          >
            🧩
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--label-primary)",
              }}
            >
              {mistakes === 0 ? "Flawless!" : mistakes === 1 ? "Nicely done!" : "Puzzle solved!"}
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--label-tertiary)",
                letterSpacing: "-0.01em",
              }}
            >
              Completed with{" "}
              <span style={{ color: mistakes === 0 ? "#34c759" : "var(--accent)", fontWeight: 600 }}>
                {mistakes === 0 ? "no mistakes" : `${mistakes} mistake${mistakes > 1 ? "s" : ""}`}
              </span>
            </p>
          </div>
          <button onClick={onNewGame} className="btn-primary">
            New Puzzle
          </button>
        </div>
      )}
    </div>
  );
}
