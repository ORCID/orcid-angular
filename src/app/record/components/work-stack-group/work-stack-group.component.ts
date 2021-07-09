import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { isEmpty } from 'lodash'
import { Subject } from 'rxjs'
import { DEFAULT_PAGE_SIZE } from 'src/app/constants'
import { RecordWorksService } from 'src/app/core/record-works/record-works.service'
import { RecordService } from 'src/app/core/record/record.service'
import { WorkGroup, WorksEndpoint } from 'src/app/types/record-works.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { SortData } from 'src/app/types/sort'
import { ModalExportWorksComponent } from '../work/modals/modal-export-works/modal-export-works.component'
import { ComponentType } from '@angular/cdk/portal'
import { first } from 'rxjs/operators'
import { MatDialog } from '@angular/material/dialog'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { UserInfo } from '../../../types'

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

  $destroy: Subject<boolean> = new Subject<boolean>()

  workGroup: WorksEndpoint

  works = $localize`:@@shared.works:Works`
  labelActionsButton = $localize`:@@shared.actions:Actions`
  paginationTotalAmountOfWorks: number
  paginationIndex: number
  paginationPageSize: number
  selectedWorks: any[]
  selectAll: false

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

  export() {
    this.openModal(ModalExportWorksComponent)
  }

  updateCheck() {
    if (this.selectAll) {
      this.workGroup.groups.map((workGroup) => {
        workGroup.works[0].checked = true
      })
    } else {
      this.workGroup.groups.map((workGroup) => {
        workGroup.works[0].checked = false
      })
    }
  }

  openModal(modal: ComponentType<any>) {
    this._platform
      .get()
      .pipe(first())
      .subscribe((platform) => {
        this._dialog.open(modal, {
          width: '850px',
          maxWidth: platform.tabletOrHandset ? '95vw' : '80vw',
        })
      })
  }

}
