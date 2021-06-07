import { Injectable } from '@angular/core'
import { MonthDayYearDate } from 'src/app/types'
import {
  AffiliationUIGroup,
  AffiliationGroup,
} from 'src/app/types/record-affiliation.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'

@Injectable({
  providedIn: 'root',
})
export class AffiliationsSortService {
  transform(
    value: AffiliationUIGroup[],
    userRecordContext?: UserRecordOptions,
    type: string = null
  ): AffiliationUIGroup[] {
    return this.sort(
      value,
      userRecordContext?.sortAsc,
      userRecordContext?.sort,
      type
    )
  }

  sort(
    affiliationGroups: AffiliationUIGroup[],
    ascending = false,
    by = 'end',
    type = null
  ): AffiliationUIGroup[] {
    affiliationGroups.forEach((x) => {
      let affiliationGroup: AffiliationGroup[] = x.affiliationGroup
      if (!type || type === x.type) {
        if (by === 'start' || by === 'end') {
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

            if (by === 'end') {
              // If the end date is not the same use it to sort
              if (dateFinishA.getTime() !== dateFinishB.getTime()) {
                return (
                  (dateFinishA.getTime() - dateFinishB.getTime()) *
                  (ascending ? 1 : -1)
                )
              } else {
                // If the end date is the same use the start date to sort
                return (
                  (dateStartA.getTime() - dateStartB.getTime()) *
                  (ascending ? 1 : -1)
                )
              }
            }
            if (by === 'start') {
              // If the start is not the same use it to sort
              if (dateStartA.getTime() !== dateStartB.getTime()) {
                return (
                  (dateStartA.getTime() - dateStartB.getTime()) *
                  (ascending ? 1 : -1)
                )
              } else {
                // If the start date is the same use the end date to sort
                return (
                  (dateFinishA.getTime() - dateFinishB.getTime()) *
                  (ascending ? 1 : -1)
                )
              }
            }
          })
        }

        if (by === 'title') {
          affiliationGroup.sort((a, b) => {
            return (
              '' + a.defaultAffiliation.affiliationName.value
            ).localeCompare('' + b.defaultAffiliation.affiliationName.value)
          })
          if (!ascending) {
            affiliationGroup.reverse()
          }
        }
      }
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
