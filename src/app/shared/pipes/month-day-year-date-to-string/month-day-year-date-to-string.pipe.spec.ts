import { MonthDayYearDateToStringPipe } from './month-day-year-date-to-string.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('MonthDayYearDateToStringPipe', () => {
  it('create an instance', () => {
    const pipe = new MonthDayYearDateToStringPipe()
    expect(pipe).toBeTruthy()
  })
})
