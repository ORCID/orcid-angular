import { AbstractControl } from '@angular/forms'

export function dateValidator(dateType: string) {
   return (c: AbstractControl): { [key: string]: any } | null => {
    const year = c.get(dateType + 'Year').value
    const month = c.get(dateType + 'Month').value
    const day = c.get(dateType + 'Day').value

    if (
      year === undefined ||
      (year === '' && month === undefined) ||
      (month === '' && day === undefined) ||
      day === ''
    ) {
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
      date = new Date(year + '/' + month + '/' + day)
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

    if (year === '' && month === '') 
     {
      return null
    }

    let date

    if (year && !month ) {
      date = new Date(year)
    }

    if (year && month) {
      date = new Date(year + '/' + month)
    }

    if (year && month) {
      date = new Date(year + '/' + month )
    }

    if (date && !isNaN(date.getTime())) {
      return null
    }

    return { date: true }
  }
}
