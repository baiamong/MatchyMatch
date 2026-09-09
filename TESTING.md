# Testing Guide

This project includes a comprehensive testing setup with Jest and React Testing Library.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run match logic tests (Node.js)
```bash
# Run all match logic tests
node run-all-tests.mjs

# Run main test suite only
node run-tests.mjs

# Run edge case tests only
node test-edge-cases.mjs

# Validate all game puzzles
node validate-puzzles.mjs
```

## Test Structure

Tests are organized in the `src/__tests__/` directory and follow the naming convention `*.test.js`.

### Current Tests

1. **gameHelpers.test.js** - Tests for utility functions
   - `shuffleArray()` - Array shuffling with Fisher-Yates algorithm
   - `randomBetween()` - Random number generation
   - `isInRange()` - Range checking
   - `capitalize()` - String capitalization
   - `debounce()` - Function debouncing

2. **useDarkMode.test.js** - Tests for the dark mode hook
   - Initialization from localStorage
   - Toggle functionality
   - DOM class management
   - Persistence to localStorage

3. **DarkModeToggle.test.js** - Tests for the DarkModeToggle component
   - Rendering and icon display
   - Click handlers
   - Accessibility attributes (aria-label, title)

4. **matchLogic.test.js** - Tests for match/connection game logic (48 tests total)
   - **Selection validation** (4 tests)
     - Exactly 4 words required
     - Rejects < 4 or > 4 words
     - Handles non-array inputs
   
   - **Match detection** (8 tests)
     - Perfect matches (all 4 words same category)
     - "One away" scenarios (3 out of 4 correct)
     - Wrong matches (0-2 correct)
     - Invalid selections
     - Words not in puzzle
     - Duplicate word handling
   
   - **One away detection** (7 tests)
     - 3/4 correct detection
     - False for perfect matches
     - False for 2/4 correct
     - Position-independent detection
   
   - **Game state management** (6 tests)
     - Win condition (all categories found)
     - Loss condition (no lives remaining)
     - Lives decrement
     - Category tracking
   
   - **Puzzle validation** (9 tests)
     - Valid puzzle structure
     - Missing/malformed categories
     - Wrong word counts (not exactly 4)
     - Duplicate words across categories
     - Multiple validation errors
   
   - **Edge cases** (14 tests)
     - Case sensitivity
     - Whitespace handling
     - Null/undefined values
     - Empty selections
     - Mixed valid/invalid inputs

## Match Logic Test Coverage

The match logic tests cover all critical game mechanics:

- ✅ Selection validation (must be exactly 4 words)
- ✅ Perfect match detection (all 4 words in same category)
- ✅ "One away" hint (3 out of 4 correct)
- ✅ Game win condition (all categories found)
- ✅ Game loss condition (no lives remaining)
- ✅ Lives management (decrement, minimum 0)
- ✅ Puzzle data validation (structure, duplicates, word counts)
- ✅ Edge cases (null, undefined, whitespace, case sensitivity)

All 20 game puzzles have been validated against the validation rules.

## CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs:

1. **Lint** - ESLint checks on all code
2. **Test** - Jest tests with coverage reporting
3. **Build** - Vite build process

The pipeline runs on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

## Writing New Tests

### Example: Testing a utility function

```javascript
import { myFunction } from '../utils/myUtils';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });
});
```

### Example: Testing a React component

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const mockHandler = jest.fn();
    render(<MyComponent onClick={mockHandler} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

## Coverage Goals

We aim for:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Check coverage reports with:
```bash
npm run test:coverage
```

## Best Practices

1. **Test behavior, not implementation** - Focus on what the code does, not how it does it
2. **Use descriptive test names** - Make it clear what is being tested
3. **Keep tests isolated** - Each test should be independent
4. **Mock external dependencies** - Use Jest mocks for API calls, timers, etc.
5. **Test edge cases** - Include tests for boundary conditions and error states
6. **Validate data structures** - Use validation functions to catch data issues early
