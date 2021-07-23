import { Pipe, PipeTransform } from '@angular/core'
import { MonthDayYearDate } from 'src/app/types'

@Pipe({
  name: 'monthDayYearDateToString',
})
export class MonthDayYearDateToStringPipe implements PipeTransform {
  transform(value: MonthDayYearDate): string {
    let dateString = ''

    if (value?.year) {
      dateString += value.year?.padStart(4, '0')
    } else {
      return ''
    }
    if (value?.month) {
      dateString += '-' + value.month?.padStart(2, '0')
    }

    if (value?.day) {
      dateString += '-' + value.day?.padStart(2, '0')
    }
    return dateString
  }
}
