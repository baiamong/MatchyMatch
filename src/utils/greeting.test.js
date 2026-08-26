import { greet } from '../utils/greeting';

describe('greet', () => {
  it('should return a greeting with the provided name', () => {
    expect(greet('Alice')).toBe('Hello, Alice!');
    expect(greet('Bob')).toBe('Hello, Bob!');
    expect(greet('World')).toBe('Hello, World!');
  });

  it('should return a default greeting when no name is provided', () => {
    expect(greet()).toBe('Hello, there!');
  });

  it('should return a default greeting when name is null', () => {
    expect(greet(null)).toBe('Hello, there!');
  });

  it('should return a default greeting when name is undefined', () => {
    expect(greet(undefined)).toBe('Hello, there!');
  });

  it('should return a default greeting when name is an empty string', () => {
    expect(greet('')).toBe('Hello, there!');
  });
});
