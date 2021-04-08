import { Pipe, PipeTransform } from '@angular/core'
import { Contributor } from 'src/app/types'

@Pipe({
  name: 'contributorsPipe',
})
export class ContributorsPipe implements PipeTransform {
  transform(contributor: Contributor, args?: any): string {
    let value = ''
    if (contributor) {
      value += contributor.contributorRole ? contributor.contributorRole.value : ''
      value += contributor.contributorSequence ? this.addComma(value) + contributor.contributorSequence.value : ''
      value += contributor.orcid ? this.addComma(value) + contributor.orcid.value : ''
      value += contributor.email ?  this.addComma(value) + contributor.email.value : ''
      value = value.length > 0 ? '(' + value + ')' : ''
    }
    return value
  }

  addComma(str: string): string {
    if (str.length > 0) {
      return str + ', ';
    } 
    return str;
  }
}
