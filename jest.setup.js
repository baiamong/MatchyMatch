import '@testing-library/jest-dom';

// jsdom doesn't implement matchMedia; useDarkMode reads it for the initial
// OS-preference fallback when localStorage has no stored value yet.
window.matchMedia = window.matchMedia || function matchMedia(query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  };
};
