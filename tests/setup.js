/**
 * Jest test setup file
 * Runs before each test file
 */

// Add custom matchers if needed
// expect.extend({
//   customMatcher(received, expected) {
//     // Custom matcher logic
//   }
// });

// Mock DOM APIs that might not be available in jsdom
if (typeof window !== "undefined") {
  // Mock window.matchMedia if needed
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: function () {},
        removeListener: function () {},
      };
    };

  // Mock IntersectionObserver if needed
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
    takeRecords() {
      return [];
    }
  };
}

// Suppress console errors during tests (optional)
// global.console.error = jest.fn();
// global.console.warn = jest.fn();
