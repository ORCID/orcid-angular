import { Injectable } from '@angular/core'
import { MonthDayYearDate } from 'src/app/types'
import {
  AffiliationUIGroup,
  AffiliationGroup,
} from 'src/app/types/record-affiliation.endpoint'

@Injectable({
  providedIn: 'root',
})
export class AffiliationsSortService {
  transform(
    value: AffiliationUIGroup[],
    ascending = true
  ): AffiliationUIGroup[] {
    return this.sort(value, ascending)
  }

  sort(
    affiliationGroups: AffiliationUIGroup[],
    ascending = true
  ): AffiliationUIGroup[] {
    affiliationGroups.forEach((x) => {
      const affiliationGroup: AffiliationGroup[] = x.affiliationGroup
      affiliationGroup.sort((a, b) => {
        const dateA = this.yearMonthDaytoDate(a.defaultAffiliation.startDate)
        const dateB = this.yearMonthDaytoDate(b.defaultAffiliation.startDate)
        return (dateA.getTime() - dateB.getTime()) * (ascending ? -1 : 1)
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
