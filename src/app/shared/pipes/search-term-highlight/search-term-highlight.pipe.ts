import { Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { sanitizeHtmlForTrustedBypass } from '@orcid/ui'

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
    if (!value) {
      return value
    }
    let replacedValue = value
    if (searchTerm) {
      const escapedSearch = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      const regex = new RegExp(escapedSearch, 'gi')
      replacedValue = value.replace(
        regex,
        (match) => `<span class="highlight">${match}</span>`
      )
    }
    const sanitized = sanitizeHtmlForTrustedBypass(replacedValue)
    return this.sanitizer.bypassSecurityTrustHtml(sanitized)
  }
}
