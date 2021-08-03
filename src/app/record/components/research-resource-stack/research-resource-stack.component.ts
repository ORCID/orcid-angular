import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { VisibilityStrings } from '../../../types/common.endpoint'
import { ResearchResource, ResearchResourcesGroup } from '../../../types/record-research-resources.endpoint'
import { Work } from '../../../types/record-works.endpoint'

@Component({
  selector: 'app-research-resource-stack',
  templateUrl: './research-resource-stack.component.html',
  styleUrls: [
    './research-resource-stack.component.scss',
    './research-resource-stack.component.scss-theme.scss'
  ]
})
export class ResearchResourceStackComponent implements OnInit {
  @HostBinding('class.display-the-stack') displayTheStackClass = false
  _researchResourceStack: ResearchResourcesGroup
  visibility: VisibilityStrings
  @Input() isPublicRecord: string

  @Input()
  set researchResourceStack(value: ResearchResourcesGroup) {
    this._researchResourceStack = value
    this.setInitialStates(value)
  }
  get researchResourceStack(): ResearchResourcesGroup {
    return this._researchResourceStack
  }

  _displayTheStack = false
  set displayTheStack(mode: boolean) {
    this._displayTheStack = mode
    this.displayTheStackClass = this._displayTheStack
    this.setInitialStates(this._researchResourceStack, true)
  }
  get displayTheStack(): boolean {
    return this._displayTheStack
  }

  stackPanelsDisplay: { [key: string]: { topPanelOfTheStack: boolean } } = {}
  panelDetailsState: {
    [key: string]: {
      state: boolean
    }
  } = {}

  isMobile: boolean

  constructor() { }

  /**
   * Set the panelDetails and top of the stack card to default mode
   */
  private setInitialStates(group: ResearchResourcesGroup, force = false) {
    group.researchResources.forEach((researchResource) => {
      this.setDefaultPanelsDisplay(researchResource, force)
      this.setDefaultPanelDetailsState(researchResource, force)
    })
  }

  /**
   * On start, set the preferred source as the top panel of the stack
   */
  private setDefaultPanelsDisplay(researchResource: ResearchResource, force = false) {
    if (this.stackPanelsDisplay[researchResource.putCode] === undefined || force) {
      this.stackPanelsDisplay[researchResource.putCode] = {
        topPanelOfTheStack: this.isPreferred(researchResource),
      }
    }
  }

  /**
   * On start, hide the details for all the panels
   */
  private setDefaultPanelDetailsState(researchResource: ResearchResource, force = false) {
    if (this.panelDetailsState[researchResource.putCode] === undefined || force) {
      this.panelDetailsState[researchResource.putCode] = {
        state: false,
      }
    }
  }

  isPreferred(researchResource: ResearchResource) {
    const response =
      researchResource && this.researchResourceStack
        ? this.researchResourceStack.activePutCode.toString() === researchResource.putCode
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
      // this.getDetails(work)
      //   .pipe(first())
      //   .subscribe(() => {})
    }
  }

  makePrimaryCard(researchResource: ResearchResource) {
    // TODO
  }

  changeTopPanelOfTheStack(researchResource: ResearchResource) {
    Object.keys(this.stackPanelsDisplay).forEach((key) => {
      this.stackPanelsDisplay[key].topPanelOfTheStack = false
    })
    this.stackPanelsDisplay[researchResource.putCode].topPanelOfTheStack = true
  }

  trackByResearchResourceStack(index, item: ResearchResource) {
    return item.putCode
  }

  ngOnInit(): void {
  }

}
