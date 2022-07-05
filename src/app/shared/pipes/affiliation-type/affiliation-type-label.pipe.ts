import { Pipe, PipeTransform } from '@angular/core'
import {
  AffiliationType,
  AffiliationTypeLabel,
} from 'src/app/types/record-affiliation.endpoint'

@Pipe({
  name: 'affiliationTypeLabel',
})
export class AffiliationTypeLabelPipe implements PipeTransform {
  transform(value: AffiliationType): string {
    return AffiliationTypeLabel[value] || ''
  }
}
