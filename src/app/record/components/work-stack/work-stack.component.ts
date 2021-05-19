import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { first } from 'rxjs/operators'
import { RecordWorksService } from 'src/app/core/record-works/record-works.service'
import { VisibilityStrings } from 'src/app/types/common.endpoint'
import {
  Work,
  WorkGroup,
  WorksEndpoint,
} from 'src/app/types/record-works.endpoint'

@Component({
  selector: 'app-work-stack',
  templateUrl: './work-stack.component.html',
  styleUrls: [
    './work-stack.component.scss',
    './work-stack.component.scss-theme.scss',
  ],
})
export class WorkStackComponent implements OnInit {
  @HostBinding('class.display-the-stack') displayTheStackClass = false
  _workStack: WorkGroup
  visibility: VisibilityStrings
  @Input() isPublicRecord: string

  @Input()
  set workStack(value: WorkGroup) {
    this._workStack = value
    this.setInitialStates(value)
  }
  get workStack(): WorkGroup {
    return this._workStack
  }

  _displayTheStack = false
  set displayTheStack(mode: boolean) {
    this._displayTheStack = mode
    this.displayTheStackClass = this._displayTheStack
    this.setInitialStates(this.workStack, true)
  }
  get displayTheStack(): boolean {
    return this._displayTheStack
  }

  // orgDisambiguated: { [key: string]: OrgDisambiguated | null } = {}
  stackPanelsDisplay: { [key: string]: { topPanelOfTheStack: boolean } } = {}
  panelDetailsState: {
    [key: string]: {
      state: boolean
    }
  } = {}

  constructor(private _workService: RecordWorksService) {}

  /**
   * Set the panelDetails and top of the stack card to default mode
   */
  private setInitialStates(group: WorkGroup, force = false) {
    group.works.forEach((work) => {
      this.setDefaultPanelsDisplay(work, force)
      this.setDefaultPanelDetailsState(work, force)
    })
  }

  /**
   * On start, hide the details for all the panels
   */
  private setDefaultPanelDetailsState(work: Work, force = false) {
    if (this.panelDetailsState[work.putCode.value] === undefined || force) {
      this.panelDetailsState[work.putCode.value] = {
        state: false,
      }
    }
  }

  /**
   * On start, set the preferred source as the top panel of the stack
   */
  private setDefaultPanelsDisplay(work: Work, force = false) {
    if (this.stackPanelsDisplay[work.putCode.value] === undefined || force) {
      this.stackPanelsDisplay[work.putCode.value] = {
        topPanelOfTheStack: this.isPreferred(work) ? true : false,
      }
    }
  }

  isPreferred(work: Work) {
    const response =
      work && this.workStack
        ? this.workStack.defaultPutCode.toString() === work.putCode.value
        : false
    return response
  }

  /**
   * Show and hide details of the panel
   */
  toggleDetails(work: Work) {
    const putCode = work.putCode.value
    this.panelDetailsState[putCode].state = !this.panelDetailsState[putCode]
      .state

    if (this.panelDetailsState[putCode].state) {
      this.getDetails(work)
        .pipe(first())
        .subscribe(() => {})
    }
  }

  /**
   * Get require extra backend data to display on the panel details
   */
  private getDetails(work: Work): Observable<WorksEndpoint> {
    const putCode = work.putCode.value
    const $workDetails = this._workService.getDetails(
      putCode,
      this.isPublicRecord
    )
    return $workDetails
  }

  makePrimaryCard(work: Work) {
    // TODO
  }

  changeTopPanelOfTheStack(work: Work) {
    Object.keys(this.stackPanelsDisplay).forEach((key) => {
      this.stackPanelsDisplay[key].topPanelOfTheStack = false
    })
    this.stackPanelsDisplay[work.putCode.value].topPanelOfTheStack = true
  }

  trackByWorkStack(index, item: Work) {
    return item.putCode.value
  }

  ngOnInit(): void {}
}
