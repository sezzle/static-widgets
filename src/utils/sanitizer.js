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
 * Whitelist of allowed script sources
 */
const ALLOWED_SCRIPT_ORIGINS = [
  'https://media.sezzle.com',
  'https://widget.sezzle.com'
];

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
 * Checks if a script source URL is from an allowed origin
 * @param {string} src - Script source URL
 * @returns {boolean} True if source is allowed
 */
function isAllowedScriptSource(src) {
  if (!src) return false;

  return ALLOWED_SCRIPT_ORIGINS.some(origin => src.startsWith(origin));
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

/**
 * Validates and sanitizes fetched HTML from trusted CDN
 * Less strict than user-supplied HTML since content is Sezzle-controlled
 * @param {string} html - HTML string from CDN
 * @returns {string} Sanitized HTML string
 */
function sanitizeFetchedHTML(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Use less strict sanitization (allow more tags)
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Remove only dangerous tags and attributes
  removeDangerousTags(temp);
  cleanNode(temp, false);

  return temp.innerHTML;
}

/**
 * Removes dangerous tags from a node tree
 * @param {Node} node - Root node to clean
 */
function removeDangerousTags(node) {
  const children = Array.from(node.childNodes);

  for (const child of children) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const tagName = child.tagName.toLowerCase();

      // Remove dangerous tags
      if (DANGEROUS_TAGS.has(tagName)) {
        child.remove();
        continue;
      }

      // Recursively process children
      removeDangerousTags(child);
    }
  }
}

/**
 * Extracts and validates script tags from HTML
 * Only allows scripts from whitelisted origins
 * @param {string} html - HTML string potentially containing scripts
 * @returns {Array<string>} Array of validated script URLs
 */
function extractValidatedScripts(html) {
  if (!html || typeof html !== 'string') {
    return [];
  }

  const temp = document.createElement('div');
  temp.innerHTML = html;

  const scripts = temp.querySelectorAll('script');
  const validatedScripts = [];

  for (const script of scripts) {
    const src = script.getAttribute('src');

    // Only allow external scripts with whitelisted sources
    // Block inline scripts completely
    if (src && isAllowedScriptSource(src)) {
      validatedScripts.push(src);
    }
  }

  return validatedScripts;
}

/**
 * Logs security events if logging is enabled
 * @param {string} eventType - Type of security event
 * @param {Object} details - Event details
 */
function logSecurityEvent(eventType, details) {
  // This function can be expanded to send events to analytics
  if (console && console.warn) {
    console.warn(`[Sezzle Security] ${eventType}:`, details);
  }
}

// Export functions for use in widget modules
export {
  sanitizeHTML,
  sanitizeFetchedHTML,
  escapeHTML,
  isAllowedScriptSource,
  extractValidatedScripts,
  logSecurityEvent,
  ALLOWED_SCRIPT_ORIGINS
};
