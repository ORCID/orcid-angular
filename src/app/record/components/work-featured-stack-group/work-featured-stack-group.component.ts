import { ComponentType } from '@angular/cdk/portal'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { UntypedFormGroup } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { isEmpty } from 'lodash'
import { Subject } from 'rxjs'
import { first } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { DEFAULT_PAGE_SIZE } from 'src/app/constants'
import { RecordWorksService } from 'src/app/core/record-works/record-works.service'
import { RecordService } from 'src/app/core/record/record.service'
import {
  Work,
  WorkGroup,
  WorksEndpoint,
} from 'src/app/types/record-works.endpoint'
import {
  MainPanelsState,
  UserRecord,
  UserRecordOptions,
} from 'src/app/types/record.local'

import { UserInfo } from '../../../types'
import { GroupingSuggestions } from 'src/app/types/works.endpoint'
import { AnnouncerService } from 'src/app/core/announcer/announcer.service'
import { TogglzService } from '../../../core/togglz/togglz.service'

@Component({
  selector: 'app-work-featured-stack-group',
  templateUrl: './work-featured-stack-group.component.html',
  styleUrls: [
    './work-featured-stack-group.component.scss',
    './work-featured-stack-group.component.scss-theme.scss',
  ],
})
export class WorkFeaturedStackGroupComponent implements OnInit {
  paginatorLabel
  showManageSimilarWorks = false
  defaultPageSize = DEFAULT_PAGE_SIZE
  regionWorks = $localize`:@@shared.works:Works`
  labelAddButton = $localize`:@@shared.addWork:Add Work`
  labelSortButton = $localize`:@@shared.sortWorks:Sort Works`
  labelSelectAll = $localize`:@@share.selectAllWorks:Select all Works on this page`
  paginationLength = 0
  paginationLoading = true
  @Input() userInfo: UserInfo
  @Input() isPublicRecord: string
  @Input() expandedContent: MainPanelsState
  @Output() expandedContentChange = new EventEmitter<MainPanelsState>()
  @Output() total: EventEmitter<any> = new EventEmitter()

  userRecordContext: UserRecordOptions = {}

  addMenuOptions = [
    // Manage featured works button to be implemented later
    /* {
      label: $localize`:@@shared.`,
      action: ADD_EVENT_ACTION.,
      modal: ,
      id: 'cy-manage-featured-manually',
    }, */
  ]

  $destroy: Subject<boolean> = new Subject<boolean>()
  loading = true

  userRecord: UserRecord
  workGroup: WorksEndpoint
  workStackGroupForm: UntypedFormGroup = new UntypedFormGroup({})

  featuredWorks = $localize`:@@shared.featuredWorks:Featured works`
  noWorksAdded: boolean = false
  labelActionsButton = $localize`:@@shared.ariaLabelActions:Choose an action to apply to selected works`
  paginationTotalAmountOfWorks: number
  paginationIndex: number
  paginationPageSize: number
  platform: PlatformInfo
  selectedWorks: string[] = []
  selectAll: false

  combineSuggestion: GroupingSuggestions

  constructor(
    private _dialog: MatDialog,
    private _platform: PlatformInfoService,
    private _record: RecordService,
    private _works: RecordWorksService,
    private _announce: AnnouncerService,
    private _togglz: TogglzService
  ) {}

  ngOnInit(): void {
    this._record
      .getRecord({ publicRecordId: this.isPublicRecord })
      .subscribe((userRecord) => {
        this.userRecord = userRecord
        if (!isEmpty(userRecord?.featuredWorks)) {
          this.loading = false
          this.workGroup = userRecord.featuredWorks
        }

        if (!isEmpty(userRecord?.works)) {
          if (userRecord?.works.totalGroups === 0) {
            this.noWorksAdded = true
          } else {
            this.noWorksAdded = false
          }
        }
      })

    this._platform.get().subscribe((platform) => {
      this.platform = platform
    })
  }

  trackByWorkGroup(index, item: WorkGroup) {
    return item.defaultPutCode
  }

  openModal(modal: ComponentType<any>, putCodes, selectedAll?: boolean) {
    this.selectedWorks = []
    this.selectAll = false
    this._platform
      .get()
      .pipe(first())
      .subscribe((platform) => {
        const modalComponent = this._dialog.open(modal, {
          width: '850px',
          maxWidth: platform.tabletOrHandset ? '99%' : '80vw',
        })
        modalComponent.componentInstance.putCodes = putCodes
        modalComponent.componentInstance.type = 'works'
        modalComponent.componentInstance.selectedAll = selectedAll
        modalComponent.componentInstance.totalWorks = this.workGroup.totalGroups
        modalComponent.componentInstance.workGroups = this.workGroup.groups
      })
  }

  filteredWorks(): Work[] {
    const works: Work[] = []
    this.selectedWorks.forEach((putCode) => {
      this.workGroup.groups.forEach((workGroup) => {
        workGroup.works.forEach((work) => {
          if (work.putCode.value === putCode) {
            works.push(work)
          }
        })
      })
    })
    return works
  }
}
