import { ComponentType } from '@angular/cdk/portal'
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { isEmpty } from 'lodash'
import { Subject } from 'rxjs'
import { first } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import {
  ADD_EVENT_ACTION,
  DEFAULT_PAGE_SIZE,
  EXTERNAL_ID_TYPE_WORK,
} from 'src/app/constants'
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
import { SortData } from 'src/app/types/sort'

import { UserInfo } from '../../../types'
import { ModalDeleteItemsComponent } from '../modals/modal-delete-item/modal-delete-items.component'
import { WorkModalComponent } from '../work-modal/work-modal.component'
import { WorkStackComponent } from '../work-stack/work-stack.component'
import { ModalCombineWorksComponent } from '../work/modals/modal-combine-works/modal-combine-works.component'
import { ModalExportWorksComponent } from '../work/modals/modal-export-works/modal-export-works.component'
import { WorksVisibilityModalComponent } from '../work/modals/works-visibility-modal/works-visibility-modal.component'
import { ModalWorksSearchLinkComponent } from './modals/work-search-link-modal/modal-works-search-link.component'
import { WorkExternalIdModalComponent } from './modals/work-external-id-modal/work-external-id-modal.component'
import { WorkBibtexModalComponent } from './modals/work-bibtex-modal/work-bibtex-modal.component'
import { ModalCombineWorksWithSelectorComponent } from '../work/modals/modal-combine-works-with-selector/modal-combine-works-with-selector.component'
import { GroupingSuggestions } from 'src/app/types/works.endpoint'

@Component({
  selector: 'app-work-stack-group',
  templateUrl: './work-stack-group.component.html',
  styleUrls: [
    './work-stack-group.component.scss',
    './work-stack-group.component.scss-theme.scss',
  ],
})
export class WorkStackGroupComponent implements OnInit {
  showManageSimilarWorks = false
  defaultPageSize = DEFAULT_PAGE_SIZE
  labelAddButton = $localize`:@@shared.addWork:Add Work`
  labelSortButton = $localize`:@@shared.sortWorks:Sort Works`
  paginationLoading = true
  @Input() userInfo: UserInfo
  @Input() isPublicRecord: string
  @Input() expandedContent: MainPanelsState
  @Output() expandedContentChange = new EventEmitter<MainPanelsState>()
  @Output() total: EventEmitter<any> = new EventEmitter()

  userRecordContext: UserRecordOptions = {}

  addMenuOptions = [
    {
      label: $localize`:@@shared.searchLink:Search & Link`,
      action: ADD_EVENT_ACTION.searchAndLink,
      modal: ModalWorksSearchLinkComponent,
    },
    {
      label: $localize`:@@works.addDoi:Add DOI`,
      action: ADD_EVENT_ACTION.doi,
      modal: WorkExternalIdModalComponent,
      type: EXTERNAL_ID_TYPE_WORK.doi,
    },
    {
      label: $localize`:@@works.addPubmed:Add PubMed ID`,
      action: ADD_EVENT_ACTION.pubMed,
      modal: WorkExternalIdModalComponent,
      type: EXTERNAL_ID_TYPE_WORK.pubMed,
    },
    {
      label: $localize`:@@works.addBibtex:Add BibTeX`,
      action: ADD_EVENT_ACTION.bibText,
      modal: WorkBibtexModalComponent,
    },

    {
      label: $localize`:@@shared.addManually:Add manually`,
      action: ADD_EVENT_ACTION.addManually,
      modal: WorkModalComponent,
    },
  ]

  $destroy: Subject<boolean> = new Subject<boolean>()

  userRecord: UserRecord
  workGroup: WorksEndpoint
  workStackGroupForm: FormGroup = new FormGroup({})

  works = $localize`:@@shared.works:Works`
  labelActionsButton = $localize`:@@shared.actions:Actions`
  paginationTotalAmountOfWorks: number
  paginationIndex: number
  paginationPageSize: number
  platform: PlatformInfo
  selectedWorks: string[] = []
  selectAll: false

