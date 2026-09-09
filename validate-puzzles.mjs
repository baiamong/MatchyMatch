// Validate all puzzles in the game
import { puzzles } from './src/data/puzzles.js';
import { validatePuzzle } from './src/utils/matchLogic.js';

console.log('\n=== Validating All Puzzles ===\n');

let allValid = true;
puzzles.forEach((puzzle, index) => {
  const result = validatePuzzle(puzzle);
  if (result.isValid) {
    console.log(`✓ Puzzle ${puzzle.id}: Valid`);
  } else {
    console.log(`✗ Puzzle ${puzzle.id}: Invalid`);
    result.errors.forEach(error => console.log(`  - ${error}`));
    allValid = false;
  }
});

console.log(`\n=== Summary ===`);
console.log(`Total puzzles: ${puzzles.length}`);
console.log(`Status: ${allValid ? 'All valid ✓' : 'Some invalid ✗'}\n`);

process.exit(allValid ? 0 : 1);
