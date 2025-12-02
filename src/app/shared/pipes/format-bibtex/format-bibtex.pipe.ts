import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'formatBibtex',
  standalone: false,
})
export class FormatBibtex implements PipeTransform {
  transform(text: string): string {
    const bibtexParse = require('@orcid/bibtex-parse-js')
    const formatted = bibtexParse.toBibtex(bibtexParse.toJSON(text), false)
    return formatted.trim()
  }
}
