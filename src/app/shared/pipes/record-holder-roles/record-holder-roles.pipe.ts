import { Pipe, PipeTransform } from '@angular/core'
import {
  ContributionRoles,
  Role,
  _LEGACY_ContributionRoles,
} from 'src/app/types/works.endpoint'
import { Contributor } from '../../../types'

@Pipe({
  name: 'recordHolderRoles',
  standalone: false,
})
export class RecordHolderRolesPipe implements PipeTransform {
  transform(
    contributors: Contributor[],
    isPublicRecord: string,
    id: string
  ): string {
    let roles = null
    if (contributors?.length > 0) {
      contributors
        .find((contributor) => {
          return isPublicRecord
            ? contributor?.contributorOrcid?.path === isPublicRecord
            : contributor?.contributorOrcid?.path === id
        })
        ?.rolesAndSequences.forEach((roleAndSequence) => {
          if (roleAndSequence?.contributorRole) {
            let role = this.getContributionRoleByKey(
              roleAndSequence?.contributorRole?.toLowerCase()
            )?.translation
            if (roles) {
              roles = `${roles}, ${role}`
            } else {
              roles = role
            }
          }
        })
    }
    return roles
  }

  private getContributionRoleByKey(key: string): Role {
    return (
      ContributionRoles.find((role) => role.key === key) ||
      _LEGACY_ContributionRoles.find((role) => role.key === key)
    )
  }
}
