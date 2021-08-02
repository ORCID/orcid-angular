import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core'
import { isEmpty } from 'lodash'
import { Subject } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'
import { UserRecordOptions } from 'src/app/types/record.local'
import { UserSession } from 'src/app/types/session.local'
import { SortData } from 'src/app/types/sort'

import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { URL_REGEXP } from '../../../constants'
import { OrganizationsService, UserService } from '../../../core'
import { RecordResearchResourceService } from '../../../core/record-research-resource/record-research-resource.service'
import { RecordService } from '../../../core/record/record.service'
import { OrgDisambiguated } from '../../../types'
import {
  Host,
  Item,
  ResearchResource,
  ResearchResourcesEndpoint,
  ResearchResourcesGroup,
} from '../../../types/record-research-resources.endpoint'
import { Work, WorkGroup } from '../../../types/record-works.endpoint'

@Component({
  selector: 'app-research-resources',
  templateUrl: './research-resources.component.html',
  styleUrls: [
    './research-resources.component.scss',
    './research-resources.component.scss-theme.scss',
  ],
})
export class ResearchResourcesComponent implements OnInit {
  labelSortButton = $localize`:@@shared.sortResearch:Sort Research Resources`
  @Input() isPublicRecord: string
  @Input() expandedContent: boolean
  @Output() total: EventEmitter<any> = new EventEmitter()
  @Output() expanded: EventEmitter<any> = new EventEmitter()
  userRecordContext: UserRecordOptions = {}
  displayTheStackClass = false

  $destroy: Subject<boolean> = new Subject<boolean>()

  userSession: UserSession
  researchResources: ResearchResourcesEndpoint
  platform: PlatformInfo
  detailsResearchResources: {
    putCode: string
    researchResource: ResearchResource
  }[] = []
  detailsOrgDisambiguated: {
    disambiguationSource: string
    orgDisambiguatedId: string
    orgDisambiguated: OrgDisambiguated
  }[] = []

  stackPanelsDisplay: { [key: string]: { topPanelOfTheStack: boolean } } = {}
  panelDetailsState: {
    [key: string]: {
      state: boolean
    }
  } = {}

  ngOrcidResearchResources = $localize`:@@researchResources.researchResources:Research resources`
  offset: number
  isMobile: boolean

