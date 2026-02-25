import { ComponentType } from '@angular/cdk/portal'
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { UntypedFormGroup } from '@angular/forms'
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator'
import { isEmpty } from 'lodash'
import { Observable, Subject } from 'rxjs'
import { first, take, takeUntil } from 'rxjs/operators'
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
import { SortData, SortOrderType } from 'src/app/types/sort'

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
import { AnnouncerService } from 'src/app/core/announcer/announcer.service'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { TogglzFlag } from '../../../types/config.endpoint'
import {
  ImportWorksDialogComponent,
  ORCID_MODAL_DIALOG_PANEL_CLASS,
} from '@orcid/registry-ui'

@Component({
  selector: 'app-work-stack-group',
  templateUrl: './work-stack-group.component.html',
  styleUrls: [
    './work-stack-group.component.scss',
    './work-stack-group.component.scss-theme.scss',
  ],
  standalone: false,
})
export class WorkStackGroupComponent implements OnInit, OnDestroy {
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

  private _baseAddMenuOptions = [
    {
      label: $localize`:@@shared.searchLink:Search & Link`,
      action: ADD_EVENT_ACTION.searchAndLink,
      id: 'cy-add-work-search-link',
    },
    {
      label: $localize`:@@works.addDoi:Add DOI`,
      action: ADD_EVENT_ACTION.doi,
      modal: WorkExternalIdModalComponent,
      type: EXTERNAL_ID_TYPE_WORK.doi,
      id: 'cy-add-work-doi',
    },
    {
      label: $localize`:@@works.addPubmed:Add PubMed ID`,
      action: ADD_EVENT_ACTION.pubMed,
      modal: WorkExternalIdModalComponent,
      type: EXTERNAL_ID_TYPE_WORK.pubMed,
      id: 'cy-add-work-pubmed',
    },
    {
      label: $localize`:@@works.addBibtex:Add BibTeX`,
      action: ADD_EVENT_ACTION.bibText,
      modal: WorkBibtexModalComponent,
      id: 'cy-add-work-bibtext',
    },
    {
      label: $localize`:@@shared.addManually:Add manually`,
      action: ADD_EVENT_ACTION.addManually,
      modal: WorkModalComponent,
      id: 'cy-add-work-manually',
    },
  ]

  addMenuOptions: {
    label: string
    action: ADD_EVENT_ACTION
    modal?: ComponentType<any>
    type?: EXTERNAL_ID_TYPE_WORK
    id?: string
  }[] = this._buildAddMenuOptions(false)

  $destroy: Subject<boolean> = new Subject<boolean>()
  $loading: Observable<boolean>

  userRecord: UserRecord
  workGroup: WorksEndpoint
  workStackGroupForm: UntypedFormGroup = new UntypedFormGroup({})

  works = $localize`:@@shared.works:Works`
  labelActionsButton = $localize`:@@shared.ariaLabelActions:Choose an action to apply to selected works`
  paginationTotalAmountOfWorks: number
  paginationIndex: number
  paginationPageSize: number
  platform: PlatformInfo
  selectedWorks: string[] = []
  selectedWorksFull: Work[] = []
  selectAll: false
  sortTypes: SortOrderType[] = ['title', 'date', 'type', 'source']

  @ViewChildren('selectAllCheckbox') selectAllCheckbox: MatCheckbox
  @ViewChildren('appWorkStacks') appWorkStacks: QueryList<WorkStackComponent>
  combineSuggestion: GroupingSuggestions

  constructor(
    private _dialog: MatDialog,
    private _platform: PlatformInfoService,
    private _record: RecordService,
    private _works: RecordWorksService,
    private _matPaginatorIntl: MatPaginatorIntl,
    private _announce: AnnouncerService,
    private _togglz: TogglzService,
    @Inject(LOCALE_ID) private _locale: string
  ) {}

  ngOnInit(): void {
    this.$loading = this._works.$loading
    this._record
      .getRecord({ publicRecordId: this.isPublicRecord })
      .subscribe((userRecord) => {
        this.userRecord = userRecord
        if (!isEmpty(userRecord?.works)) {
          this.paginationLoading = false
          this.workGroup = userRecord.works
          this.paginationTotalAmountOfWorks = userRecord.works.totalGroups
          this.paginationIndex = userRecord.works.pageIndex
          this.paginationPageSize = userRecord.works.pageSize
          this.total.emit(userRecord.works?.groups?.length || 0)
        }
      })
    if (!this.isPublicRecord) {
      this.getGroupingSuggestions()
    }

    this._platform.get().subscribe((platform) => {
      this.platform = platform
    })

    this._togglz
      .getStateOf(TogglzFlag.SEARCH_AND_LINK_WIZARD_WITH_CERTIFIED_AND_FEATURED_LINKS)
      .pipe(take(1), takeUntil(this.$destroy))
      .subscribe((useCertifiedAndFeatured) => {
        this.addMenuOptions = this._buildAddMenuOptions(useCertifiedAndFeatured)
      })
  }

  private _buildAddMenuOptions(useCertifiedAndFeatured: boolean) {
    return this._baseAddMenuOptions.map((opt) => {
      if (opt.action === ADD_EVENT_ACTION.searchAndLink) {
        return {
          ...opt,
          modal: useCertifiedAndFeatured
            ? undefined
            : ModalWorksSearchLinkComponent,
        }
      }
      return { ...opt }
    })
  }

  ngOnDestroy(): void {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }

  /** Called when user chooses Search & Link and the certified/featured dialog is used (no modal in addMenuOptions). */
  onAddEvent(action: ADD_EVENT_ACTION): void {
    if (action !== ADD_EVENT_ACTION.searchAndLink) {
      return
    }
    const dialogRef = this._dialog.open(ImportWorksDialogComponent, {
      panelClass: ORCID_MODAL_DIALOG_PANEL_CLASS,
      data: this._works.getImportWorksDialogDataSkeleton(),
      width: '850px',
      maxHeight: '90vh',
    })
    this._works
      .loadSearchAndLinkWizardDialogData(this._normalizeLocale())
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (data) => {
          dialogRef.componentInstance.data = { ...data, loading: false }
        },
      })
  }

  private _normalizeLocale(): string {
    return this._locale === 'en-US' ? 'en' : this._locale
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
    this.paginationLength = event.length
    this.paginationLoading = true
    this.userRecordContext.offset = event.pageIndex * event.pageSize
    this.userRecordContext.pageSize = event.pageSize
    this.userRecordContext.publicRecordId = this.isPublicRecord
    this._announce.liveAnnouncePagination(event, this.regionWorks)

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
    this.selectedWorksFull = this.filteredWorks()
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
        modalComponent.componentInstance.works = this.selectedWorksFull
        modalComponent.componentInstance.workGroups = this.workGroup.groups
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
