import { Pipe, PipeTransform } from '@angular/core'
import { MonthDayYearDate } from 'src/app/types'

@Pipe({
  name: 'monthDayYearDateToString',
})
export class MonthDayYearDateToStringPipe implements PipeTransform {
  transform(value: MonthDayYearDate, args?: any): any {
    return value
      ? value.year
        ? value.year?.padStart(4, '0') + // Has a year to display
          (value.month?.padStart(2, '0')
            ? '-' +
              value.month?.padStart(2, '0') + // Has a month to display
              (value.day?.padStart(2, '0')
                ? '-' + value.day?.padStart(2, '0') // Has a day to display
                : '') // Has NO day to display
            : '') // Has NO month to display
        : '' // Has NO year to display
      : ''
  }
}
