import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { isEmpty } from 'lodash'
import { Subject } from 'rxjs'
import { RecordWorksService } from 'src/app/core/record-works/record-works.service'
import { RecordService } from 'src/app/core/record/record.service'
import { WorkGroup, WorksEndpoint } from 'src/app/types/record-works.endpoint'

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

  $destroy: Subject<boolean> = new Subject<boolean>()

  workGroup: WorksEndpoint

  works = $localize`:@@shared.works:Works`
  paginationTotalAmountOfWorks: number
  paginationIndex: number
  paginationPageSize: number

  constructor(
    private _record: RecordService,
    private _works: RecordWorksService
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
  }

  trackByWorkGroup(index, item: WorkGroup) {
    return item.defaultPutCode
  }

  expandedClicked(expanded: boolean) {
    this.expanded.emit({ type: 'works', expanded })
  }

  pageEvent(event: PageEvent) {
    this._works.changePage(event, this.isPublicRecord)
  }
}
