import { Injectable } from '@angular/core'
import { MonthDayYearDate } from 'src/app/types'
import {
  AffiliationUIGroup,
  AffiliationGroup,
  AffiliationType,
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
      type,
      userRecordContext?.publicRecordId || userRecordContext?.privateRecordId
    )
  }

  sort(
    affiliationGroups: AffiliationUIGroup[],
    ascending = false,
    by = 'end',
    type = null,
    orcid: string
  ): AffiliationUIGroup[] {
    if (type === 'PROFESSIONAL_ACTIVITIES' && by === 'type') {
      const affiliations = affiliationGroups.filter(
        (affiliationGroup) =>
          affiliationGroup.type !== 'PROFESSIONAL_ACTIVITIES'
      )
      const professionalActivities = affiliationGroups.filter(
        (affiliationGroups) =>
          affiliationGroups.type === 'PROFESSIONAL_ACTIVITIES'
      )[0]

      const distinction = this.sortByEndDateAndType(
        professionalActivities.affiliationGroup,
        AffiliationType.distinction
      )
      const invitedPositions = this.sortByEndDateAndType(
        professionalActivities.affiliationGroup,
        AffiliationType['invited-position']
      )
      const membership = this.sortByEndDateAndType(
        professionalActivities.affiliationGroup,
        AffiliationType.membership
      )
      const service = this.sortByEndDateAndType(
        professionalActivities.affiliationGroup,
        AffiliationType.service
      )

      affiliations.push({
        type: 'PROFESSIONAL_ACTIVITIES',
        affiliationGroup: ascending
          ? [...distinction, ...invitedPositions, ...membership, ...service]
          : [...service, ...membership, ...invitedPositions, ...distinction],
      })
      return affiliations
    } else {
      affiliationGroups.forEach((x) => {
        let affiliationGroup: AffiliationGroup[] = x.affiliationGroup
        if (!type || type === x.type) {
          if (by === 'start' || by === 'end') {
            affiliationGroup = affiliationGroup.sort((a, b) => {
              return this.sortByDate(a, b, ascending, by)
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

          if (by === 'source') {
            affiliationGroup.sort((a, b) => {
              return (
                Number(AffiliationsSortService.isSelfAsserted(a, orcid)) -
                Number(AffiliationsSortService.isSelfAsserted(b, orcid))
              )
            })
            if (!ascending) {
              affiliationGroup.reverse()
            }
          }
        }
      })
      return affiliationGroups
    }
  }

  yearMonthDaytoDate(x: MonthDayYearDate): Date {
    // By default use the largest date possible
    const date = new Date(8640000000000000)
    if (x.year) {
      date.setFullYear(Number.parseInt(x.year, 10))
    }
    if (x.month) {
      date.setMonth(Number.parseInt(x.month, 10))
    } else {
      date.setMonth(1)
    }
    if (x.day) {
      date.setDate(Number.parseInt(x.day, 10))
    } else {
      date.setDate(1)
    }
    return date
  }

  private sortByDate(
    a: AffiliationGroup,
    b: AffiliationGroup,
    ascending: boolean,
    by: 'start' | 'end'
  ): number {
    let dateStartA = this.yearMonthDaytoDate(a.defaultAffiliation.startDate)
    let dateStartB = this.yearMonthDaytoDate(b.defaultAffiliation.startDate)
    let dateFinishA = this.yearMonthDaytoDate(a.defaultAffiliation.endDate)
    let dateFinishB = this.yearMonthDaytoDate(b.defaultAffiliation.endDate)

    if (
      a.defaultAffiliation.affiliationType.value ===
        AffiliationType.distinction &&
      by === 'end'
    ) {
      dateStartA = this.yearMonthDaytoDate(a.defaultAffiliation.endDate)
      dateFinishA = this.yearMonthDaytoDate(a.defaultAffiliation.startDate)
    }

    if (
      b.defaultAffiliation.affiliationType.value ===
        AffiliationType.distinction &&
      by === 'end'
    ) {
      dateStartB = this.yearMonthDaytoDate(b.defaultAffiliation.endDate)
      dateFinishB = this.yearMonthDaytoDate(b.defaultAffiliation.startDate)
    }

    if (by === 'end') {
      // If the end date is not the same use it to sort
      if (dateFinishA.getTime() !== dateFinishB.getTime()) {
        return (
          (dateFinishB.getTime() - dateFinishA.getTime()) * (ascending ? -1 : 1)
        )
      } else if (dateStartB.getTime() !== dateStartA.getTime()) {
        // If the end date is the same use the start date to sort
        return (
          (dateStartB.getTime() - dateStartA.getTime()) * (ascending ? -1 : 1)
        )
      } else {
        return (
          ('' + a.defaultAffiliation.affiliationName.value).localeCompare(
            '' + b.defaultAffiliation.affiliationName.value
          ) * (ascending ? 1 : -1)
        )
      }
    }
    if (by === 'start') {
      // If the start is not the same use it to sort
      if (dateStartB.getTime() !== dateStartA.getTime()) {
        return (
          (dateStartB.getTime() - dateStartA.getTime()) * (ascending ? -1 : 1)
        )
      } else if (dateFinishB.getTime() !== dateFinishA.getTime()) {
        // If the start date is the same use the end date to sort
        return (
          (dateFinishB.getTime() - dateFinishA.getTime()) * (ascending ? -1 : 1)
        )
      } else {
        return (
          ('' + a.defaultAffiliation.affiliationName.value).localeCompare(
            '' + b.defaultAffiliation.affiliationName.value
          ) * (ascending ? 1 : -1)
        )
      }
    }
  }

  private sortByEndDateAndType(
    affiliationGroup: AffiliationGroup[],
    type: AffiliationType
  ): AffiliationGroup[] {
    return affiliationGroup
      .filter(
        (affiliationGroup) =>
          affiliationGroup.defaultAffiliation.affiliationType.value === type
      )
      .sort((a, b) => {
        return this.sortByDate(a, b, false, 'end')
      })
  }

  private static isSelfAsserted(
    affiliationGroup: AffiliationGroup,
    orcid: string
  ): boolean {
    return affiliationGroup.defaultAffiliation.source === orcid
  }
}
