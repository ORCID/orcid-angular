import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'trailingZeros',
  standalone: false,
})
export class TrailingZerosPipe implements PipeTransform {
  transform(date: number): string {
    if (date && Number(date) < 10) {
      return '0' + date.toString()
    }
    return date.toString()
  }
}
