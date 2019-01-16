import { Component, OnInit, Input } from '@angular/core'
import {
  Affiliations,
  AffiliationUIGroup,
  AffiliationGroup,
  AffiliationUIGroupsTypes,
} from '../../../types'

@Component({
  selector: 'app-profile-records',
  templateUrl: './profile-records.component.html',
  styleUrls: ['./profile-records.component.scss'],
})
export class ProfileRecordsComponent implements OnInit {
  panelState = {}
  _profileAffiliationUiGroups: AffiliationUIGroup[]
  affiliationUIGroupsTypes = AffiliationUIGroupsTypes

  @Input() id
  @Input()
  set profileAffiliationUiGroups(value: AffiliationUIGroup[]) {
    this._profileAffiliationUiGroups = value
    value.forEach(item => (this.panelState[item.type] = true))
  }
  get profileAffiliationUiGroups(): AffiliationUIGroup[] {
    return this._profileAffiliationUiGroups
  }

  constructor() {}

  ngOnInit() {
    console.log('records init!', this.profileAffiliationUiGroups)
  }
}
