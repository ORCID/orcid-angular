import { Pipe, PipeTransform } from '@angular/core'
import { MonthDayYearDate } from 'src/app/types'

@Pipe({
  name: 'monthDayYearDateToString',
})
export class MonthDayYearDateToStringPipe implements PipeTransform {
  transform(value: MonthDayYearDate, args?: any): any {
    return value
      ? value.year
        ? value.year +
          (value.month
            ? '-' + value.month + (value.day ? '-' + value.day : '')
            : '')
        : ''
      : ''
  }
}
