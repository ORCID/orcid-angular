import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '../../../types/works.endpoint'

@Pipe({
  name: 'roleTranslation'
})
export class RoleTranslationPipe implements PipeTransform {

  transform(key: string, roles: Role[]): string {
    return roles.find(role => role.key === key).translation;
  }

}
