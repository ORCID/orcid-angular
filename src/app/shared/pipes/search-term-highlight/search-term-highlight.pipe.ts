import { Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Pipe({
  name: 'searchTermHighlight',
  standalone: false,
})
export class SearchTermHighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, searchTerm: string): SafeHtml {
    if (!value || !searchTerm) {
      return value
    }
    const regex = new RegExp(searchTerm, 'gi')
    const replacedValue = value.replace(
      regex,
      (match) => `<span class="highlight">${match}</span>`
    )
    return this.sanitizer.bypassSecurityTrustHtml(replacedValue)
  }
}
