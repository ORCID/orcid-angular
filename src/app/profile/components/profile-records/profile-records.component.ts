import { Component, Input, OnInit } from '@angular/core'
import { nestedListAnimation } from 'src/app/animations'
import {
  AffiliationUIGroup,
  AffiliationUIGroupsTypes,
  Works,
  AffiliationGroup,
} from 'src/app/types'
import { AffiliationsSortService } from 'src/app/core'
import { ChangeDetectorRef } from '@angular/core'

@Component({
  selector: 'app-profile-records',
  templateUrl: './profile-records.component.html',
  styleUrls: ['./profile-records.component.scss'],
  animations: [nestedListAnimation],
})
export class ProfileRecordsComponent implements OnInit {
  panelState = {}
  _progileWorks: Works
  _profileAffiliationUiGroups: AffiliationUIGroup[]
  affiliationUIGroupsTypes = AffiliationUIGroupsTypes
  toggle = true
  @Input() id
  @Input()
  set profileAffiliationUiGroups(value: AffiliationUIGroup[]) {
    this._profileAffiliationUiGroups = value
    value.forEach(item => (this.panelState[item.type] = true))
    this._profileAffiliationUiGroups = this._affiliationsSortService.transform(
      this._profileAffiliationUiGroups,
      this.toggle
    )
  }
  get profileAffiliationUiGroups(): AffiliationUIGroup[] {
    return this._profileAffiliationUiGroups
  }
  @Input()
  set profileWorks(value: Works) {
    this._progileWorks = value
    // value.groups.forEach(item => (this.panelState[item.activePutCode] = true))
  }
  get profileWorks(): Works {
    return this._progileWorks
  }

  constructor(private _affiliationsSortService: AffiliationsSortService) {}

  trackByAffiliationGroup(index, item: AffiliationGroup) {
    return item.activePutCode
  }
  trackByProfileAffiliationUiGroups(index, item: AffiliationUIGroup) {
    return item.type
  }

  testSorting() {
    this.toggle = !this.toggle
    this._profileAffiliationUiGroups = this._affiliationsSortService.transform(
      this._profileAffiliationUiGroups,
      this.toggle
    )
  }

  ngOnInit() {}
}
