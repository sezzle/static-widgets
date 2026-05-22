/**
 * Comprehensive test suite for AwesomeSezzle widget
 *
 * Tests cover:
 * - Widget initialization and configuration
 * - Price formatting and calculations
 * - Product eligibility checks
 * - Currency symbol detection
 * - Monthly payment calculations with interest
 * - Number formatting with delimiters
 * - Edge cases and error handling
 */

import AwesomeSezzle from "../src/awesomeSezzle";

describe("AwesomeSezzle Widget", () => {
  describe("Constructor and Initialization", () => {
    test("should initialize with default options", () => {
      const widget = new AwesomeSezzle({});

      expect(widget.numberOfPayments).toBe(5);
      expect(widget.language).toBe("en");
      expect(widget.activeTab).toBe(1);
    });

    test("should support 5-payment option", () => {
      const widget = new AwesomeSezzle({ numberOfPayments: 5 });

      expect(widget.numberOfPayments).toBe(5);
    });

    test("should default to 5 payments for invalid numberOfPayments", () => {
      const widget1 = new AwesomeSezzle({ numberOfPayments: 3 });
      const widget2 = new AwesomeSezzle({ numberOfPayments: 6 });
      const widget3 = new AwesomeSezzle({ numberOfPayments: "invalid" });

      expect(widget1.numberOfPayments).toBe(5);
      expect(widget2.numberOfPayments).toBe(5);
      expect(widget3.numberOfPayments).toBe(5);
    });

    test("should set language from options", () => {
      const widgetEn = new AwesomeSezzle({ language: "en" });
      const widgetFr = new AwesomeSezzle({ language: "fr" });
      const widgetEs = new AwesomeSezzle({ language: "es" });

      expect(widgetEn.language).toBe("en");
      expect(widgetFr.language).toBe("fr");
      expect(widgetEs.language).toBe("es");
    });

    test("should default to English for unsupported language", () => {
      const widget = new AwesomeSezzle({ language: "de" });

      expect(widget.language).toBe("en");
    });
  });

  describe("currencySymbol() - Currency Detection", () => {
    let widget;

    beforeEach(() => {
      widget = new AwesomeSezzle({});
    });

    test("should detect dollar sign ($)", () => {
      const code = widget.currencySymbol("$99.99");
      expect(String.fromCharCode(code)).toBe("$");
    });

    test("should detect euro sign (€)", () => {
      const code = widget.currencySymbol("€99.99");
      expect(String.fromCharCode(code)).toBe("€");
    });

    test("should detect pound sign (£)", () => {
      const code = widget.currencySymbol("£99.99");
      expect(String.fromCharCode(code)).toBe("£");
    });

    test("should detect rupee sign (₹)", () => {
      const code = widget.currencySymbol("₹599.00");
      expect(String.fromCharCode(code)).toBe("₹");
    });

    // Note: ¥ (yen) detection is not implemented

    test("should handle prices without currency symbols", () => {
      const code = widget.currencySymbol("99.99");
      // Should return a default or null value
      expect(typeof code).toBe("number");
    });
  });

  describe("addDelimiters() - Number Formatting", () => {
    let widget;

    beforeEach(() => {
      widget = new AwesomeSezzle({});
    });

    test("should add thousand separators in default mode", () => {
      expect(widget.addDelimiters("1000", "default")).toBe("1,000.00");
      expect(widget.addDelimiters("10000", "default")).toBe("10,000.00");
      expect(widget.addDelimiters("100000", "default")).toBe("100,000.00");
      // Note: Payments >= $1,000,000 not supported
    });

    test("should preserve decimals in default mode", () => {
      expect(widget.addDelimiters("1000.00", "default")).toBe("1,000.00");
      expect(widget.addDelimiters("1234.56", "default")).toBe("1,234.56");
      expect(widget.addDelimiters("999999.99", "default")).toBe("999,999.99");
    });

    test("should use period separators in comma mode", () => {
      expect(widget.addDelimiters("1000", "comma")).toBe("1.000,00");
      expect(widget.addDelimiters("10000", "comma")).toBe("10.000,00");
      expect(widget.addDelimiters("100000", "comma")).toBe("100.000,00");
    });

    test("should use comma for decimals in comma mode", () => {
      expect(widget.addDelimiters("1000.00", "comma")).toBe("1.000,00");
      expect(widget.addDelimiters("1234.56", "comma")).toBe("1.234,56");
    });

    test("should use comma for decimals in comma mode for short prices (no thousands separator)", () => {
      expect(widget.addDelimiters("150.00", "comma")).toBe("150,00");
      expect(widget.addDelimiters("99.99", "comma")).toBe("99,99");
      expect(widget.addDelimiters("500.25", "comma")).toBe("500,25");
    });

    test("should handle numbers without delimiters", () => {
      expect(widget.addDelimiters("100", "default")).toBe("100.00");
      expect(widget.addDelimiters("99.99", "default")).toBe("99.99");
    });

    test("should handle edge cases", () => {
      expect(widget.addDelimiters("0", "default")).toBe("0.00");
      expect(widget.addDelimiters("0.00", "default")).toBe("0.00");
      expect(widget.addDelimiters("1", "default")).toBe("1.00");
      expect(widget.addDelimiters("0", "comma")).toBe("0,00");
    });
  });

  describe("isProductEligible() - 4-Pay Eligibility", () => {
    let widget;

    beforeEach(() => {
      // minPrice and maxPrice are in cents: $35.00 = 3500 cents, $2500.00 = 250000 cents
      widget = new AwesomeSezzle({ minPrice: 3500, maxPrice: 250000 });
    });

    test("should return true for prices within range", () => {
      expect(widget.isProductEligible("35.00")).toBe(true);
      expect(widget.isProductEligible("100.00")).toBe(true);
      expect(widget.isProductEligible("500.00")).toBe(true);
      expect(widget.isProductEligible("2500.00")).toBe(true);
    });

    test("should return false for prices below minimum", () => {
      expect(widget.isProductEligible("34.99")).toBe(false);
      expect(widget.isProductEligible("20.00")).toBe(false);
      expect(widget.isProductEligible("0.01")).toBe(false);
    });

    test("should return false for prices above maximum", () => {
      expect(widget.isProductEligible("2500.01")).toBe(false);
      expect(widget.isProductEligible("3000.00")).toBe(false);
      expect(widget.isProductEligible("10000.00")).toBe(false);
    });

    test("should handle prices with commas", () => {
      expect(widget.isProductEligible("1,234.56")).toBe(true);
      expect(widget.isProductEligible("2,500.00")).toBe(true);
    });

    test("should handle prices without currency symbols", () => {
      expect(widget.isProductEligible("100.00")).toBe(true);
      expect(widget.isProductEligible("2500.00")).toBe(true);
    });
  });

  describe("isProductEligibleLT() - Long-Term Eligibility", () => {
    let widget;

    beforeEach(() => {
      // minPriceLT and maxPriceLT are in cents: $250.00 = 25000 cents, $10000.00 = 1000000 cents
      widget = new AwesomeSezzle({ minPriceLT: 25000, maxPriceLT: 1000000 });
    });

    test("should return true for prices within long-term range", () => {
      expect(widget.isProductEligibleLT("250.00")).toBe(true);
      expect(widget.isProductEligibleLT("500.00")).toBe(true);
      expect(widget.isProductEligibleLT("5000.00")).toBe(true);
      expect(widget.isProductEligibleLT("10000.00")).toBe(true);
    });

    test("should return false for prices below minimum", () => {
      expect(widget.isProductEligibleLT("249.99")).toBe(false);
      expect(widget.isProductEligibleLT("100.00")).toBe(false);
    });

    test("should return false for prices above maximum", () => {
      expect(widget.isProductEligibleLT("10000.01")).toBe(false);
      expect(widget.isProductEligibleLT("15000.00")).toBe(false);
    });
  });

  describe("getFormattedPrice() - Price Calculation", () => {
    let widget;

    beforeEach(() => {
      widget = new AwesomeSezzle({ amount: "$100.00", parseMode: "default" });
    });

    test("should calculate 4-payment installments", () => {
      const formatted = widget.getFormattedPrice(4, "$100.00");
      expect(formatted).toContain("25");
    });

    test("should calculate 5-payment installments", () => {
      const formatted = widget.getFormattedPrice(5, "$100.00");
      expect(formatted).toContain("20");
    });

    test("should handle different amounts", () => {
      const formatted1 = widget.getFormattedPrice(4, "$200.00");
      expect(formatted1).toContain("50");

      const formatted2 = widget.getFormattedPrice(5, "$250.00");
      expect(formatted2).toContain("50");
    });

    test("should format prices with currency symbol", () => {
      const formatted = widget.getFormattedPrice(4, "$100.00");
      expect(formatted).toMatch(/\$/); // Should contain dollar sign
    });

    test("should handle prices with commas", () => {
      const formatted = widget.getFormattedPrice(4, "$1,000.00");
      expect(formatted).toContain("250");
    });
  });

  describe("calculateMonthlyWithInterest() - Interest Calculations", () => {
    let widget;

    beforeEach(() => {
      widget = new AwesomeSezzle({ parseMode: "default" });
    });

    test("should calculate monthly payment with 0% APR", () => {
      const monthly = widget.calculateMonthlyWithInterest("1200.00", 12, 0);
      expect(monthly).toBeCloseTo(100, 2);
    });

    test("should calculate monthly payment with interest", () => {
      const monthly = widget.calculateMonthlyWithInterest(
        "1200.00",
        12,
        10.0,
      );
      // With 10% APR, monthly payment should be higher than $100
      expect(monthly).toBeGreaterThan(100);
      expect(monthly).toBeLessThan(120);
    });

    test("should handle different APR rates", () => {
      const monthly5 = widget.calculateMonthlyWithInterest(
        "1200.00",
        12,
        5.0,
      );
      const monthly10 = widget.calculateMonthlyWithInterest(
        "1200.00",
        12,
        10.0,
      );
      const monthly15 = widget.calculateMonthlyWithInterest(
        "1200.00",
        12,
        15.0,
      );

      // Higher APR should result in higher monthly payments
      expect(monthly5).toBeLessThan(monthly10);
      expect(monthly10).toBeLessThan(monthly15);
    });

    test("should handle different term lengths", () => {
      const monthly6 = widget.calculateMonthlyWithInterest("1200.00", 6, 10);
      const monthly12 = widget.calculateMonthlyWithInterest("1200.00", 12, 10);
      const monthly24 = widget.calculateMonthlyWithInterest("1200.00", 24, 10);

      // Shorter terms should have higher monthly payments
      expect(monthly6).toBeGreaterThan(monthly12);
      expect(monthly12).toBeGreaterThan(monthly24);
    });
  });

  describe("formatMonthly() - Monthly Payment Formatting", () => {
    let widget;

    beforeEach(() => {
      widget = new AwesomeSezzle({ parseMode: "default" });
    });

    test("should format monthly payment amount", () => {
      const formatted = widget.formatMonthly("1200.00", "default", 12, 0);
      expect(formatted).toContain("100");
    });

    test("should include proper delimiters", () => {
      const formatted = widget.formatMonthly("12000.00", "default", 12, 0);
      expect(formatted).toContain("1,000");
    });

    test("should handle comma mode formatting", () => {
      const formatted = widget.formatMonthly("1200.00", "comma", 12, 0);
      expect(typeof formatted).toBe("string");
      expect(formatted.length).toBeGreaterThan(0);
    });
  });

  describe("formatTotalInterest() - Total Interest Calculation", () => {
    let widget;

    beforeEach(() => {
      widget = new AwesomeSezzle({ parseMode: "default" });
    });

    test("should return 0 for 0% APR", () => {
      const interest = widget.formatTotalInterest("1200.00", "default", 12, 0);
      expect(interest).toContain("0");
    });

    test("should calculate positive interest for APR > 0", () => {
      const interest = widget.formatTotalInterest(
        "1200.00",
        "default",
        12,
        10.0,
      );
      // Interest should be positive
      const numericValue = parseFloat(interest.replace(/[^0-9.]/g, ""));
      expect(numericValue).toBeGreaterThan(0);
    });

    test("should format with proper delimiters", () => {
      const interest = widget.formatTotalInterest(
        "10000.00",
        "default",
        12,
        15.0,
      );
      expect(typeof interest).toBe("string");
    });
  });

  describe("formatAdjustedTotal() - Adjusted Total Calculation", () => {
    let widget;

    beforeEach(() => {
      widget = new AwesomeSezzle({ parseMode: "default" });
    });

    test("should equal principal for 0% APR", () => {
      const total = widget.formatAdjustedTotal("1200.00", "default", 12, 0);
      expect(total).toContain("1,200");
    });

    test("should be greater than principal for APR > 0", () => {
      const principal = 1200;
      const total = widget.formatAdjustedTotal(
        "1200.00",
        "default",
        12,
        10.0,
      );

      // Remove formatting to get numeric value
      const numericTotal = parseFloat(total.replace(/[^0-9.]/g, ""));
      expect(numericTotal).toBeGreaterThan(principal);
    });

    test("should format large amounts with delimiters", () => {
      const total = widget.formatAdjustedTotal("10000.00", "default", 12, 10);
      expect(total).toMatch(/,/); // Should contain comma separator
    });
  });

  describe("updateInstallmentContent() - DOM Updates", () => {
    let widget;

    beforeEach(() => {
      widget = new AwesomeSezzle({});
    });

    test("should update textContent of HTMLCollection", () => {
      // Create mock HTML elements
      const mockElements = [
        { textContent: "" },
        { textContent: "" },
        { textContent: "" },
      ];
      mockElements.length = 3; // Set length property to simulate HTMLCollection

      widget.updateInstallmentContent(mockElements, "$25.00");

      expect(mockElements[0].textContent).toBe("$25.00");
      expect(mockElements[1].textContent).toBe("$25.00");
      expect(mockElements[2].textContent).toBe("$25.00");
    });

    test("should handle empty collections", () => {
      const mockElements = [];
      mockElements.length = 0;

      // Should not throw error
      expect(() => {
        widget.updateInstallmentContent(mockElements, "$25.00");
      }).not.toThrow();
    });
  });

  describe("Edge Cases and Error Handling", () => {
    test("should handle invalid constructor options gracefully", () => {
      expect(() => new AwesomeSezzle(null)).not.toThrow();
      expect(() => new AwesomeSezzle(undefined)).not.toThrow();
      expect(() => new AwesomeSezzle("invalid")).not.toThrow();
    });

    test("should handle empty price strings", () => {
      const widget = new AwesomeSezzle({});
      expect(widget.isProductEligible("")).toBe(false);
      expect(widget.isProductEligibleLT("")).toBe(false);
    });

    test("should handle malformed price strings", () => {
      const widget = new AwesomeSezzle({});
      expect(widget.isProductEligible("abc")).toBe(false);
      expect(widget.isProductEligible("$$$")).toBe(false);
      expect(widget.isProductEligible("NaN")).toBe(false);
    });

    test("should handle very large prices", () => {
      const widget = new AwesomeSezzle({
        minPrice: 0,
        maxPrice: Number.MAX_SAFE_INTEGER,
      });
      const formatted = widget.getFormattedPrice(4, "$1000000.00");
      expect(formatted).toBeTruthy();
      expect(formatted.length).toBeGreaterThan(0);
    });

    test("should handle very small decimal prices", () => {
      const widget = new AwesomeSezzle({ minPrice: 0, maxPrice: 100 });
      const formatted = widget.getFormattedPrice(4, "$0.04");
      expect(formatted).toBeTruthy();
    });
  });

  describe("numberOfPayments / widgetNumberOfPayments - Config Preserved", () => {
    test("numberOfPayments holds the original config and widgetNumberOfPayments mirrors it at construction", () => {
      const widget5 = new AwesomeSezzle({ numberOfPayments: 5 });
      const widget4 = new AwesomeSezzle({ numberOfPayments: 4 });
      const widgetDefault = new AwesomeSezzle({});

      expect(widget5.numberOfPayments).toBe(5);
      expect(widget4.numberOfPayments).toBe(4);
      expect(widgetDefault.numberOfPayments).toBe(5);

      expect(widget5.widgetNumberOfPayments).toBe(5);
      expect(widget4.widgetNumberOfPayments).toBe(4);
      expect(widgetDefault.widgetNumberOfPayments).toBe(5);
    });

    test("falls back widgetNumberOfPayments=4 when numberOfPayments=5 and amount < $50", () => {
      const widget = new AwesomeSezzle({ numberOfPayments: 5, amount: "$30.00" });
      try { widget.renderAwesomeSezzle(); } catch (e) { /* downstream DOM not relevant */ }
      expect(widget.widgetNumberOfPayments).toBe(4);
      expect(widget.numberOfPayments).toBe(5); // config unchanged
    });

    test("keeps widgetNumberOfPayments=5 when numberOfPayments=5 and amount >= $50", () => {
      const widget = new AwesomeSezzle({ numberOfPayments: 5, amount: "$50.00" });
      try { widget.renderAwesomeSezzle(); } catch (e) { /* downstream DOM not relevant */ }
      expect(widget.widgetNumberOfPayments).toBe(5);
    });
  });

  describe("getFormattedPrice() - forceInstallment flag", () => {
    test("forceInstallment=true divides amount evenly and skips the LT monthly-with-interest path", () => {
      // minPriceLT=15000 ($150) means $500 would normally take the LT path
      const widget = new AwesomeSezzle({
        amount: "$500.00",
        parseMode: "default",
        minPriceLT: 15000,
        maxPriceLT: 1500000,
        medianAPR: 21.99,
      });

      const forced = widget.getFormattedPrice(4, "$500.00", true);
      // $500 / 4 = $125.00 exactly — confirms LT path was skipped
      expect(forced).toContain("125.00");

      const ltPath = widget.getFormattedPrice(4, "$500.00", false);
      // LT path uses calculateMonthlyWithInterest, which yields a non-$125 value
      expect(ltPath).not.toContain("125.00");
    });
  });

  describe("maxPriceLT - Long-Term Max Price Configuration", () => {
    test("should default maxPriceLT to 1500000 when not provided", () => {
      const widget = new AwesomeSezzle({});
      expect(widget.maxPriceLT).toBe(1500000);
    });

    test("should use maxPriceLT when explicitly provided", () => {
      const widget = new AwesomeSezzle({ maxPriceLT: 2000000 });
      expect(widget.maxPriceLT).toBe(2000000);
    });

    test("should default maxPriceLT to 1500000 even when maxPrice is provided", () => {
      const widget = new AwesomeSezzle({ maxPrice: 1000000 });
      expect(widget.maxPriceLT).toBe(1500000);
    });

    test("should use explicit maxPriceLT regardless of maxPrice", () => {
      const widget = new AwesomeSezzle({ maxPrice: 1000000, maxPriceLT: 2000000 });
      expect(widget.maxPriceLT).toBe(2000000);
    });
  });

  describe("isProductEligibleLT() - Uses maxPriceLT", () => {
    test("should use maxPriceLT instead of maxPrice for LT upper bound", () => {
      const widget = new AwesomeSezzle({
        minPriceLT: 15000,
        maxPrice: 250000,
        maxPriceLT: 1500000,
      });
      // $5000 is above maxPrice but within maxPriceLT
      expect(widget.isProductEligibleLT("5000.00")).toBe(true);
      // $16000 is above maxPriceLT
      expect(widget.isProductEligibleLT("16000.00")).toBe(false);
    });

    test("should return false when LT is disabled (minPriceLT and LTgroup both unset)", () => {
      const widget = new AwesomeSezzle({ maxPriceLT: 1500000 });
      expect(widget.isProductEligibleLT("500.00")).toBe(false);
    });
  });

  describe("isProductEligible() - Extended Range with LT", () => {
    test("should use maxPriceLT as upper bound when LT is enabled", () => {
      const widget = new AwesomeSezzle({
        minPrice: 2000,
        maxPrice: 250000,
        minPriceLT: 15000,
        maxPriceLT: 1500000,
      });
      // $5000 exceeds maxPrice but is within maxPriceLT
      expect(widget.isProductEligible("5000.00")).toBe(true);
      // $16000 exceeds maxPriceLT
      expect(widget.isProductEligible("16000.00")).toBe(false);
    });

    test("should use maxPrice as upper bound when LT is disabled", () => {
      const widget = new AwesomeSezzle({
        minPrice: 2000,
        maxPrice: 250000,
      });
      expect(widget.isProductEligible("2500.00")).toBe(true);
      expect(widget.isProductEligible("2500.01")).toBe(false);
    });
  });

  describe("Real-World Scenarios", () => {
    test("should handle typical e-commerce price: $49.99", () => {
      const widget = new AwesomeSezzle({ amount: "$49.99" });
      const formatted = widget.getFormattedPrice(4, "$49.99");

      expect(formatted).toContain("12."); // Approximately $12.50 per payment
    });

    test("should handle luxury item price: $2,499.00", () => {
      const widget = new AwesomeSezzle({ amount: "$2,499.00" });
      const formatted = widget.getFormattedPrice(4, "$2,499.00");

      expect(formatted).toContain("624"); // Approximately $624.75 per payment
    });

    test("should calculate long-term financing for $5,000", () => {
      const widget = new AwesomeSezzle({ parseMode: "default" });
      const monthly12 = widget.formatMonthly("5000.00", "default", 12, 9.99);
      const monthly24 = widget.formatMonthly("5000.00", "default", 24, 9.99);
      const monthly36 = widget.formatMonthly("5000.00", "default", 36, 9.99);

      // All should be valid formatted strings
      expect(monthly12).toBeTruthy();
      expect(monthly24).toBeTruthy();
      expect(monthly36).toBeTruthy();

      // Longer terms should have smaller monthly payments
      const numeric12 = parseFloat(monthly12.replace(/[^0-9.]/g, ""));
      const numeric24 = parseFloat(monthly24.replace(/[^0-9.]/g, ""));
      const numeric36 = parseFloat(monthly36.replace(/[^0-9.]/g, ""));

      expect(numeric12).toBeGreaterThan(numeric24);
      expect(numeric24).toBeGreaterThan(numeric36);
    });

    test("should handle European pricing format", () => {
      const widget = new AwesomeSezzle({ parseMode: "comma" });
      const formatted = widget.addDelimiters("1234.56", "comma");

      expect(formatted).toBe("1.234,56");
    });

    test("should detect multiple currency types", () => {
      const widget = new AwesomeSezzle({});

      const usd = widget.currencySymbol("$99.99");
      const eur = widget.currencySymbol("€99,99");
      const gbp = widget.currencySymbol("£99.99");
      const inr = widget.currencySymbol("₹599.00");

      expect(String.fromCharCode(usd)).toBe("$");
      expect(String.fromCharCode(eur)).toBe("€");
      expect(String.fromCharCode(gbp)).toBe("£");
      expect(String.fromCharCode(inr)).toBe("₹");
    });
  });

  describe("LT Group Alias Configuration", () => {
    test("LTgroup is null when no LT options are provided, but Bread defaults still seed the LT fields", () => {
      const widget = new AwesomeSezzle({});
      expect(widget.LTgroup).toBeNull();
      expect(widget.maxPriceLT).toBe(1500000);
      expect(widget.minAPR).toBe(9.99);
      expect(widget.medianAPR).toBe(21.99);
      expect(widget.maxAPR).toBe(34.99);
      // minPriceLT stays opt-in (0) when LTgroup is not explicit
      expect(widget.minPriceLT).toBe(0);
    });

    test("LTgroup 'a' enables LT and applies Bread defaults including minPriceLT", () => {
      const widget = new AwesomeSezzle({ LTgroup: "a" });
      expect(widget.LTgroup).toBe("a");
      expect(widget.minPriceLT).toBe(15000);
      expect(widget.maxPriceLT).toBe(1500000);
      expect(widget.minAPR).toBe(9.99);
      expect(widget.medianAPR).toBe(21.99);
      expect(widget.maxAPR).toBe(34.99);
    });

    test("LTgroup 'b' applies Pagaya defaults", () => {
      const widget = new AwesomeSezzle({ LTgroup: "b" });
      expect(widget.LTgroup).toBe("b");
      expect(widget.minPriceLT).toBe(40000);
      expect(widget.maxPriceLT).toBe(800000);
      expect(widget.minAPR).toBe(24.99);
      expect(widget.medianAPR).toBe(29.99);
      expect(widget.maxAPR).toBe(35.99);
    });

    test("explicit options override LTgroup defaults", () => {
      const widget = new AwesomeSezzle({
        LTgroup: "b",
        minAPR: 19.99,
        maxPriceLT: 999999,
      });
      expect(widget.LTgroup).toBe("b");
      expect(widget.minAPR).toBe(19.99);
      expect(widget.maxPriceLT).toBe(999999);
      // unspecified fields still come from LTgroup 'b'
      expect(widget.medianAPR).toBe(29.99);
      expect(widget.maxAPR).toBe(35.99);
    });

    test("unknown LTgroup is rejected (this.LTgroup stays null), Bread defaults apply, and a warning is logged", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
      try {
        const widget = new AwesomeSezzle({ LTgroup: "nonexistent" });
        expect(widget.LTgroup).toBeNull();
        expect(widget.medianAPR).toBe(21.99);
        expect(widget.maxAPR).toBe(34.99);
        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy.mock.calls[0][0]).toContain('Unknown LTgroup "nonexistent"');
      } finally {
        warnSpy.mockRestore();
      }
    });

    test("does not warn for known LTgroups or when LTgroup is omitted", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
      try {
        new AwesomeSezzle({ LTgroup: "a" });
        new AwesomeSezzle({ LTgroup: "b" });
        new AwesomeSezzle({});
        expect(warnSpy).not.toHaveBeenCalled();
      } finally {
        warnSpy.mockRestore();
      }
    });

    test("setting minPriceLT without LTgroup auto-overrides LTgroup to 'a' (Bread defaults for other fields)", () => {
      const widget = new AwesomeSezzle({ minPriceLT: 50000 });
      expect(widget.LTgroup).toBe("a");
      expect(widget.minPriceLT).toBe(50000);
      expect(widget.medianAPR).toBe(21.99);
      expect(widget.maxAPR).toBe(34.99);
    });
  });

  describe("termsToShow - Config-driven term selection", () => {
    test("uses LTgroup 'a' Bread thresholds (cents) by default", () => {
      const widget = new AwesomeSezzle({});
      // priceInCents > 100000 -> top tier
      expect(widget.termsToShow(150000)).toEqual([24, 36, 48]);
      // priceInCents > 50000 -> mid tier
      expect(widget.termsToShow(60000)).toEqual([12, 18, 24]);
      // priceInCents > 30000 -> low tier
      expect(widget.termsToShow(40000)).toEqual([6, 9, 12]);
      // below all thresholds -> default
      expect(widget.termsToShow(10000)).toEqual([3, 6, 9]);
    });

    test("uses LTgroup 'b' Pagaya thresholds when LTgroup is 'b'", () => {
      const widget = new AwesomeSezzle({ LTgroup: "b" });
      expect(widget.termsToShow(150000)).toEqual([12, 24, 36]);
      expect(widget.termsToShow(90000)).toEqual([9, 12, 24]);
      expect(widget.termsToShow(70000)).toEqual([6, 9, 12]);
      expect(widget.termsToShow(10000)).toEqual([3, 6, 9]);
    });

    test("explicit termsToShow option overrides LTgroup default", () => {
      const widget = new AwesomeSezzle({
        LTgroup: "a",
        termsToShow: { 200000: [60], default: [12] },
      });
      expect(widget.termsToShow(300000)).toEqual([60]);
      expect(widget.termsToShow(100000)).toEqual([12]);
    });

    test("warns and falls back to LTgroup default when termsToShow is malformed", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
      try {
        const cases = [
          { foo: "bar" },        // values are not arrays
          "not an object",       // wrong type
          [[24, 36], [12]],      // array instead of object
          { 100000: [] },        // empty array
          { 100000: ["a", "b" ]},// non-numeric entries
          {},                    // empty object
          { 100000: [24, 36], default: "garbage" }, // one valid array, one invalid value
          { 100000: [24, 36], 50000: [NaN] },       // valid array alongside non-finite entry
        ];
        for (const bad of cases) {
          warnSpy.mockClear();
          const widget = new AwesomeSezzle({ LTgroup: "b", termsToShow: bad });
          // Assert on the message rather than count — robust to additional unrelated warnings
          const calls = warnSpy.mock.calls.map((args) => args[0]);
          expect(calls.some((msg) => typeof msg === "string" && msg.includes("Invalid `termsToShow`"))).toBe(true);
          // Falls back to LTgroup 'b' default
          expect(widget.termsToShowConfig).toEqual({
            100000: [12, 24, 36],
            80000: [9, 12, 24],
            60000: [6, 9, 12],
            default: [3, 6, 9],
          });
        }
      } finally {
        warnSpy.mockRestore();
      }
    });

    test("does not warn when termsToShow is omitted", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
      try {
        new AwesomeSezzle({ LTgroup: "a" });
        expect(warnSpy).not.toHaveBeenCalled();
      } finally {
        warnSpy.mockRestore();
      }
    });

    test("returns [] and warns once when no threshold matches and no default is set", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
      try {
        const widget = new AwesomeSezzle({
          LTgroup: "a",
          termsToShow: { 100000: [12, 24] }, // no default key
        });
        // Above-threshold price returns the configured array, no warning yet
        expect(widget.termsToShow(150000)).toEqual([12, 24]);
        expect(warnSpy).not.toHaveBeenCalled();

        // Below-threshold price returns [] and triggers the warning
        expect(widget.termsToShow(50000)).toEqual([]);
        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy.mock.calls[0][0]).toContain("no `default` key");

        // Subsequent below-threshold lookups do not re-warn
        widget.termsToShow(40000);
        widget.termsToShow(30000);
        expect(warnSpy).toHaveBeenCalledTimes(1);
      } finally {
        warnSpy.mockRestore();
      }
    });

    test("getFormattedPrice falls back to bi-weekly price when LT-eligible but termsToShow yields no terms", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
      try {
        const widget = new AwesomeSezzle({
          amount: "$200.00",
          parseMode: "default",
          minPriceLT: 5000,                   // LT enabled at $50
          termsToShow: { 100000: [12, 24] },  // but no default and threshold above $200
        });
        // $200 is LT-eligible by minPriceLT but has no matching terms
        const formatted = widget.getFormattedPrice(4, "$200.00", false);
        // $200 / 4 = $50.00 — confirms fallback to bi-weekly path, not NaN
        expect(formatted).toContain("50.00");
        expect(formatted).not.toContain("NaN");
      } finally {
        warnSpy.mockRestore();
      }
    });

    test("returned array is a copy — mutations do not corrupt the config", () => {
      const widget = new AwesomeSezzle({
        LTgroup: "a",
        termsToShow: { 100000: [24, 36, 48], default: [3, 6, 9] },
      });
      const aboveFirst = widget.termsToShow(150000);
      aboveFirst.reverse();
      aboveFirst.push(999);
      expect(widget.termsToShow(150000)).toEqual([24, 36, 48]);

      const belowFirst = widget.termsToShow(50000);
      belowFirst.length = 0;
      expect(widget.termsToShow(50000)).toEqual([3, 6, 9]);
    });

    test("derives minTermMonths and maxTermMonths from termsToShow union", () => {
      const widgetA = new AwesomeSezzle({ LTgroup: "a" });
      expect(widgetA.minTermMonths).toBe(3);
      expect(widgetA.maxTermMonths).toBe(48);

      const widgetB = new AwesomeSezzle({ LTgroup: "b" });
      expect(widgetB.minTermMonths).toBe(3);
      expect(widgetB.maxTermMonths).toBe(36);

      const custom = new AwesomeSezzle({
        termsToShow: { 100000: [60, 72], default: [6] },
      });
      expect(custom.minTermMonths).toBe(6);
      expect(custom.maxTermMonths).toBe(72);
    });
  });

  describe("formatLTterms - LTterms3 placeholder substitution", () => {
    test("substitutes APR range and term range from LTgroup 'a'", () => {
      const widget = new AwesomeSezzle({ LTgroup: "a", language: "en" });
      const out = widget.formatLTterms();
      expect(out).toContain("9.99% - 34.99%");
      expect(out).toContain("3 months – 48 months");
    });

    test("substitutes APR range and term range from LTgroup 'b'", () => {
      const widget = new AwesomeSezzle({ LTgroup: "b", language: "en" });
      const out = widget.formatLTterms();
      expect(out).toContain("24.99% - 35.99%");
      expect(out).toContain("3 months – 36 months");
    });

    test("formats APR with comma decimal in French", () => {
      const widget = new AwesomeSezzle({ LTgroup: "a", language: "fr" });
      const out = widget.formatLTterms();
      expect(out).toContain("9,99");
      expect(out).toContain("34,99");
    });
  });

  describe("formatAPR - locale-aware APR formatting", () => {
    test("uses dot decimal in English", () => {
      const widget = new AwesomeSezzle({ language: "en" });
      expect(widget.formatAPR(21.99)).toBe("21.99");
    });

    test("uses comma decimal in French and Spanish", () => {
      const widgetFr = new AwesomeSezzle({ language: "fr" });
      expect(widgetFr.formatAPR(21.99)).toBe("21,99");

      const widgetEs = new AwesomeSezzle({ language: "es" });
      expect(widgetEs.formatAPR(21.99)).toBe("21,99");
    });

    test("per-card APR in modal HTML uses localized formatting (French)", () => {
      const widget = new AwesomeSezzle({
        amount: "$500.00",
        parseMode: "default",
        LTgroup: "a",
        language: "fr",
      });
      const html = widget.buildModalHTML();
      // Disclaimer (already localized) and per-card APR rows now agree
      expect(html).toContain("21,99%");
      expect(html).not.toContain("21.99%");
    });
  });
});
