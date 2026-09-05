import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

/**
 * Builds the Vimeo player URL for a video id.
 *
 * This is the one place in the homepage that bypasses Angular's sanitiser, and
 * it is safe because it never bypasses anything the CMS wrote: the id must be
 * digits, and the URL is assembled here from a constant. A non-numeric id
 * yields null and the caller renders no player at all.
 *
 * `dnt=1` asks Vimeo not to track the viewer, matching the current page.
 */
export function vimeoEmbedUrl(
  vimeoId: string | null | undefined,
  sanitizer: DomSanitizer
): SafeResourceUrl | null {
  if (typeof vimeoId !== 'string' || !/^\d{1,20}$/.test(vimeoId)) {
    return null
  }

  return sanitizer.bypassSecurityTrustResourceUrl(
    `https://player.vimeo.com/video/${vimeoId}?dnt=1`
  )
}
