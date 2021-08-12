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
                  (dateFinishB.getTime() - dateFinishA.getTime()) *
                  (ascending ? -1 : 1)
                )
              } else if (dateStartB.getTime() !== dateStartA.getTime()) {
                // If the end date is the same use the start date to sort
                return (
                  (dateStartB.getTime() - dateStartA.getTime()) *
                  (ascending ? -1 : 1)
                )
              } else {
                return (
                  (
                    '' + a.defaultAffiliation.affiliationName.value
                  ).localeCompare(
                    '' + b.defaultAffiliation.affiliationName.value
                  ) * (ascending ? 1 : -1)
                )
              }
            }
            if (by === 'start') {
              // If the start is not the same use it to sort
              if (dateStartB.getTime() !== dateStartA.getTime()) {
                return (
                  (dateStartB.getTime() - dateStartA.getTime()) *
                  (ascending ? -1 : 1)
                )
              } else if (dateFinishB.getTime() !== dateFinishA.getTime()) {
                // If the start date is the same use the end date to sort
                return (
                  (dateFinishB.getTime() - dateFinishA.getTime()) *
                  (ascending ? -1 : 1)
                )
              } else {
                return (
                  (
                    '' + a.defaultAffiliation.affiliationName.value
                  ).localeCompare(
                    '' + b.defaultAffiliation.affiliationName.value
                  ) * (ascending ? 1 : -1)
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
    // By default use the largest date possible
    const date = new Date(8640000000000000)
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
