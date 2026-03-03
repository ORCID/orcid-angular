import { Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { sanitizeHtmlForTrustedBypass } from '../../utils/sanitize-html-for-trusted-bypass'

@Pipe({
  name: 'searchTermHighlight',
  standalone: false,
})
export class SearchTermHighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(
    value: string | null | undefined,
    searchTerm: string | null | undefined
  ): SafeHtml | string | null | undefined {
    if (!value || !searchTerm) {
      return value
    }
    const escapedSearch = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    const regex = new RegExp(escapedSearch, 'gi')
    const replacedValue = value.replace(
      regex,
      (match) => `<span class="highlight">${match}</span>`
    )
    const sanitized = sanitizeHtmlForTrustedBypass(replacedValue)
    return this.sanitizer.bypassSecurityTrustHtml(sanitized)
  }
}
