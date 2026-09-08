#!/bin/bash
# Run all match logic tests

echo "Running main test suite..."
node run-tests.mjs
MAIN_EXIT=$?

echo ""
echo "Running edge case tests..."
node test-edge-cases.mjs
EDGE_EXIT=$?

echo ""
echo "Validating all puzzles..."
node validate-puzzles.mjs
PUZZLE_EXIT=$?

echo ""
echo "=== Overall Summary ==="
if [ $MAIN_EXIT -eq 0 ] && [ $EDGE_EXIT -eq 0 ] && [ $PUZZLE_EXIT -eq 0 ]; then
  echo "✓ All tests passed!"
  exit 0
else
  echo "✗ Some tests failed"
  exit 1
fi
