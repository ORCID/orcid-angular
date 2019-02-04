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
  profileWorksLoading = false
  worksPageIndex = 0
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
    if (this.profileAffiliationUiGroups && this.worksExpansionPanel) {
      this.worksExpansionPanel.nativeElement.scrollIntoView()
      this.profileWorksLoading = false
    }
    // value.groups.forEach(item => (this.panelState[item.activePutCode] = true))
  }

  @ViewChild('worksExpansionPanel') worksExpansionPanel: ElementRef
  get profileWorks(): Works {
    return this._progileWorks
  }

  workPageChangeTimer: Subscription

  constructor(
    private _affiliationsSortService: AffiliationsSortService,
    private _worksService: WorksService
  ) {}

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
  /**
   * Receives events for Works paginator to call the works endpoint with a new offset
   * The workPageChangeTimer is used to wait 400ms before calling the endpoint
   * to allow users to quickly navigate pages indexes without loading all pages
   *
   * This function also updated worksPageIndex this is used as the pageIndex by mat-paginator
   */
  worksPagesChange(event: PageEvent) {
    this.worksPageIndex = event.pageIndex
    if (this.workPageChangeTimer) {
      this.workPageChangeTimer.unsubscribe()
    }
    this.workPageChangeTimer = timer(400).subscribe(t => {
      this.worksExpansionPanel.nativeElement.scrollIntoView()
      this.profileWorksLoading = true
      this._worksService.get(this.id, event.pageIndex * 50)
      this.workPageChangeTimer.unsubscribe()
    })
  }

  ngOnInit() {}
}
