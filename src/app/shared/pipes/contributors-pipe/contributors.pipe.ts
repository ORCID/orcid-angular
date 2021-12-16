import { Pipe, PipeTransform } from '@angular/core'
import { Contributor } from 'src/app/types'

@Pipe({
  name: 'contributorsPipe',
})
export class ContributorsPipe implements PipeTransform {
  transform(contributor: Contributor, args?: any): string {
    let value = ''
    if (contributor) {
      if (
        contributor.contributorRolesAndSequence !== undefined &&
        contributor.contributorRolesAndSequence.length > 0
      ) {
        contributor.contributorRolesAndSequence.forEach((roleAndSequence, index) => {
          value =
            value + this.addColon(roleAndSequence.role) +
            (contributor.contributorRolesAndSequence.length - 1 === index ?
              roleAndSequence.sequence : this.addComma(roleAndSequence.sequence))
        })
      } else {
        if (contributor.contributorRole && contributor.contributorRole.value) {
          value = contributor.contributorRole.value
        }

        if (
          contributor.contributorSequence &&
          contributor.contributorSequence.value
        ) {
          value = this.addColon(value) + contributor.contributorSequence.value
        }
      }

      if (contributor.email && contributor.email.value) {
        value = this.addComma(value) + contributor.email.value
      }

      if (value.length > 0) {
        value = '(' + value + ')'
      }
    }
    return value
  }

  addComma(str: string): string {
    if (str?.length > 0) {
      return str + ', '
    }
    return str
  }

  addColon(str: string): string {
    if (str?.length > 0) {
      return str + ': '
    }
    return str
  }
}
