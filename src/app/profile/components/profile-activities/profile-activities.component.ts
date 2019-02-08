import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core'
import { nestedListAnimation } from 'src/app/animations'
import {
  AffiliationUIGroup,
  AffiliationUIGroupsTypes,
  Works,
  AffiliationGroup,
} from 'src/app/types'
import { AffiliationsSortService } from 'src/app/core'
import { ChangeDetectorRef } from '@angular/core'
import { PageEvent } from '@angular/material'
import { WorksService } from '../../../core/works/works.service'
import { Subscription, timer } from 'rxjs'

@Component({
  selector: 'app-profile-activities',
  templateUrl: './profile-activities.component.html',
  styleUrls: ['./profile-activities.component.scss'],
  animations: [nestedListAnimation],
})
export class ProfileRecordsComponent implements OnInit {
  panelState = {}
  _profileAffiliationUiGroups: AffiliationUIGroup[]
  affiliationUIGroupsTypes = AffiliationUIGroupsTypes
  toggle = true

  @Input() id
  @Input() profileWorks

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

  constructor(private _affiliationsSortService: AffiliationsSortService) {}

  trackByAffiliationGroup(index, item: AffiliationGroup) {
    return item.activePutCode
  }
  trackByProfileAffiliationUiGroups(index, item: AffiliationUIGroup) {
    return item.type
  }

  /**
   * The following function is a call to a temporall sorting method.
   * With the only purpose to have a quick sorting function to test the correct
   * funtionin of the components on data updates.
   *
   * This should be rewritten/removed when the funtionallity of sorting is implemented
   */
  testSorting() {
    this.toggle = !this.toggle
    this._profileAffiliationUiGroups = this._affiliationsSortService.transform(
      this._profileAffiliationUiGroups,
      this.toggle
    )
  }

  ngOnInit() {}
}
