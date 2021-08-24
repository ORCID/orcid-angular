import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { isEmpty } from 'lodash'
import { Subject } from 'rxjs'
import { DEFAULT_PAGE_SIZE } from 'src/app/constants'
import { RecordWorksService } from 'src/app/core/record-works/record-works.service'
import { RecordService } from 'src/app/core/record/record.service'
import {
  Work,
  WorkGroup,
  WorksEndpoint,
} from 'src/app/types/record-works.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { SortData } from 'src/app/types/sort'
import { ModalExportWorksComponent } from '../work/modals/modal-export-works/modal-export-works.component'
import { ComponentType } from '@angular/cdk/portal'
import { first } from 'rxjs/operators'
import { MatDialog } from '@angular/material/dialog'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { FormGroup } from '@angular/forms'
import { ModalCombineWorksComponent } from '../work/modals/modal-combine-works/modal-combine-works.component'
import { WorkStackComponent } from '../work-stack/work-stack.component'
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox'
import { UserInfo } from '../../../types'
import { ModalDeleteItemsComponent } from '../modals/modal-delete-item/modal-delete-items.component'

@Component({
  selector: 'app-work-stack-group',
  templateUrl: './work-stack-group.component.html',
  styleUrls: [
    './work-stack-group.component.scss',
    './work-stack-group.component.scss-theme.scss',
  ],
})
export class WorkStackGroupComponent implements OnInit {
  defaultPageSize = DEFAULT_PAGE_SIZE
  labelAddButton = $localize`:@@shared.addWork:Add Work`
  labelSortButton = $localize`:@@shared.sortWorks:Sort Works`
  paginationLoading = true
  @Input() userInfo: UserInfo
  @Input() isPublicRecord: string
  @Input() expandedContent: boolean
  @Output() total: EventEmitter<any> = new EventEmitter()
  @Output() expanded: EventEmitter<any> = new EventEmitter()

  userRecordContext: UserRecordOptions = {}

  modalExportWorksComponent = ModalExportWorksComponent
  modalCombineWorksComponent = ModalCombineWorksComponent
  modalDeleteWorksComponent = ModalDeleteItemsComponent

  $destroy: Subject<boolean> = new Subject<boolean>()

  workGroup: WorksEndpoint
  workStackGroupForm: FormGroup = new FormGroup({})

  works = $localize`:@@shared.works:Works`
  labelActionsButton = $localize`:@@shared.actions:Actions`
  paginationTotalAmountOfWorks: number
  paginationIndex: number
  paginationPageSize: number
  selectedWorks: string[] = []
  selectAll: false

  @ViewChildren('selectAllCheckbox') selectAllCheckbox: MatCheckbox
  @ViewChildren('appWorkStacks') appWorkStacks: QueryList<WorkStackComponent>

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
        if (!isEmpty(userRecord.works)) {
          this.paginationLoading = false
          this.workGroup = userRecord.works
          this.total.emit(userRecord.works?.groups?.length)
          this.paginationTotalAmountOfWorks = userRecord.works.totalGroups
          this.paginationIndex = userRecord.works.pageIndex
          this.paginationPageSize = userRecord.works.pageSize
          this.total.emit(userRecord.works.groups.length)
        }
      })
  }

  trackByWorkGroup(index, item: WorkGroup) {
    return item.defaultPutCode
  }

  expandedClicked(expanded: boolean) {
    this.expanded.emit({ type: 'works', expanded })
  }

  pageEvent(event: PageEvent) {
    this.paginationLoading = true
    this.userRecordContext.offset = event.pageIndex * event.pageSize
    this.userRecordContext.pageSize = event.pageSize
    this.userRecordContext.publicRecordId = this.isPublicRecord
    this._works.changeUserRecordContext(this.userRecordContext)
  }

  sortEvent(event: SortData) {
    this.paginationLoading = true
    this.userRecordContext.publicRecordId = this.isPublicRecord
    this.userRecordContext.sort = event.type
    this.userRecordContext.sortAsc = event.direction === 'asc'
    this._works.changeUserRecordContext(this.userRecordContext)
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

  openModal(modal: ComponentType<any>, putCodes) {
    this._platform
      .get()
      .pipe(first())
      .subscribe((platform) => {
        const modalComponent = this._dialog.open(modal, {
          width: '850px',
          maxWidth: platform.tabletOrHandset ? '95vw' : '80vw',
        })
        modalComponent.componentInstance.putCodes = putCodes
        modalComponent.componentInstance.type = 'works'
      })
    this.selectedWorks = []
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
}
