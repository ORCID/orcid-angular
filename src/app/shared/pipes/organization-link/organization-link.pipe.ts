import { Pipe, PipeTransform } from '@angular/core'
import { URL_REGEXP_BACKEND, WHITE_SPACE_REGEXP } from '../../../constants'

@Pipe({
  name: 'organizationLink',
  standalone: false,
})
export class OrganizationLinkPipe implements PipeTransform {
  transform(type: string, value: string): string {
    if (value) {
      if (this.isUrl(value)) {
        return value
      } else {
        return this.getLink(type, value)
      }
    }
  }

  isUrl(element): boolean {
    return RegExp(URL_REGEXP_BACKEND).test(element)
  }

  getLink(type: string, value: string): string {
    switch (type.toUpperCase()) {
      case 'TEST':
        return 'https://orcid.org/' + value
      case 'GRID':
        return value
      case 'ISNI':
        return 'https://isni.org/isni/' + value.replace(WHITE_SPACE_REGEXP, '')
      case 'LINKEDIN':
        return 'https://www.linkedin.com/company/' + value
      case 'WIKIDATA':
        return 'https://wikidata.org/wiki/' + value
      case 'ROR':
        return value
      default:
        return ''
    }
  }
}
