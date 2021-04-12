import { Injectable } from '@angular/core'
import { MonthDayYearDate } from 'src/app/types'
import {  
  FundingGroup,
} from 'src/app/types/record-funding.endpoint'

@Injectable({
  providedIn: 'root',
})
export class FundingsSortService {
  transform(
    value: FundingGroup[],
    ascending = true
  ): FundingGroup[] {
    return this.sort(value, ascending)
  }

  sort(
    fundingGroups: FundingGroup[],
    ascending = true
  ): FundingGroup[] {

    fundingGroups.sort((a, b) => {
      const dateA = this.yearMonthDaytoDate(a.defaultFunding.startDate)
      const dateB = this.yearMonthDaytoDate(b.defaultFunding.startDate)
      return (dateA.getTime() - dateB.getTime()) * (ascending ? -1 : 1)
    })
    return fundingGroups
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
