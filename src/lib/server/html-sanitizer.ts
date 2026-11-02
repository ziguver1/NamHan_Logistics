/**
 * Server-side HTML Sanitizer & Slug Utilities.
 * Protects against XSS attacks and generates canonical slugs for Vietnamese text.
 */

// Allowed HTML tag names
const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u',
  'h2', 'h3', 'h4', 'h5',
  'ul', 'ol', 'li',
  'blockquote',
  'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td'
]);

/**
 * Sanitizes rich text HTML for announcement bodies.
 * Strips scripts, styles, dangerous tags, and malicious attributes.
 */
export function sanitizeHtmlContent(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';

  // 1. Remove dangerous script and style blocks entirely
  let clean = dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, ''); // Remove comments

  // 2. Parse and filter tags
  clean = clean.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (match, tagNameRaw, attrString) => {
    const tagName = tagNameRaw.toLowerCase();
    const isClosing = match.startsWith('</');

    if (!ALLOWED_TAGS.has(tagName)) {
      // Disallowed tag: completely strip
      return '';
    }

    if (isClosing) {
      return `</${tagName}>`;
    }

    // Filter attributes for allowed tags
    const safeAttrs: string[] = [];

    // Parse attributes
    const attrRegex = /([a-zA-Z0-9_-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let attrMatch: RegExpExecArray | null;

    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      const attrName = attrMatch[1]?.toLowerCase() || '';
      const attrVal = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';

      // Strictly deny any "on*" event handlers
      if (attrName.startsWith('on')) continue;
      // Deny javascript: or data: URIs
      const lowerVal = attrVal.toLowerCase().trim();
      if (lowerVal.startsWith('javascript:') || lowerVal.startsWith('vbscript:') || lowerVal.startsWith('data:text/html')) {
        continue;
      }

      if (tagName === 'a') {
        if (attrName === 'href') {
          // Allow safe hrefs (relative, https, http, mailto, tel)
          if (lowerVal.startsWith('/') || lowerVal.startsWith('https://') || lowerVal.startsWith('http://') || lowerVal.startsWith('mailto:') || lowerVal.startsWith('tel:')) {
            safeAttrs.push(`href="${escapeHtmlAttr(attrVal)}"`);
            safeAttrs.push('rel="noopener noreferrer"');
          }
        } else if (attrName === 'title') {
          safeAttrs.push(`title="${escapeHtmlAttr(attrVal)}"`);
        } else if (attrName === 'target' && attrVal === '_blank') {
          safeAttrs.push('target="_blank"');
        }
      } else if (tagName === 'img') {
        if (attrName === 'src') {
          // Allow local api files or https images
          if (lowerVal.startsWith('/') || lowerVal.startsWith('https://')) {
            safeAttrs.push(`src="${escapeHtmlAttr(attrVal)}"`);
            safeAttrs.push('loading="lazy"');
          }
        } else if (attrName === 'alt') {
          safeAttrs.push(`alt="${escapeHtmlAttr(attrVal)}"`);
        } else if (attrName === 'title') {
          safeAttrs.push(`title="${escapeHtmlAttr(attrVal)}"`);
        }
      } else if (tagName === 'th' || tagName === 'td') {
        if (attrName === 'colspan' || attrName === 'rowspan') {
          const num = parseInt(attrVal, 10);
          if (!isNaN(num) && num > 0 && num <= 20) {
            safeAttrs.push(`${attrName}="${num}"`);
          }
        }
      }
    }

    const renderedAttrs = safeAttrs.length > 0 ? ' ' + safeAttrs.join(' ') : '';
    if (tagName === 'br') {
      return '<br />';
    }
    if (tagName === 'img') {
      return `<img${renderedAttrs} />`;
    }
    return `<${tagName}${renderedAttrs}>`;
  });

  return clean.trim();
}

function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Converts Vietnamese string into clean URL-safe slug.
 * Example: "Thông báo lịch vận chuyển Tết 2026" -> "thong-bao-lich-van-chuyen-tet-2026"
 */
export function generateVietnameseSlug(text: string): string {
  if (!text) return '';

  let slug = text.toLowerCase();

  // Normalize Vietnamese accents
  slug = slug
    .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a')
    .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
    .replace(/[íìỉĩị]/g, 'i')
    .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
    .replace(/[úùủũụưứừửữự]/g, 'u')
    .replace(/[ýỳỷỹỵ]/g, 'y')
    .replace(/đ/g, 'd');

  // Replace special characters and non-alphanumeric with space, then hyphens
  slug = slug
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');

  // Strip leading/trailing hyphen
  return slug.replace(/^-+|-+$/g, '');
}
