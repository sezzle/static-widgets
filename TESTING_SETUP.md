# Testing Setup Guide

## Quick Start

### 1. Install Test Dependencies

Run the following command to install all required testing dependencies:

```bash
npm install --save-dev jest babel-jest @babel/preset-env @testing-library/jest-dom jest-environment-jsdom
```

### 2. Update package.json

Replace the test script in `package.json`:

**Before:**
```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 0",
  ...
}
```

**After:**
```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  ...
}
```

### 3. Create .babelrc (if not exists)

Create a `.babelrc` file in the project root:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ]
  ]
}
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode (for development)
npm run test:watch
```

## What Was Created

### Test Files
- ✅ `tests/sanitizer.test.js` - Already existed
- ✅ `tests/sanitizer.extended.test.js` - NEW: Extended XSS protection tests
- ✅ `tests/awesomeHelper.test.js` - NEW: Helper utility tests
- ✅ `tests/awesomeSezzle.test.js` - NEW: Main widget class tests

### Configuration Files
- ✅ `jest.config.js` - Jest configuration
- ✅ `tests/setup.js` - Test environment setup
- ✅ `tests/__mocks__/styleMock.js` - CSS import mock

### Documentation
- ✅ `tests/README.md` - Comprehensive test documentation
- ✅ `TESTING_SETUP.md` - This file

## Test Coverage

The test suite now covers:

### **awesomeHelper.js**
- ✅ isNumeric() - numeric validation
- ✅ isAlphabet() - alphabet validation
- ✅ parsePriceString() - price parsing (standard)
- ✅ parsePriceStringModeComma() - price parsing (European)
- ✅ parsePrice() - price conversion
- ✅ generateUniqueId() - ID generation
- ✅ generateSezzleLightSVG() - SVG generation (light)
- ✅ generateSezzleDarkSVG() - SVG generation (dark)
- ✅ svgImages() - SVG image map

### **awesomeSezzle.js**
- ✅ Constructor initialization
- ✅ currencySymbol() - currency detection
- ✅ addDelimiters() - number formatting
- ✅ isProductEligible() - 4-pay eligibility
- ✅ isProductEligibleLT() - long-term eligibility
- ✅ getFormattedPrice() - price calculations
- ✅ calculateMonthlyWithInterest() - interest calculations
- ✅ formatMonthly() - monthly payment formatting
- ✅ formatTotalInterest() - interest formatting
- ✅ formatAdjustedTotal() - total with interest
- ✅ updateInstallmentContent() - DOM updates

### **utils/sanitizer.js**
- ✅ sanitizeHTML() - HTML sanitization
- ✅ escapeHTML() - HTML entity escaping
- ✅ XSS attack vector protection
- ✅ Protocol-based attack blocking
- ✅ CSS injection protection
- ✅ SVG-based XSS protection
- ✅ Performance stress tests

## Test Statistics

- **Total test files**: 4
- **Estimated total tests**: ~200+
- **Modules tested**: 3 core files
- **Security tests**: 100+ XSS vectors covered

## Verification

After setup, verify everything works:

```bash
# Should show all tests passing
npm test

# Should generate coverage report
npm run test:coverage

# Coverage should be displayed in terminal
# HTML report available at: coverage/index.html
```

Expected output:
```
PASS  tests/sanitizer.test.js
PASS  tests/sanitizer.extended.test.js
PASS  tests/awesomeHelper.test.js
PASS  tests/awesomeSezzle.test.js

Test Suites: 4 passed, 4 total
Tests:       XXX passed, XXX total
Time:        X.XXXs
```

## Troubleshooting

### Issue: "Cannot find module 'babel-jest'"
**Solution**: Install dependencies
```bash
npm install --save-dev jest babel-jest @babel/preset-env
```

### Issue: "Cannot find module '../src/awesomeSezzle'"
**Solution**: Check that imports use correct paths relative to test files

### Issue: "ReferenceError: document is not defined"
**Solution**: Ensure jest.config.js has `testEnvironment: "jsdom"`

### Issue: Tests run but fail
**Solution**:
1. Check that source files export functions correctly
2. Verify function signatures match test expectations
3. Run individual test files to isolate issues:
   ```bash
   npm test awesomeHelper.test.js
   ```

## CI/CD Integration

### GitLab CI
Add to `.gitlab-ci.yml`:
```yaml
test:
  stage: test
  script:
    - npm install
    - npm test -- --coverage
  coverage: /All files[^|]*\|[^|]*\s+([\d\.]+)/
  artifacts:
    paths:
      - coverage/
```

### GitHub Actions
Add to `.github/workflows/test.yml`:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --coverage
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Update package.json scripts
3. ✅ Create .babelrc if needed
4. ✅ Run tests to verify setup
5. ✅ View coverage report
6. ✅ Add tests to CI/CD pipeline
7. ✅ Set coverage thresholds in jest.config.js (optional)

## Coverage Thresholds (Optional)

To enforce minimum coverage, add to `jest.config.js`:

```javascript
module.exports = {
  // ... existing config
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## Support

- Jest Documentation: https://jestjs.io/
- Babel Documentation: https://babeljs.io/
- Testing Library: https://testing-library.com/

---

**Ready to test!** 🚀
