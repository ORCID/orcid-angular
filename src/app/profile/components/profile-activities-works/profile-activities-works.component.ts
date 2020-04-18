import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { Subscription, timer } from 'rxjs'
import { nestedListAnimation } from 'src/app/animations'
import { WorksService } from 'src/app/core/works/works.service'
import { WorkGroup, Works } from 'src/app/types'

@Component({
  selector: 'app-profile-activities-works',
  templateUrl: './profile-activities-works.component.html',
  styleUrls: ['./profile-activities-works.component.scss'],
  animations: [nestedListAnimation],
})
export class ProfileActivitiesWorksComponent implements OnInit {
  @Input() id
  @Input()
  set profileWorks(value: Works) {
    this._profileWorks = value
    if (this.worksExpansionPanel) {
      this.worksExpansionPanel.nativeElement.scrollIntoView()
      this.profileWorksLoading = false
    }
    this.panelState = true
  }

  get profileWorks(): Works {
    return this._profileWorks
  }
  panelState
  profileWorksLoading = false
  worksPageIndex = 0
  workPageChangeTimer: Subscription
  _profileWorks: Works

  @ViewChild('worksExpansionPanel')
  worksExpansionPanel: ElementRef
  @ViewChild('worksExpansionPanel') paginatoOf: ElementRef

  constructor(private _worksService: WorksService) {}

  ngOnInit() {}

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
      this._worksService.sort(this.id, event.pageIndex * 50)
      this.workPageChangeTimer.unsubscribe()
    })
  }

  trackByProfileworksStack(item, value: WorkGroup) {
    return value.defaultPutCode
  }
}
