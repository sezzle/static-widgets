/**
 * Comprehensive test suite for XSS sanitization
 *
 * Tests cover:
 * - HTML sanitization with tag/attribute whitelisting
 * - XSS attack vector blocking
 * - Script source validation
 * - HTML escaping for template data
 * - Edge cases and error handling
 */

import {
  sanitizeHTML,
  escapeHTML,
} from '../src/utils/sanitizer';

describe('Sanitizer Module - XSS Protection', () => {
  describe('sanitizeHTML() - User-supplied HTML', () => {
    test('should allow safe HTML tags', () => {
      const safe = '<div class="container"><span>Hello</span></div>';
      const result = sanitizeHTML(safe);
      expect(result).toContain('<div');
      expect(result).toContain('<span>Hello</span>');
    });

    test('should remove script tags', () => {
      const malicious = '<div>Hello<script>alert("XSS")</script></div>';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain('<script');
      expect(result).not.toContain('alert');
      expect(result).toContain('Hello');
    });

    test('should remove iframe tags', () => {
      const malicious = '<div><iframe src="evil.com"></iframe></div>';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain('<iframe');
    });

    test('should remove object and embed tags', () => {
      const malicious = '<object data="evil.swf"></object><embed src="evil.swf">';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain('<object');
      expect(result).not.toContain('<embed');
    });

    test('should remove event handler attributes', () => {
      const malicious = '<button onclick="alert(1)">Click</button>';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain('onclick');
      expect(result).toContain('<button');
    });

    test('should remove onerror handlers', () => {
      const malicious = '<img src=x onerror="alert(1)">';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain('onerror');
    });

    test('should remove onload handlers', () => {
      const malicious = '<svg onload="alert(1)"><path d="M0,0"></path></svg>';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain('onload');
    });

    test('should remove javascript: protocol in href', () => {
      const malicious = '<a href="javascript:alert(1)">Click</a>';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain('javascript:');
    });

    test('should remove data: protocol in img src', () => {
      const malicious = '<img src="data:text/html,<script>alert(1)</script>">';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain('data:');
    });

    test('should allow safe SVG content', () => {
      const safe = '<svg viewBox="0 0 100 100"><path d="M0,0 L100,100"></path></svg>';
      const result = sanitizeHTML(safe);
      expect(result).toContain('<svg');
      expect(result).toContain('<path');
    });

    test('should allow aria-* attributes', () => {
      const safe = '<div aria-label="Hello" aria-description="World">Content</div>';
      const result = sanitizeHTML(safe);
      expect(result).toContain('aria-label');
      expect(result).toContain('aria-description');
    });

    test('should allow data-* attributes', () => {
      const safe = '<div data-testid="my-test" data-value="123">Content</div>';
      const result = sanitizeHTML(safe);
      expect(result).toContain('data-testid');
      expect(result).toContain('data-value');
    });

    test('should remove style attributes (inline styles)', () => {
      const malicious = '<div style="background:url(javascript:alert(1))">Content</div>';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain('style=');
    });

    test('should handle empty or null input', () => {
      expect(sanitizeHTML('')).toBe('');
      expect(sanitizeHTML(null)).toBe('');
      expect(sanitizeHTML(undefined)).toBe('');
    });

    test('should handle non-string input', () => {
      expect(sanitizeHTML(123)).toBe('');
      expect(sanitizeHTML({})).toBe('');
      expect(sanitizeHTML([])).toBe('');
    });
  });

  describe('escapeHTML() - Template data escaping', () => {
    test('should escape < and >', () => {
      const input = '<script>alert(1)</script>';
      const result = escapeHTML(input);
      expect(result).toBe('&lt;script&gt;alert(1)&lt;&#x2F;script&gt;');
    });

    test('should escape quotes', () => {
      const input = 'Hello "World" and \'Universe\'';
      const result = escapeHTML(input);
      expect(result).toContain('&quot;');
      expect(result).toContain('&#x27;');
    });

    test('should escape ampersands', () => {
      const input = 'Company & Co.';
      const result = escapeHTML(input);
      expect(result).toContain('&amp;');
    });

    test('should handle non-string input safely', () => {
      expect(escapeHTML(null)).toBe('');
      expect(escapeHTML(undefined)).toBe('');
      expect(escapeHTML(123)).toBe('');
    });

    test('should escape slashes', () => {
      const input = '</script>';
      const result = escapeHTML(input);
      expect(result).toContain('&#x2F;');
    });
  });

  describe('OWASP XSS Attack Vectors', () => {
    const xssVectors = [
      '<img src=x onerror=alert(1)>',
      '<svg onload=alert(1)>',
      '<iframe src=javascript:alert(1)>',
      '<object data="data:text/html,<script>alert(1)</script>">',
      '<embed src="javascript:alert(1)">',
      '<a href="javascript:alert(1)">click</a>',
      '<form action="javascript:alert(1)">',
      '<input onfocus=alert(1) autofocus>',
      '<select onfocus=alert(1) autofocus>',
      '<textarea onfocus=alert(1) autofocus>',
      '<body onload=alert(1)>',
      '<marquee onstart=alert(1)>',
      '<details open ontoggle=alert(1)>',
      '<video><source onerror=alert(1)>',
      '<audio src=x onerror=alert(1)>',
      '<img src="x" onerror="alert(String.fromCharCode(88,83,83))">',
      '<img src=x:alert(1) onerror=eval(src)>',
      '<svg><script>alert(1)</script></svg>',
      '<math><mi xlink:href="data:x,<script>alert(1)</script>">',
      '<div style="background:url(javascript:alert(1))">',
    ];

    xssVectors.forEach((vector) => {
      test(`should block XSS vector: ${vector.substring(0, 50)}...`, () => {
        const result = sanitizeHTML(vector);

        // Check that dangerous event handlers are removed
        expect(result).not.toMatch(/\son\w+\s*=/i); // Event handlers like onclick=, onerror=, etc.

        // Check that javascript: protocol is removed from href/src/action attributes
        expect(result).not.toMatch(/(href|src|action|data)\s*=\s*["']?\s*javascript:/i);

        // Check that script tags are removed
        expect(result).not.toMatch(/<script[\s>]/i);

        // Check that style attributes with javascript are removed
        expect(result).not.toMatch(/style\s*=.*javascript:/i);
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle deeply nested HTML', () => {
      const nested = '<div><div><div><div><span>Deep</span></div></div></div></div>';
      const result = sanitizeHTML(nested);
      expect(result).toContain('Deep');
    });

    test('should handle malformed HTML', () => {
      const malformed = '<div><span>Unclosed';
      const result = sanitizeHTML(malformed);
      expect(result).toContain('Unclosed');
    });

    test('should handle HTML with special characters', () => {
      const special = '<div>Price: $99.99 & free shipping!</div>';
      const result = sanitizeHTML(special);
      expect(result).toContain('$99.99');
    });

    test('should preserve whitespace in text content', () => {
      const whitespace = '<div>  Hello   World  </div>';
      const result = sanitizeHTML(whitespace);
      expect(result).toContain('Hello');
      expect(result).toContain('World');
    });

    test('should handle unicode characters', () => {
      const unicode = '<div>Café ☕ 日本語</div>';
      const result = sanitizeHTML(unicode);
      expect(result).toContain('Café');
      expect(result).toContain('☕');
      expect(result).toContain('日本語');
    });

    test('should handle HTML entities', () => {
      const entities = '<div>&lt;script&gt;alert(1)&lt;/script&gt;</div>';
      const result = sanitizeHTML(entities);
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });

    test('should handle very long strings', () => {
      const long = '<div>' + 'A'.repeat(10000) + '</div>';
      const result = sanitizeHTML(long);
      expect(result).toContain('A'.repeat(100)); // Check partial match
    });
  });

  describe('Real-world Widget Scenarios', () => {
    test('should sanitize user-provided modal HTML', () => {
      const userHTML = `
        <div class="custom-modal">
          <h2>Payment Options</h2>
          <p>Choose your plan</p>
          <script>trackUser()</script>
        </div>
      `;
      const result = sanitizeHTML(userHTML);
      expect(result).toContain('Payment Options');
      expect(result).toContain('Choose your plan');
      expect(result).not.toContain('trackUser');
    });

    test('should escape price data in templates', () => {
      const maliciousPrice = '<script>alert(1)</script>99.99';
      const escaped = escapeHTML(maliciousPrice);
      expect(escaped).not.toContain('<script');
      expect(escaped).toContain('&lt;script&gt;');
    });

    test('should allow SVG logos', () => {
      const svg = `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,10 L90,90" stroke="black" />
          <circle cx="50" cy="50" r="40" fill="blue" />
        </svg>
      `;
      const result = sanitizeHTML(svg);
      expect(result).toContain('<svg');
      expect(result).toContain('<path');
      expect(result).toContain('<circle');
    });

    test('should preserve accessibility attributes', () => {
      const accessible = `
        <button
          aria-label="Close modal"
          aria-description="Closes the Sezzle information modal"
          role="button">
          ×
        </button>
      `;
      const result = sanitizeHTML(accessible);
      expect(result).toContain('aria-label');
      expect(result).toContain('aria-description');
      expect(result).toContain('role="button"');
    });
  });
});
