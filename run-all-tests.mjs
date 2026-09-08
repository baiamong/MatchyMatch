// Run all match logic tests
import { execSync } from 'child_process';

console.log('='.repeat(60));
console.log('Running All Match Logic Tests');
console.log('='.repeat(60));

let allPassed = true;

try {
  console.log('\n📋 Running main test suite...\n');
  execSync('node run-tests.mjs', { stdio: 'inherit' });
  console.log('\n✓ Main tests passed\n');
} catch (error) {
  console.log('\n✗ Main tests failed\n');
  allPassed = false;
}

try {
  console.log('\n📋 Running edge case tests...\n');
  execSync('node test-edge-cases.mjs', { stdio: 'inherit' });
  console.log('\n✓ Edge case tests passed\n');
} catch (error) {
  console.log('\n✗ Edge case tests failed\n');
  allPassed = false;
}

try {
  console.log('\n📋 Validating all puzzles...\n');
  execSync('node validate-puzzles.mjs', { stdio: 'inherit' });
  console.log('\n✓ Puzzle validation passed\n');
} catch (error) {
  console.log('\n✗ Puzzle validation failed\n');
  allPassed = false;
}

console.log('='.repeat(60));
if (allPassed) {
  console.log('✓ ALL TESTS PASSED!');
  console.log('='.repeat(60));
  process.exit(0);
} else {
  console.log('✗ SOME TESTS FAILED');
  console.log('='.repeat(60));
  process.exit(1);
}
