import {
  shuffleArray,
  randomBetween,
  isInRange,
  capitalize,
  debounce,
} from '../utils/gameHelpers';

describe('gameHelpers', () => {
  describe('shuffleArray', () => {
    it('should return an array with the same elements', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      expect(shuffled.sort()).toEqual(original.sort());
    });

    it('should not modify the original array', () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      shuffleArray(original);
      expect(original).toEqual(originalCopy);
    });

    it('should return an array of the same length', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      expect(shuffled.length).toBe(original.length);
    });

    it('should handle empty arrays', () => {
      const shuffled = shuffleArray([]);
      expect(shuffled).toEqual([]);
    });

    it('should handle single element arrays', () => {
      const shuffled = shuffleArray([1]);
      expect(shuffled).toEqual([1]);
    });
  });

  describe('randomBetween', () => {
    it('should return a number within the specified range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomBetween(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
      }
    });

    it('should return an integer', () => {
      const result = randomBetween(1, 10);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should handle negative ranges', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomBetween(-10, -1);
        expect(result).toBeGreaterThanOrEqual(-10);
        expect(result).toBeLessThanOrEqual(-1);
      }
    });

    it('should handle same min and max', () => {
      const result = randomBetween(5, 5);
      expect(result).toBe(5);
    });
  });

  describe('isInRange', () => {
    it('should return true for values within range', () => {
      expect(isInRange(5, 1, 10)).toBe(true);
      expect(isInRange(1, 1, 10)).toBe(true);
      expect(isInRange(10, 1, 10)).toBe(true);
    });

    it('should return false for values outside range', () => {
      expect(isInRange(0, 1, 10)).toBe(false);
      expect(isInRange(11, 1, 10)).toBe(false);
    });

    it('should handle negative ranges', () => {
      expect(isInRange(-5, -10, 0)).toBe(true);
      expect(isInRange(-11, -10, 0)).toBe(false);
    });
  });

  describe('capitalize', () => {
    it('should capitalize the first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });

    it('should handle already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('should handle single character strings', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle non-string inputs', () => {
      expect(capitalize(null)).toBe('');
      expect(capitalize(undefined)).toBe('');
      expect(capitalize(123)).toBe('');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should delay function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(300);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should cancel previous calls when called again', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn();
      jest.advanceTimersByTime(100);
      debouncedFn();
      jest.advanceTimersByTime(100);

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(200);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to the debounced function', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn('test', 123);
      jest.advanceTimersByTime(300);

      expect(mockFn).toHaveBeenCalledWith('test', 123);
    });
  });
});
