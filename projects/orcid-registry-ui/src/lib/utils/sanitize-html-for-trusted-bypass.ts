/**
 * Sanitizes HTML by removing script and style tags (and their content) so the
 * result is safe to pass to DomSanitizer.bypassSecurityTrustHtml().
 */
export function sanitizeHtmlForTrustedBypass(html: string): string {
  if (typeof html !== 'string') {
    return ''
  }
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
}
