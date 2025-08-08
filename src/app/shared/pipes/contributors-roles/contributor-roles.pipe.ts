import { Pipe, PipeTransform } from '@angular/core'
import {
  _LEGACY_ContributionRoles,
  ContributionRoles,
  Role,
} from '../../../types/works.endpoint'

@Pipe({
    name: 'contributorRoles',
    standalone: false
})
export class ContributorRolesPipe implements PipeTransform {
  transform(roles: { role: string }[]): unknown {
    return roles
      ?.map((r) => {
        const translation = this.getContributionRoleByKey(r.role)?.translation
        return translation ? translation : r.role
      })
      ?.join(', ')
  }

  private getContributionRoleByKey(key: string): Role {
    return (
      ContributionRoles.find((role) => role.key === key) ||
      _LEGACY_ContributionRoles.find((role) => role.key === key)
    )
  }
}
