/**
 * Lightweight XSS Sanitization Module for Sezzle Widgets
 *
 * Provides custom HTML sanitization focused on widget-specific security needs
 * while maintaining minimal bundle size (~2-3KB vs ~6-8KB for DOMPurify).
 *
 * @module sanitizer
 */

/**
 * Allowed HTML tags for strict sanitization (user-supplied HTML)
 */
const ALLOWED_TAGS_STRICT = new Set([
  'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'button', 'a', 'img', 'svg', 'path', 'circle', 'rect', 'line', 'polygon',
  'ul', 'ol', 'li', 'br', 'strong', 'em', 'small', 'b', 'i',
  'table', 'thead', 'tbody', 'tr', 'td', 'th',
  'defs', 'lineargradient', 'stop', 'g'
]);

/**
 * Allowed attributes for sanitization
 */
const ALLOWED_ATTRS = new Set([
  'class', 'id', 'role', 'href', 'alt', 'title', 'src',
  'd', 'viewbox', 'width', 'height', 'fill', 'stroke', 'stroke-width',
  'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry',
  'points', 'offset', 'stop-color', 'stop-opacity',
  'xmlns', 'xmlns:xlink', 'version', 'preserveaspectratio',
  'data-testid', 'tabindex'
]);

/**
 * Attributes that start with these prefixes are allowed
 */
const ALLOWED_ATTR_PREFIXES = ['aria-', 'data-'];

/**
 * Dangerous tags that should always be removed
 */
const DANGEROUS_TAGS = new Set([
  'script', 'iframe', 'object', 'embed', 'style', 'link', 'meta', 'base',
  'form', 'input', 'textarea', 'select', 'option', 'frame', 'frameset'
]);

/**
 * Dangerous URL protocols
 */
const DANGEROUS_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:'];

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for HTML insertion
 */
function escapeHTML(str) {
  if (typeof str !== 'string') {
    return '';
  }

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };

  return str.replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * Checks if an attribute name is allowed
 * @param {string} attrName - Attribute name to check
 * @returns {boolean} True if attribute is allowed
 */
function isAllowedAttribute(attrName) {
  const lowerName = attrName.toLowerCase();

  // Block all event handlers (onclick, onerror, etc.)
  if (lowerName.startsWith('on')) {
    return false;
  }

  // Check if explicitly allowed
  if (ALLOWED_ATTRS.has(lowerName)) {
    return true;
  }

  // Check if matches allowed prefix (aria-*, data-*)
  return ALLOWED_ATTR_PREFIXES.some(prefix => lowerName.startsWith(prefix));
}

/**
 * Checks if a URL uses a dangerous protocol
 * @param {string} url - URL to check
 * @returns {boolean} True if URL is dangerous
 */
function hasDangerousProtocol(url) {
  if (!url) return false;

  const lowerUrl = url.toLowerCase().trim();
  return DANGEROUS_PROTOCOLS.some(protocol => lowerUrl.startsWith(protocol));
}

/**
 * Sanitizes HTML string by removing dangerous tags and attributes
 * @param {string} html - HTML string to sanitize
 * @param {boolean} strict - Use strict tag whitelist (default: true)
 * @returns {string} Sanitized HTML string
 */
function sanitizeHTML(html, strict = true) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Create a temporary DOM element to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Recursively clean the DOM tree
  cleanNode(temp, strict);

  return temp.innerHTML;
}

/**
 * Recursively cleans a DOM node and its children
 * @param {Node} node - DOM node to clean
 * @param {boolean} strict - Use strict tag whitelist
 */
function cleanNode(node, strict) {
  // Get all child nodes (use Array.from to avoid live collection issues)
  const children = Array.from(node.childNodes);

  for (const child of children) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const tagName = child.tagName.toLowerCase();

      // Remove dangerous tags completely
      if (DANGEROUS_TAGS.has(tagName)) {
        child.remove();
        continue;
      }

      // Remove tags not in whitelist (strict mode)
      if (strict && !ALLOWED_TAGS_STRICT.has(tagName)) {
        child.remove();
        continue;
      }

      // Clean attributes
      cleanAttributes(child);

      // Recursively clean children
      cleanNode(child, strict);
    }
    // Keep text nodes and comments as-is
  }
}

/**
 * Cleans attributes on a DOM element
 * @param {Element} element - DOM element to clean
 */
function cleanAttributes(element) {
  const attrs = Array.from(element.attributes);

  for (const attr of attrs) {
    const attrName = attr.name.toLowerCase();
    const attrValue = attr.value;

    // Remove if not in allowed list
    if (!isAllowedAttribute(attrName)) {
      element.removeAttribute(attr.name);
      continue;
    }

    // Check URL attributes for dangerous protocols
    if ((attrName === 'href' || attrName === 'src') && hasDangerousProtocol(attrValue)) {
      element.removeAttribute(attr.name);
      continue;
    }

    // Special handling for style attribute (block inline styles)
    if (attrName === 'style') {
      element.removeAttribute(attr.name);
      continue;
    }
  }
}

// Export functions for use in widget modules
export {
  sanitizeHTML,
  escapeHTML
};
