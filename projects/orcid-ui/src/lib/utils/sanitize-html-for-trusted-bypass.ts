/**
 * Sanitizes HTML by removing script/style tags, executable elements (img, iframe,
 * etc.), and event-handler attributes so the result is safe to pass to
 * DomSanitizer.bypassSecurityTrustHtml().
 * Use this whenever you need to render HTML that may contain user/content while
 * allowing only safe markup (e.g. no scripts).
 */
export function sanitizeHtmlForTrustedBypass(html: string): string {
  if (typeof html !== 'string') {
    return ''
  }
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '')
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
}
