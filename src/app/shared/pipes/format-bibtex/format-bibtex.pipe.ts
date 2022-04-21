import { Pipe, PipeTransform } from '@angular/core'


@Pipe({
  name: 'formatBibtex',
})
export class FormatBibtex implements PipeTransform {
  transform(text: string): string {
    var bibtexParse = require('@orcid/bibtex-parse-js');
    var formatted = bibtexParse.toBibtex(bibtexParse.toJSON(text), false)
    return formatted.trim();
  }
}
