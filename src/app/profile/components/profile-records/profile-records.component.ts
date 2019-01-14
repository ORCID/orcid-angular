import { Component, OnInit, Input } from '@angular/core'
import {
  Affiliations,
  AffiliationUIGrouping,
  AffiliationGroup,
} from '../../../types'

@Component({
  selector: 'app-profile-records',
  templateUrl: './profile-records.component.html',
  styleUrls: ['./profile-records.component.scss'],
})
export class ProfileRecordsComponent implements OnInit {
  panelState = {
    employment: true,
  }
  affiliationUIGrouping = AffiliationUIGrouping

  _profileAffiliationsData: Affiliations
  @Input() id
  @Input('profileAffiliationsData')
  set profileAffiliationsData(value: Affiliations) {
    this._profileAffiliationsData = this.sort(value)
  }
  get profileAffiliationsData(): Affiliations {
    return this._profileAffiliationsData
  }

  constructor() {}

  ngOnInit() {}

  // MOVE SORTING TO A SERVICE
  sort(affiliationGroups: Affiliations) {
    Object.keys(affiliationGroups.affiliationGroups).forEach(x => {
      const affiliationGroup: AffiliationGroup[] =
        affiliationGroups.affiliationGroups[x]
      affiliationGroup.sort((a, b) => {
        const dateA = this.yearMonthDaytoDate(a)
        const dateB = this.yearMonthDaytoDate(b)
        return (dateA.getTime() - dateB.getTime()) * -1
      })
    })
    return affiliationGroups
  }

  yearMonthDaytoDate(x: AffiliationGroup): Date {
    const date = new Date()
    if (x.defaultAffiliation.startDate.year) {
      date.setFullYear(Number.parseInt(x.defaultAffiliation.startDate.year, 10))
    }
    if (x.defaultAffiliation.startDate.month) {
      date.setMonth(Number.parseInt(x.defaultAffiliation.startDate.month, 10))
    }
    if (x.defaultAffiliation.startDate.day) {
      date.setDate(Number.parseInt(x.defaultAffiliation.startDate.day, 10))
    }
    return date
  }
}
