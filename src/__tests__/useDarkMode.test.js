import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from '../hooks/useDarkMode';

describe('useDarkMode', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should initialize with localStorage value if available', () => {
    localStorage.setItem('puzzlr-dark-mode', 'true');
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.dark).toBe(true);
  });

  it('should initialize with false if localStorage is false', () => {
    localStorage.setItem('puzzlr-dark-mode', 'false');
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.dark).toBe(false);
  });

  it('should toggle dark mode', () => {
    const { result } = renderHook(() => useDarkMode());
    const initialValue = result.current.dark;

    act(() => {
      result.current.toggle();
    });

    expect(result.current.dark).toBe(!initialValue);
  });

  it('should persist dark mode to localStorage', () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.toggle();
    });

    const stored = localStorage.getItem('puzzlr-dark-mode');
    expect(stored).toBe(String(result.current.dark));
  });

  it('should add dark class to document element when dark mode is on', () => {
    localStorage.setItem('puzzlr-dark-mode', 'true');
    renderHook(() => useDarkMode());
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should remove dark class from document element when dark mode is off', () => {
    localStorage.setItem('puzzlr-dark-mode', 'false');
    renderHook(() => useDarkMode());
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
