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
        contributor.rolesAndSequences !== undefined &&
        contributor.rolesAndSequences.length > 0
      ) {
        contributor.rolesAndSequences.forEach((roleAndSequence, index) => {
          value = this.addRoleAndSequence(
            value,
            roleAndSequence,
            contributor.rolesAndSequences.length,
            index
          )
        })
      } else {
        if (contributor.contributorRole && contributor.contributorRole.value) {
          value = contributor.contributorRole.value.toLowerCase()
        }

        if (
          contributor.contributorSequence &&
          contributor.contributorSequence.value
        ) {
          value =
            this.addColon(value) +
            contributor.contributorSequence.value.toLowerCase()
        }
      }

      if (value?.length > 0) {
        value = '(' + value
        if (contributor?.orcid || contributor?.contributorOrcid?.path) {
          value = value + ','
        } else {
          value = value + ')'
        }
      }
    }
    return value
  }

  private addComma(str: string): string {
    if (str?.length > 0) {
      return str + ', '
    }
    return str
  }

  private addColon(str: string): string {
    if (str?.length > 0) {
      return str + ': '
    }
    return str
  }

  private addRoleAndSequence(
    value: string,
    roleAndSequence: { contributorRole: string; contributorSequence: string },
    length: number,
    index: number
  ): string {
    const sequence = roleAndSequence?.contributorSequence?.toLowerCase()
    const role = roleAndSequence?.contributorRole?.toLowerCase()
    if (role && sequence) {
      return (
        value +
        this.addColon(role) +
        (length - 1 === index ? sequence : this.addComma(sequence))
      )
    } else if (sequence && !role) {
      return this.addSingleValue(value, sequence, length, index)
    } else if (role && !sequence) {
      return this.addSingleValue(value, role, length, index)
    }
  }

  private addSingleValue(
    value: string,
    roleSequence: string,
    length: number,
    index: number
  ): string {
    return length - 1 === index
      ? value + roleSequence
      : value + this.addComma(roleSequence)
  }
}
