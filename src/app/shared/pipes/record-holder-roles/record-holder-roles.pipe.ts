import { Pipe, PipeTransform } from '@angular/core'
import { Contributor } from '../../../types'

@Pipe({
  name: 'recordHolderRoles',
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
            if (roles) {
              roles = `${roles}, ${roleAndSequence?.contributorRole?.toLowerCase()}`
            } else {
              roles = roleAndSequence?.contributorRole?.toLowerCase()
            }
          }
        })
    }
    return roles
  }
}