  @ViewChildren('selectAllCheckbox') selectAllCheckbox: MatCheckbox
  @ViewChildren('appWorkStacks') appWorkStacks: QueryList<WorkStackComponent>
  combineSuggestion: GroupingSuggestions

  constructor(
    private _dialog: MatDialog,
    private _platform: PlatformInfoService,
    private _record: RecordService,
    private _works: RecordWorksService
  ) {}

  ngOnInit(): void {
    this._record
      .getRecord({ publicRecordId: this.isPublicRecord })
      .subscribe((userRecord) => {
        this.userRecord = userRecord
        if (!isEmpty(userRecord.works)) {
          this.paginationLoading = false
          this.workGroup = userRecord.works
          this.total.emit(userRecord.works?.groups?.length)
          this.paginationTotalAmountOfWorks = userRecord.works.totalGroups
          this.paginationIndex = userRecord.works.pageIndex
          this.paginationPageSize = userRecord.works.pageSize
          this.total.emit(userRecord.works.groups?.length || 0)
        }
      })
    this.getGroupingSuggestions()

    this._platform.get().subscribe((platform) => {
      this.platform = platform
    })
  }

  private getGroupingSuggestions() {
    this._works.getWorksGroupingSuggestions().subscribe((value) => {
      this.combineSuggestion = value
    })
  }

  trackByWorkGroup(index, item: WorkGroup) {
    return item.defaultPutCode
  }

  pageEvent(event: PageEvent) {
    this.paginationLoading = true
    this.userRecordContext.offset = event.pageIndex * event.pageSize
    this.userRecordContext.pageSize = event.pageSize
    this.userRecordContext.publicRecordId = this.isPublicRecord
    this.loadWorks()
  }

  sortEvent(event: SortData) {
    this.paginationLoading = true
    this.userRecordContext.publicRecordId = this.isPublicRecord
    this.userRecordContext.sort = event.type
    this.userRecordContext.sortAsc = event.direction === 'asc'
    this.loadWorks()
  }

  loadWorks(): void {
    if (
      this.workGroup.totalGroups > this.workGroup.groups.length ||
      this.paginationPageSize !== this.defaultPageSize
    ) {
      this.userRecordContext.forceReload = true
    }
    this._works
      .changeUserRecordContext(this.userRecordContext)
      .subscribe(() => {
        this.paginationLoading = false
      })
  }

  combine() {
    this.openModal(ModalCombineWorksComponent, this.selectedWorks)
  }

  delete() {
    this.openModal(ModalDeleteItemsComponent, this.selectedWorks)
  }

  export() {
    this.openModal(ModalExportWorksComponent, this.selectedWorks)
  }

  exportAllWorks() {
    this.openModal(ModalExportWorksComponent, undefined, true)
  }

  visibility() {
    this.openModal(WorksVisibilityModalComponent, this.selectedWorks)
  }

  checked(event: MatCheckboxChange) {
    this.selectedWorks = []
    this.appWorkStacks.forEach((appWorkStack) => {
      appWorkStack.panelsComponent.forEach((panelComponent) => {
        panelComponent.selected = event.checked
        if (event.checked) {
          this.selectedWorks.push(panelComponent.putCode)
        }
      })
    })
  }

  openModal(modal: ComponentType<any>, putCodes, selectedAll?: boolean) {
    this.checked({ checked: false, source: undefined })
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
      })
  }

  checkboxChangeWorkStackGroup($event) {
    if (this.selectedWorks.includes($event.putCode)) {
      if ($event.checked === false) {
        this.selectedWorks = this.selectedWorks.filter(
          (putCode) => putCode !== $event.putCode
        )
      }
    } else {
      this.selectedWorks.push($event.putCode)
    }
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

  openManageSimilarWorksModal() {
    this._dialog
      .open(ModalCombineWorksWithSelectorComponent, {
        width: '850px',
        maxWidth: this.platform.tabletOrHandset ? '99%' : '80vw',
        data: this.combineSuggestion,
      })
      .afterClosed()
      .subscribe()
  }
}
