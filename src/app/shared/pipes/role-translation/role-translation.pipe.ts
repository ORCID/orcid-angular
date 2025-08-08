import { Pipe, PipeTransform } from '@angular/core'
import {
  _LEGACY_ContributionRoles,
  ContributionRoles,
} from '../../../types/works.endpoint'

@Pipe({
    name: 'roleTranslation',
    standalone: false
})
export class RoleTranslationPipe implements PipeTransform {
  transform(key: string): string {
    return (
      ContributionRoles.find((role) => role.key === key) ||
      _LEGACY_ContributionRoles.find((role) => role.key === key)
    ).translation
  }
}
