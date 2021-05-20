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
      let affiliationGroup: AffiliationGroup[] = x.affiliationGroup
      affiliationGroup = affiliationGroup.sort((a, b) => {
        const dateStartA = this.yearMonthDaytoDate(
          a.defaultAffiliation.startDate
        )
        const dateStartB = this.yearMonthDaytoDate(
          b.defaultAffiliation.startDate
        )
        const dateFinishA = this.yearMonthDaytoDate(
          a.defaultAffiliation.endDate
        )
        const dateFinishB = this.yearMonthDaytoDate(
          b.defaultAffiliation.endDate
        )

        // If the end date is not the same use it to sort
        if (dateFinishA.getTime() !== dateFinishB.getTime()) {
          return (
            (dateFinishA.getTime() - dateFinishB.getTime()) *
            (ascending ? -1 : 1)
          )
        } else {
          // If the end date is the same use the start date to sort
          return (
            (dateStartA.getTime() - dateStartB.getTime()) * (ascending ? -1 : 1)
          )
        }
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
