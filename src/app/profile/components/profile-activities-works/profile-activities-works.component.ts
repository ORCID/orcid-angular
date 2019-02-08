import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core'
import { Works } from 'src/app/types'
import { PageEvent } from '@angular/material'
import { Subscription, timer } from 'rxjs'
import { WorksService } from 'src/app/core/works/works.service'

@Component({
  selector: 'app-profile-activities-works',
  templateUrl: './profile-activities-works.component.html',
  styleUrls: ['./profile-activities-works.component.scss'],
})
export class ProfileActivitiesWorksComponent implements OnInit {
  panelState
  _profileWorks: Works
  profileWorksLoading = false
  worksPageIndex = 0
  workPageChangeTimer: Subscription
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

  @ViewChild('worksExpansionPanel') worksExpansionPanel: ElementRef
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
      this._worksService.get(this.id, event.pageIndex * 50)
      this.workPageChangeTimer.unsubscribe()
    })
  }
}
