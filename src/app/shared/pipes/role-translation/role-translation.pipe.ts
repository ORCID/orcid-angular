import { Pipe, PipeTransform } from '@angular/core'
import {
  ContributionRoles,
  _LEGACY_ContributionRoles,
  Role,
} from '../../../types/works.endpoint'

@Pipe({
  name: 'roleTranslation',
})
export class RoleTranslationPipe implements PipeTransform {
  transform(key: string): string {
    return (
      ContributionRoles.find((role) => role.key === key) ||
      _LEGACY_ContributionRoles.find((role) => role.key === key)
    ).translation
  }
}
