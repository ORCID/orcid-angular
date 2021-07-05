import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { isEmpty } from 'lodash'
import { Subject } from 'rxjs'
import { ADD_EVENT_ACTION } from 'src/app/constants'
import { RecordWorksService } from 'src/app/core/record-works/record-works.service'
import { RecordService } from 'src/app/core/record/record.service'
import { WorkGroup, WorksEndpoint } from 'src/app/types/record-works.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { SortData } from 'src/app/types/sort'
import { WorkModalComponent } from '../work-modal/work-modal.component'

@Component({
  selector: 'app-work-stack-group',
  templateUrl: './work-stack-group.component.html',
  styleUrls: ['./work-stack-group.component.scss'],
})
export class WorkStackGroupComponent implements OnInit {
  labelAddButton = $localize`:@@shared.addWork:Add Work`
  labelSortButton = $localize`:@@shared.sortWorks:Sort Works`
  @Input() isPublicRecord: string
  @Input() expandedContent: boolean
  @Output() total: EventEmitter<any> = new EventEmitter()
  @Output() expanded: EventEmitter<any> = new EventEmitter()
  userRecordContext: UserRecordOptions = {}

  addMenuOptions = [
    { label: 'Add manually', action: ADD_EVENT_ACTION.addManually },
    { label: 'Search & Link', action: ADD_EVENT_ACTION.searchAndLink },
    { label: 'Add DOI', action: ADD_EVENT_ACTION.doi },
    { label: 'Add PubMed ID', action: ADD_EVENT_ACTION.pubMed },
    { label: 'Add BibTex', action: ADD_EVENT_ACTION.bibText },
  ]

  $destroy: Subject<boolean> = new Subject<boolean>()

  workGroup: WorksEndpoint

  works = $localize`:@@shared.works:Works`
  paginationTotalAmountOfWorks: number
  paginationIndex: number
  paginationPageSize: number

  constructor(
    private _record: RecordService,
    private _works: RecordWorksService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._record
      .getRecord({ publicRecordId: this.isPublicRecord })
      .subscribe((userRecord) => {
        if (!isEmpty(userRecord.works)) {
          this.workGroup = userRecord.works
          this.total.emit(userRecord.works?.groups?.length)
          this.paginationTotalAmountOfWorks = userRecord.works.totalGroups
          this.paginationIndex = userRecord.works.pageIndex
          this.paginationPageSize = userRecord.works.pageSize
          this.total.emit(userRecord.works.groups.length)
        }
      })

    this.add(ADD_EVENT_ACTION.addManually)
  }

  trackByWorkGroup(index, item: WorkGroup) {
    return item.defaultPutCode
  }

  expandedClicked(expanded: boolean) {
    this.expanded.emit({ type: 'works', expanded })
  }

  pageEvent(event: PageEvent) {
    this.userRecordContext.offset = event.pageIndex * event.pageSize
    this.userRecordContext.pageSize = event.pageSize
    this.userRecordContext.publicRecordId = this.isPublicRecord
    this._works.changeUserRecordContext(this.userRecordContext)
  }

  sortEvent(event: SortData) {
    this.userRecordContext.publicRecordId = this.isPublicRecord
    this.userRecordContext.sort = event.type
    this.userRecordContext.sortAsc = event.direction === 'asc'
    this._works.changeUserRecordContext(this.userRecordContext)
  }

  add(event: ADD_EVENT_ACTION) {
    if (event === ADD_EVENT_ACTION.addManually) {
      this._dialog.open(WorkModalComponent)
    }
  }
}
