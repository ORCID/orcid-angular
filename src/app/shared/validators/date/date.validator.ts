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
      date = new Date(year + '/' + month)
    }

    if (year && month && day) {
      date = new Date(year, month - 1, day)

      if (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      ) {
        return null;
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
      date = new Date(year + '/' + month)
    }

    if (year && month) {
      date = new Date(year + '/' + month)
    }

    if (date && !isNaN(date.getTime())) {
      return null
    }

    return { date: true }
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

    if (!endDateYear && !startDateYear) {
      return null
    }

    const startDate = new Date(startDateYear, startDateMonth - 1, startDateDay)
    const endDate = new Date(endDateYear, endDateMonth - 1, endDateDay)

    if (endDate < startDate) {
      return { invalidEndDate: true }
    }

    return null
  }
}
