import { Pipe, PipeTransform } from '@angular/core'
import {
  ScopePathType,
  ScopePathTypeLabel,
} from '../../../types/account-trusted-organizations'

@Pipe({
    name: 'scopePathType',
    standalone: false
})
export class ScopePathTypePipe implements PipeTransform {
  transform(value: string): string {
    return ScopePathTypeLabel[value] || ''
  }
}
