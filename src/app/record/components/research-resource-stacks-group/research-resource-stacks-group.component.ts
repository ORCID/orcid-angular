import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { isEmpty } from 'lodash'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { UserRecordOptions } from 'src/app/types/record.local'
import { SortData } from 'src/app/types/sort'

import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { OrganizationsService, UserService } from '../../../core'
import { RecordResearchResourceService } from '../../../core/record-research-resource/record-research-resource.service'
import { RecordService } from '../../../core/record/record.service'
import { OrgDisambiguated } from '../../../types'
import {
  ResearchResource,
  ResearchResourcesEndpoint,
  ResearchResourcesGroup,
} from '../../../types/record-research-resources.endpoint'
import { PageEvent } from '@angular/material/paginator'
import { DEFAULT_PAGE_SIZE } from 'src/app/constants'

@Component({
  selector: 'app-research-resources',
  templateUrl: './research-resource-stacks-group.component.html',
  styleUrls: ['./research-resource-stacks-group.component.scss'],
})
export class ResearchResourceStacksGroupComponent implements OnInit {
  defaultPageSize = DEFAULT_PAGE_SIZE
  labelSortButton = $localize`:@@shared.sortResearch:Sort Research Resources`
  @Input() isPublicRecord: string
  @Input() expandedContent: boolean
  @Output() total: EventEmitter<any> = new EventEmitter()
  @Output() expanded: EventEmitter<any> = new EventEmitter()
  userRecordContext: UserRecordOptions = {}
  displayTheStackClass = false

  $destroy: Subject<boolean> = new Subject<boolean>()

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

  paginationTotalAmountOfResearchResources: number
  paginationIndex: number
  paginationPageSize: number
  paginationLoading = true

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

  trackByResearchResourceGroup(index, item: ResearchResourcesGroup) {
    return item.activePutCode
  }

  private getRecord() {
    this._record
      .getRecord({
        publicRecordId: this.isPublicRecord || undefined,
      })
      .pipe(takeUntil(this.$destroy))
      .subscribe((userRecord) => {
        if (!isEmpty(userRecord?.researchResources)) {
          this.paginationLoading = false
          this.researchResources = userRecord.researchResources
          this.offset = userRecord.researchResources.offset
          this.total.emit(this.researchResources.groups.length)
          this.paginationTotalAmountOfResearchResources =
            userRecord.researchResources.totalGroups
          this.paginationIndex = userRecord.researchResources.pageIndex
          this.paginationPageSize = userRecord.researchResources.pageSize
          this.total.emit(userRecord.researchResources.groups.length)
        }
      })
  }

  pageEvent(event: PageEvent) {
    this.userRecordContext.offset = event.pageIndex * event.pageSize
    this.userRecordContext.pageSize = event.pageSize
    this.userRecordContext.publicRecordId = this.isPublicRecord
    this._recordResearchResourceService.changeUserRecordContext(
      this.userRecordContext
    )
    this.paginationLoading = true
  }

  sortEvent(event: SortData) {
    this.userRecordContext.publicRecordId = this.isPublicRecord
    this.userRecordContext.sort = event.type
    this.userRecordContext.sortAsc = event.direction === 'asc'
    this._recordResearchResourceService.changeUserRecordContext(
      this.userRecordContext
    )
    this.paginationLoading = true
  }

  expandedClicked(expanded: boolean) {
    this.expanded.emit({ type: 'research-resources', expanded })
  }
}
