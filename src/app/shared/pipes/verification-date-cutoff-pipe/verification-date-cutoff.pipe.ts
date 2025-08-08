import { Pipe, PipeTransform } from '@angular/core'
import { VERIFICATION_DATE_CUTOFF } from 'src/app/constants'

@Pipe({
    name: 'verificationDateCutoff',
    standalone: false
})
export class VerificationDateCutoffPipe implements PipeTransform {
  transform(value: string): string | null {
    if (typeof value === 'string') {
      const date = new Date(value)
      if (date >= VERIFICATION_DATE_CUTOFF) {
        return value
      }
    }
    return null
  }
}
