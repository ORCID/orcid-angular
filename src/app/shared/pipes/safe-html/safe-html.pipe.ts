import { Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { sanitizeHtmlForTrustedBypass } from '../../utils/sanitize-html-for-trusted-bypass'

@Pipe({
  name: 'safeHtml',
  standalone: false,
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}
  transform(value: string | null | undefined) {
    if (value == null) return value
    const safe = sanitizeHtmlForTrustedBypass(String(value))
    return this.sanitized.bypassSecurityTrustHtml(safe)
  }
}
