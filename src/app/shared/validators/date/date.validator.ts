import { AbstractControl } from '@angular/forms'

export function dateValidator(dateType: string) {
  return (c: AbstractControl): { [key: string]: any } | null => {
    const year = c.get(dateType + 'Year').value
    const month = c.get(dateType + 'Month').value
    const day = c.get(dateType + 'Day').value

    if (!year && !month && !day) {
      return null
    }

    let date

    if (year && !month && !day) {
      date = new Date(year)
    }

    if (year && month && !day) {
      date = new Date(year + '-' + (month < 10 ? '0' + month : month))
    }

    if (year && month && day) {
      date = new Date(year, month - 1, day)

      if (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      ) {
        return null
      } else {
        return { date: true }
      }
    }

    if (date && !isNaN(date.getTime())) {
      return null
    }

    return { date: true }
  }
}

export function dateMonthYearValidator(dateType: string, formHasDay = true) {
  return (c: AbstractControl): { [key: string]: any } | null => {
    const year = c.get(dateType + 'Year').value
    const month = c.get(dateType + 'Month').value

    console.log('dateMonthYearValidator', dateType)

    if (!year && !month) {
      return null
    }

    let date

    if (year && !month) {
      date = new Date(year)
    }

    if (year && month) {
      date = new Date(year + '-' + (month < 10 ? '0' + month : month))
    }

    console.log('dateMonthYearValidator', date)

    if (date && !isNaN(date.getTime())) {
      return null
    }


    return { date: true }
  }
}

export function endDateMonthYearValidator(): (c: AbstractControl) => {
  [key: string]: any
} {
  return (c: AbstractControl): { [key: string]: any } | null => {
    const endDateExistingErrors = Object.keys(
      c.get('endDateGroup').errors || {}
    )
    const startDateExistingErrors = Object.keys(
      c.get('startDateGroup').errors || {}
    )
    if (endDateExistingErrors.length || startDateExistingErrors.length) {
      // both date has to be valid to validate end date congruence
      return null
    }

    const endDateYear = c.get('endDateGroup.endDateYear').value
    let endDateMonth = c.get('endDateGroup.endDateMonth').value

    const startDateYear = c.get('startDateGroup.startDateYear').value
    let startDateMonth = c.get('startDateGroup.startDateMonth').value

    if (!endDateYear || !startDateYear) {
      return null
    }

    if (!startDateMonth) {
      startDateMonth = 1
    }

    if (!endDateMonth) {
      endDateMonth = 12
    }

    const dates = startAndEndDate(
      startDateYear,
      endDateYear,
      startDateMonth,
      endDateMonth
    )

    // Cloning old app and backend behaviour.
    // if the end-month is defined and the start-year and end-year are the same, start-month MUST be defined
    if (
      endDateMonth &&
      !startDateMonth &&
      startDateYear &&
      endDateYear &&
      startDateYear === endDateYear
    ) {
      return { invalidEndDate: true }
    }

    if (dates.endDate < dates.startDate) {
      return { invalidEndDate: true }
    }

    if (dates.endDate < dates.startDate) {
      return { invalidEndDate: true }
    }

    return null
  }
}

export function endDateValidator() {
  return (c: AbstractControl): { [key: string]: any } | null => {
    const endDateExistingErrors = Object.keys(
      c.get('endDateGroup').errors || {}
    )
    const startDateExistingErrors = Object.keys(
      c.get('startDateGroup').errors || {}
    )
    if (endDateExistingErrors.length || startDateExistingErrors.length) {
      // both date has to be valid to validate end date congruence
      return null
    }

    const endDateYear = c.get('endDateGroup.endDateYear').value
    let endDateMonth = c.get('endDateGroup.endDateMonth').value
    let endDateDay = c.get('endDateGroup.endDateDay').value

    const startDateYear = c.get('startDateGroup.startDateYear').value
    let startDateMonth = c.get('startDateGroup.startDateMonth').value
    let startDateDay = c.get('startDateGroup.startDateDay').value

    if (!endDateYear || !startDateYear) {
      return null
    }

    if (!startDateMonth) {
      startDateMonth = 1
    }

    if (!startDateDay) {
      startDateDay = 1
    }

    if (!endDateMonth) {
      endDateMonth = 12
    }

    if (!endDateDay) {
      endDateDay = 31
    }

    const dates = startAndEndDate(
      startDateYear,
      endDateYear,
      startDateMonth,
      endDateMonth,
      startDateDay,
      endDateDay
    )
    // Cloning old app and backend behaviour.
    // if the end-month is defined and the start-year and end-year are the same, start-month MUST be defined
    if (
      endDateMonth &&
      !startDateMonth &&
      startDateYear &&
      endDateYear &&
      startDateYear === endDateYear
    ) {
      return { invalidEndDate: true }
    }
    // Cloning old app and backend behaviour.
    // if the end-day is defined and the start-year/month and end-year/month are the same, start-month MUST be defined
    if (
      endDateDay &&
      !startDateDay &&
      startDateYear &&
      endDateYear &&
      endDateMonth &&
      endDateDay &&
      startDateYear === endDateYear &&
      endDateMonth === endDateDay
    ) {
      return { invalidEndDate: true }
    }

    if (dates.endDate < dates.startDate) {
      return { invalidEndDate: true }
    }

    return null
  }
}

function startAndEndDate(
  startDateYear: number,
  endDateYear: number,
  startDateMonth: number,
  endDateMonth: number,
  startDateDay?: number,
  endDateDay?: number
): { startDate: Date; endDate: Date } {
  if (
    startDateYear &&
    endDateYear &&
    startDateMonth &&
    endDateMonth &&
    startDateDay &&
    endDateDay
  ) {
    const startDate = getDateFromNumbers(
      startDateYear,
      startDateMonth,
      startDateDay
    )
    const endDate = getDateFromNumbers(endDateYear, endDateMonth, endDateDay)

    return { startDate, endDate }
  }
  if (startDateYear && startDateMonth && endDateYear && endDateMonth) {
    const startDate = getDateFromNumbers(startDateYear, startDateMonth)
    const endDate = getDateFromNumbers(endDateYear, endDateMonth)

    return { startDate, endDate }
  }

  if (startDateYear && endDateYear) {
    const startDate = getDateFromNumbers(startDateYear)
    const endDate = getDateFromNumbers(endDateYear)

    return { startDate, endDate }
  }
}
function getDateFromNumbers(year: number, month?: number, day?: number): Date {
  let date: Date

  if (year && month && day) {
    date = new Date(year, month ? month - 1 : undefined, day)
  } else if (year && month) {
    date = new Date(year + '-' + (month < 10 ? '0' + month : month))
  } else {
    date = new Date(year + '')
  }
  return date
}
