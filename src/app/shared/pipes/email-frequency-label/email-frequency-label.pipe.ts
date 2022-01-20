import { Pipe, PipeTransform } from '@angular/core'
import { EmailFrequenciesLabels } from 'src/app/types/email-frequencies.endpoint'

@Pipe({
  name: 'emailFrequencyLabel',
})
export class EmailFrequencyLabelPipe implements PipeTransform {
  transform(value: string): string {
    return EmailFrequenciesLabels[value]
  }
}
