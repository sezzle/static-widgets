module.exports = {
   testEnvironment: "jsdom",
   testMatch: ["**/tests/**/*.test.js"],
   transform: {
     "^.+\\.js$": "babel-jest",
   },
   moduleFileExtensions: ["js", "json"],
   collectCoverageFrom: [
     "src/**/*.js",
     "!src/**/*.test.js",
     "!**/node_modules/**",
   ],
   coverageDirectory: "coverage",
   coverageReporters: ["text", "lcov", "html"],
   setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
   moduleNameMapper: {
     "\\.(css|scss)$": "<rootDir>/tests/__mocks__/styleMock.js",
   },
 };
