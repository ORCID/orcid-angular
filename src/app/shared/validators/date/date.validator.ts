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

export function dateMonthYearValidator(dateType: string) {
  return (c: AbstractControl): { [key: string]: any } | null => {
    const year = c.get(dateType + 'Year').value
    const month = c.get(dateType + 'Month').value

    if (!year && !month) {
      return null
    }

    let date

    if (year && !month) {
      date = new Date(year)
    }

    if (year && month) {
      date = new Date(year + '-' + month)
    }

    if (year && month) {
      date = new Date(year + '-' + month)
    }

    if (date && !isNaN(date.getTime())) {
      return null
    }

    return { date: true }
  }
}

export function endDateMonthYearValidator() {
  return (c: AbstractControl): { [key: string]: any } | null => {
    const endDateYear = c.get('endDateGroup.endDateYear').value
    const endDateMonth = c.get('endDateGroup.endDateMonth').value

    const startDateYear = c.get('startDateGroup.startDateYear').value
    const startDateMonth = c.get('startDateGroup.startDateMonth').value

    if (!endDateYear || !startDateYear) {
      return null
    }

    const dates = startAndEndDate(
      startDateYear,
      endDateYear,
      startDateMonth,
      endDateMonth
    )

    if (dates.endDate < dates.startDate) {
      return { invalidEndDate: true }
    }

    return null
  }
}

export function endDateValidator() {
  return (c: AbstractControl): { [key: string]: any } | null => {
    const endDateYear = c.get('endDateGroup.endDateYear').value
    const endDateMonth = c.get('endDateGroup.endDateMonth').value
    const endDateDay = c.get('endDateGroup.endDateDay').value

    const startDateYear = c.get('startDateGroup.startDateYear').value
    const startDateMonth = c.get('startDateGroup.startDateMonth').value
    const startDateDay = c.get('startDateGroup.startDateDay').value

    if (!endDateYear || !startDateYear) {
      return null
    }

    const dates = startAndEndDate(
      startDateYear,
      endDateYear,
      startDateMonth,
      endDateMonth,
      startDateDay,
      endDateDay
    )

    if (dates.endDate < dates.startDate) {
      return { invalidEndDate: true }
    }

    return null
  }
}

function startAndEndDate(
  startDateYear,
  endDateYear,
  startDateMonth,
  endDateMonth,
  startDateDay?,
  endDateDay?
) {
  let startDate
  let endDate

  if (startDateDay && endDateDay && startDateMonth && endDateMonth) {
    startDate = new Date(
      startDateYear,
      startDateMonth ? startDateMonth - 1 : undefined,
      startDateDay
    )
    endDate = new Date(
      endDateYear,
      endDateMonth ? endDateMonth - 1 : undefined,
      endDateDay
    )
  } else if (startDateMonth && endDateMonth) {
    startDate = new Date(startDateYear, startDateMonth - 1)
    endDate = new Date(endDateYear, endDateMonth - 1)
  } else if (startDateYear && endDateYear) {
    startDate = new Date(startDateYear)
    endDate = new Date(endDateYear)
  }
  return { startDate, endDate }
}
