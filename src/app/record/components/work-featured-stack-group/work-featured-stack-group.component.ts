import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { UntypedFormGroup } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { isEmpty } from 'lodash'
import { Subject } from 'rxjs'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { DEFAULT_PAGE_SIZE } from 'src/app/constants'
import { RecordService } from 'src/app/core/record/record.service'
import { Work } from 'src/app/types/record-works.endpoint'
import {
  MainPanelsState,
  UserRecord,
  UserRecordOptions,
} from 'src/app/types/record.local'

import { UserInfo } from '../../../types'
import { GroupingSuggestions } from 'src/app/types/works.endpoint'

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
  featuredWorks: Work[]
  workStackGroupForm: UntypedFormGroup = new UntypedFormGroup({})

  featuredWorksLabel = $localize`:@@shared.featuredWorks:Featured works`
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
    private _record: RecordService
  ) {}

  ngOnInit(): void {
    this._record
      .getRecord({ publicRecordId: this.isPublicRecord })
      .subscribe((userRecord) => {
        this.userRecord = userRecord
        if (!isEmpty(userRecord?.featuredWorks)) {
          this.loading = false
          this.featuredWorks = userRecord.featuredWorks
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
}
