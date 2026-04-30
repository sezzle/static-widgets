# Test Suite Documentation

This directory contains unit tests for the Sezzle Static Widget SDK. Tests run under [`bun test`](https://bun.sh/docs/cli/test) with a [`jsdom`](https://github.com/jsdom/jsdom) DOM environment.

## Test Files

### 1. **sanitizer.test.js**
XSS sanitization tests covering:
- HTML sanitization with tag/attribute whitelisting
- XSS attack vector blocking
- Script source validation
- HTML escaping for template data
- OWASP XSS attack vectors
- Real-world widget scenarios

### 2. **awesomeHelper.test.js**
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

### 3. **awesomeSezzle.test.js**
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

## Setup

`bun test` is built into the Bun runtime — there's no separate test runner to install. The only test-time dependency is `jsdom`, declared in `devDependencies`. Running `bun install` (per the root `DEVELOPERS.md`) installs everything needed.

`tests/setup.js` is preloaded for every test run via `[test] preload` in `bunfig.toml`. It:

- Bootstraps a `jsdom` window and copies `window`/`document`/`navigator`/`HTMLElement`/`Element` and other DOM globals onto `globalThis`.
- Registers a `Bun.plugin` that stubs `.css` and `.scss` imports so source files (e.g. `src/awesomeSezzle.js`, which does `import "../css/global.scss"`) load cleanly without a sass compiler.
- Mocks `matchMedia`, `IntersectionObserver`, and `alert`.

## Running Tests

### Run all tests
```bash
bun test
```

### Run tests in watch mode
```bash
bun test --watch
```

### Run tests with coverage
```bash
bun test --coverage
```

### Run a specific test file
```bash
bun test tests/sanitizer.test.js
```

### Run tests matching a name pattern
```bash
bun test -t "currency"
```

(`-t` / `--test-name-pattern` filters by `describe` + `test` name. File path filtering is positional.)

## Test Coverage

```bash
bun test --coverage
```

Bun emits coverage to `coverage/` in lcov + text-summary by default. Configure additional formats in `bunfig.toml` under `[test]` if needed (e.g. `coverageReporter = ["lcov", "cobertura"]`). For a Cobertura report consumable by GitLab CI, point the pipeline at `coverage/cobertura-coverage.xml`.

Coverage metrics include:
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

`describe`, `test`, `it`, `expect`, and the `beforeEach` / `afterEach` / `beforeAll` / `afterAll` hooks are available as globals — no `import` needed. For mocks, import from `bun:test`:

```javascript
import { mock, spyOn } from "bun:test";

const fn = mock(() => "value");
const spy = spyOn(obj, "method");
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

Tests run in the `compile_js:unit_test` job defined by the shared DevOps templates included in the project's `.gitlab-ci.yml`. That job invokes `npm test`, which the project's `package.json` aliases to `bun test`. The CI runner installs Bun on the fly when it sees a committed `bun.lock`.

## Troubleshooting

### "Cannot find module" errors
- Ensure dependencies are installed: `bun install`
- Check that file paths in imports are correct

### "ReferenceError: document is not defined"
- The DOM globals come from `tests/setup.js`, which is preloaded via `[test] preload` in `bunfig.toml`. If you're running tests outside `bun test` (e.g. via `bun run`), the setup file won't be preloaded automatically.

### Tests timing out
- Bump the per-test timeout: pass `--timeout <ms>` to `bun test`, or set it inline:
  ```javascript
  test("slow case", async () => { /* ... */ }, 10000);
  ```
- Check for unresolved promises or async operations.

### CSS or SCSS import error
- Imports of `.css`/`.scss` are stubbed by the `Bun.plugin` registration in `tests/setup.js`. If a new file extension shows up (e.g. `.sass`, `.less`), extend the plugin's `filter` regex.

### Coverage not generated
- Run with `--coverage`.
- For thresholds and per-file include/exclude, use the `[test]` section of `bunfig.toml` (`coverageThreshold`, `coveragePathIgnorePatterns`).

## Contributing

When adding new features:
1. Write tests first (TDD approach recommended)
2. Ensure all tests pass: `bun test`
3. Maintain high coverage (aim for > 80%)
4. Add security tests for user-facing functions
5. Update this README if adding new test categories

## References

- [Bun test runner](https://bun.sh/docs/cli/test)
- [Bun mocks (`bun:test`)](https://bun.sh/docs/test/mocks)
- [`bunfig.toml` test config](https://bun.sh/docs/runtime/bunfig#test)
- [jsdom](https://github.com/jsdom/jsdom)
