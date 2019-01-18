import { Injectable } from '@angular/core'
import {
  AffiliationGroup,
  AffiliationUIGroup,
  MonthDayYearDate,
} from 'src/app/types'

@Injectable({
  providedIn: 'root',
})
export class AffiliationsSortService {
  transform(value: AffiliationUIGroup[]): AffiliationUIGroup[] {
    return this.sort(value)
  }

  sort(affiliationGroups: AffiliationUIGroup[]): AffiliationUIGroup[] {
    affiliationGroups.forEach(x => {
      const affiliationGroup: AffiliationGroup[] = x.affiliationGroup
      affiliationGroup.sort((a, b) => {
        const dateA = this.yearMonthDaytoDate(a.defaultAffiliation.startDate)
        const dateB = this.yearMonthDaytoDate(b.defaultAffiliation.startDate)
        return (dateA.getTime() - dateB.getTime()) * -1
      })
    })
    return affiliationGroups
  }

  yearMonthDaytoDate(x: MonthDayYearDate): Date {
    const date = new Date()
    if (x.year) {
      date.setFullYear(Number.parseInt(x.year, 10))
    }
    if (x.month) {
      date.setMonth(Number.parseInt(x.month, 10))
    }
    if (x.day) {
      date.setDate(Number.parseInt(x.day, 10))
    }
    return date
  }
}
