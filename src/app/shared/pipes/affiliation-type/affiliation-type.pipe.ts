import { Pipe, PipeTransform } from '@angular/core'
import { AffiliationType } from '../../../types/record-affiliation.endpoint'

@Pipe({
  name: 'affiliationType',
  standalone: false,
})
export class AffiliationTypePipe implements PipeTransform {
  transform(value: string): AffiliationType {
    switch (value) {
      case 'EDUCATION':
        return AffiliationType.education
      case 'QUALIFICATION':
        return AffiliationType.qualification
      case 'MEMBERSHIP':
        return AffiliationType.membership
      case 'SERVICE':
        return AffiliationType.service
      case 'DISTINCTION':
        return AffiliationType.distinction
      case 'INVITED_POSITION':
        return AffiliationType['invited-position']
    }
  }
}
