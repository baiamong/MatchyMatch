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
