import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'affiliationLabel',
})
export class AffiliationLabelPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null
  }
}
