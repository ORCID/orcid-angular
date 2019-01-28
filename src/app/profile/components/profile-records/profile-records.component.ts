import { Component, Input, OnInit } from '@angular/core'
import { nestedListAnimation } from 'src/app/animations'
import { AffiliationUIGroup, AffiliationUIGroupsTypes } from 'src/app/types'

@Component({
  selector: 'app-profile-records',
  templateUrl: './profile-records.component.html',
  styleUrls: ['./profile-records.component.scss'],
  animations: [nestedListAnimation],
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

  ngOnInit() {}
}