  constructor(
    _platform: PlatformInfoService,
    private _organizationsService: OrganizationsService,
    private _record: RecordService,
    private _recordResearchResourceService: RecordResearchResourceService,
    private _user: UserService
  ) {
    _platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.platform = data
        this.isMobile = data.columns4 || data.columns8
      })
  }

  ngOnInit(): void {
    this.getRecord()
  }

  private getRecord() {
    this._user
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userSession) => {
        this.userSession = userSession
      })

    this._record
      .getRecord({
        publicRecordId: this.isPublicRecord || undefined,
      })
      .pipe(takeUntil(this.$destroy))
      .subscribe((userRecord) => {
        if (!isEmpty(userRecord?.researchResources)) {
          this.researchResources = userRecord.researchResources
          this.researchResources.groups.forEach((group) => {
            this.setInitialStates(group)
          })
          this.offset = userRecord.researchResources.offset
          this.total.emit(this.researchResources.groups.length)
        }
      })
  }

  getDetails(researchResource: ResearchResource, putCode: string): void {
    if (this.isPublicRecord) {
      this._recordResearchResourceService
        .getPublicResearchResourceById(this.isPublicRecord, putCode)
        .pipe(first())
        .subscribe(
          (data) => {
            this.detailsResearchResources.push({
              putCode: putCode,
              researchResource: data,
            })
            const research: ResearchResource = data
            research.hosts.forEach((host) => {
              this.getOrganizationDisambiguatedDetails(
                null,
                host.disambiguationSource,
                host.orgDisambiguatedId
              )
            })
            researchResource.showDetails = true
          },
          (error) => {
            console.error('getDetailsError', error)
          }
        )
    } else {
      this._recordResearchResourceService
        .getResearchResourceById(putCode)
        .pipe(first())
        .subscribe(
          (data) => {
            const research: ResearchResource = data
            this.detailsResearchResources.push({
              putCode: putCode,
              researchResource: research,
            })
            research.hosts.forEach((host) => {
              this.getOrganizationDisambiguatedDetails(
                null,
                host.disambiguationSource,
                host.orgDisambiguatedId
              )
            })
            researchResource.showDetails = true
          },
          (error) => {
            console.error('getDetailsError', error)
          }
        )
    }
  }

  getOrganizationDisambiguatedDetails(
    item: Item,
    disambiguationSource,
    orgDisambiguatedId
  ): void {
    this._organizationsService
      .getOrgDisambiguated(disambiguationSource, orgDisambiguatedId)
      .pipe(first())
      .subscribe((organizationDisambiguated) => {
        this.detailsOrgDisambiguated.push({
          disambiguationSource,
          orgDisambiguatedId,
          orgDisambiguated: organizationDisambiguated,
        })
        if (item) {
          item.showDetails = true
        }
      })
  }

  getResearchResource(putCode: string): ResearchResource {
    if (this.detailsResearchResources.length === 0) {
      return null
    }

    return this.detailsResearchResources
      .filter((value) => value.putCode === putCode)
      .map((value) => {
        return value.researchResource
      })[0]
  }

  sortEvent(event: SortData) {
    this.userRecordContext.publicRecordId = this.isPublicRecord
    this.userRecordContext.sort = event.type
    this.userRecordContext.sortAsc = event.direction === 'asc'
    this.userRecordContext.forceReload = true
    this.userRecordContext.offset = 0
    this._recordResearchResourceService.changeUserRecordContext(
      this.userRecordContext
    )
  }

  loadMore() {
    ;(this.userRecordContext.offset = this.offset + 50),
      (this.userRecordContext.publicRecordId = this.isPublicRecord)
    this.userRecordContext.forceReload = false
    this._recordResearchResourceService.changeUserRecordContext(
      this.userRecordContext
    )
  }

  getOrganizationDisambiguated(host: Host): OrgDisambiguated {
    const disambiguationSource = host.disambiguationSource
    const orgDisambiguatedId = host.orgDisambiguatedId

    return this.detailsOrgDisambiguated
      .filter(
        (value) =>
          value.disambiguationSource === disambiguationSource &&
          value.orgDisambiguatedId === orgDisambiguatedId
      )
      .map((value) => {
        return value.orgDisambiguated
      })[0]
  }

  isPreferred(
    researchResource: ResearchResource,
    group: ResearchResourcesGroup
  ) {
     return researchResource && group.defaultResearchResource.putCode
        ? group.defaultResearchResource.putCode ===
          researchResource.putCode
        : false
  }

  isUrl(value: string) {
    return RegExp(URL_REGEXP).test(value)
  }

  collapse(value: ResearchResource | Item) {
    value.showDetails = !value.showDetails
  }

  expandedClicked(expanded: boolean) {
    this.expanded.emit({ type: 'research-resources', expanded })
  }

  makePrimaryCard(researchResource: ResearchResource) {
    // TODO
    console.warn(this.stackPanelsDisplay)
  }

  changeTopPanelOfTheStack(researchResource: ResearchResource) {
    Object.keys(this.stackPanelsDisplay).forEach((key) => {
      this.stackPanelsDisplay[key].topPanelOfTheStack = false
    })
    this.stackPanelsDisplay[researchResource.putCode].topPanelOfTheStack = true
  }

  /**
   * Set the panelDetails and top of the stack card to default mode
   */
  private setInitialStates(
    group: ResearchResourcesGroup,
    force = false) {
    group.researchResources.forEach((researchResource) => {
      this.setDefaultPanelsDisplay(researchResource, group)
      this.setDefaultPanelDetailsState(researchResource, force)
    })
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

  /**
   * On start, set the preferred source as the top panel of the stack
   */
  private setDefaultPanelsDisplay(
    researchResource: ResearchResource,
    group: ResearchResourcesGroup,
    force = false) {
    if (this.stackPanelsDisplay[researchResource.putCode] === undefined || force) {
      this.stackPanelsDisplay[researchResource.putCode] = {
        topPanelOfTheStack: this.isPreferred(researchResource, group),
      }
    }
  }
}
