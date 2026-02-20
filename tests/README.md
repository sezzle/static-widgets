# Test Suite Documentation

This directory contains comprehensive unit tests for the Sezzle Static Widget SDK.

## Test Files

### 1. **sanitizer.test.js** (Existing)
Original test suite for XSS sanitization covering:
- HTML sanitization with tag/attribute whitelisting
- XSS attack vector blocking
- Script source validation
- HTML escaping for template data
- OWASP XSS attack vectors
- Real-world widget scenarios

### 2. **sanitizer.extended.test.js** (New)
Extended sanitization tests covering:
- Advanced XSS attack vectors (encoded, obfuscated, Base64)
- Protocol-based attacks (javascript:, vbscript:, data:)
- CSS injection attacks
- SVG-based XSS
- Form-based attacks
- Meta tag attacks
- Performance and stress testing
- Browser-specific attack vectors

### 3. **awesomeHelper.test.js** (New)
Helper utility function tests covering:
- `isNumeric()` - numeric validation
- `isAlphabet()` - alphabetic validation
- `parsePriceString()` - price string parsing (standard mode)
- `parsePriceStringModeComma()` - European price format parsing
- `parsePrice()` - price conversion to float
- `generateUniqueId()` - unique ID generation
- `generateSezzleLightSVG()` / `generateSezzleDarkSVG()` - SVG generation
- `svgImages()` - SVG image map
- Edge cases and integration scenarios

### 4. **awesomeSezzle.test.js** (New)
Main widget class tests covering:
- Constructor and initialization
- `currencySymbol()` - currency detection ($, €, £, ¥, ₹)
- `addDelimiters()` - number formatting with thousand separators
- `isProductEligible()` - 4-pay eligibility checks
- `isProductEligibleLT()` - long-term financing eligibility
- `getFormattedPrice()` - installment price calculation
- `calculateMonthlyWithInterest()` - interest calculations
- `formatMonthly()` - monthly payment formatting
- `formatTotalInterest()` - total interest calculation
- `formatAdjustedTotal()` - adjusted total with interest
- `updateInstallmentContent()` - DOM update functionality
- Real-world e-commerce scenarios

## Installation

First, install the required testing dependencies:

```bash
npm install --save-dev jest babel-jest @babel/preset-env @testing-library/jest-dom jest-environment-jsdom
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run specific test file
```bash
npm test sanitizer.test.js
npm test awesomeHelper.test.js
npm test awesomeSezzle.test.js
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="currency"
```

## Test Coverage

To generate and view a coverage report:

```bash
npm test -- --coverage
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

Coverage reports include:
- **Statements**: % of code statements executed
- **Branches**: % of conditional branches tested
- **Functions**: % of functions called
- **Lines**: % of lines executed

## Writing New Tests

### Test Structure
```javascript
describe("Feature Name", () => {
  describe("Sub-feature", () => {
    test("should do something specific", () => {
      // Arrange
      const input = "test input";

      // Act
      const result = functionToTest(input);

      // Assert
      expect(result).toBe("expected output");
    });
  });
});
```

### Common Matchers
```javascript
expect(value).toBe(expected);              // Exact equality (===)
expect(value).toEqual(expected);           // Deep equality
expect(value).toBeTruthy();                // Truthy value
expect(value).toBeFalsy();                 // Falsy value
expect(value).toBeNull();                  // null
expect(value).toBeUndefined();             // undefined
expect(value).toBeGreaterThan(number);     // >
expect(value).toBeCloseTo(number, digits); // Floating point ~=
expect(value).toMatch(/regex/);            // String matches regex
expect(value).toContain(item);             // Array/string contains
expect(fn).toThrow();                      // Function throws error
```

## Best Practices

1. **Test Organization**
   - Group related tests using `describe()` blocks
   - Use clear, descriptive test names
   - Follow the Arrange-Act-Assert pattern

2. **Test Independence**
   - Each test should be independent
   - Use `beforeEach()` for setup
   - Don't rely on test execution order

3. **Edge Cases**
   - Test boundary conditions
   - Test error scenarios
   - Test with invalid/unexpected input

4. **Security Testing**
   - Always test sanitization functions
   - Include real-world attack vectors
   - Test multiple encoding variants

5. **Performance**
   - Keep tests fast (< 100ms each)
   - Mock expensive operations
   - Use `beforeAll()` for one-time setup

## Continuous Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# .gitlab-ci.yml example
test:
  script:
    - npm install
    - npm test -- --coverage
  artifacts:
    paths:
      - coverage/
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
```

## Troubleshooting

### "Cannot find module" errors
- Ensure all dependencies are installed: `npm install`
- Check that file paths in imports are correct

### "ReferenceError: document is not defined"
- Make sure `jest.config.js` has `testEnvironment: "jsdom"`

### Tests timing out
- Increase timeout: `jest.setTimeout(10000);` in setup.js
- Check for infinite loops or async operations

### Coverage not generated
- Run with `--coverage` flag
- Check `collectCoverageFrom` in jest.config.js

## Contributing

When adding new features:
1. Write tests first (TDD approach recommended)
2. Ensure all tests pass: `npm test`
3. Maintain high coverage (aim for > 80%)
4. Add security tests for user-facing functions
5. Update this README if adding new test categories

## Questions?

For questions about the test suite, contact the development team or refer to:
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://testingjavascript.com/)
