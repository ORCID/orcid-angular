import { Pipe, PipeTransform } from '@angular/core'
import { EmailFrequenciesLabels } from 'src/app/types/account-default-visibility.endpoint'

@Pipe({
  name: 'emailFrequencyLabel',
  standalone: false,
})
export class EmailFrequencyLabelPipe implements PipeTransform {
  transform(value: string): string {
    return EmailFrequenciesLabels[value]
  }
}
