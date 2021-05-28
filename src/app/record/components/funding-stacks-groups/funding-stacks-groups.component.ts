import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { isEmpty } from 'lodash'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { UserService } from 'src/app/core'
import { RecordService } from 'src/app/core/record/record.service'
import { FundingGroup } from 'src/app/types/record-funding.endpoint'
import { UserSession } from 'src/app/types/session.local'
import { RecordFundingsService } from '../../../core/record-fundings/record-fundings.service'

@Component({
  selector: 'app-fundings',
  templateUrl: './funding-stacks-groups.component.html',
  styleUrls: ['./funding-stacks-groups.component.scss'],
})
export class FundingStacksGroupsComponent implements OnInit {
  labelAddButton = $localize`:@@shared.addFunding:Add Funding`
  labelSortButton = $localize`:@@shared.sortFundings:Sort Fundings`
  @Input() isPublicRecord: any = false
  @Input() expandedContent: boolean
  @Output() total: EventEmitter<any> = new EventEmitter()
  @Output() expanded: EventEmitter<any> = new EventEmitter()

  $destroy: Subject<boolean> = new Subject<boolean>()
  userSession: UserSession
  fundings: FundingGroup[]

  ngOrcidFunding = $localize`:@@shared.funding:Funding`

  constructor(
    private _userSession: UserService,
    private _record: RecordService,
    private _recordFundingsService: RecordFundingsService
  ) {}

  ngOnInit(): void {
    this.getRecord()
  }

  private getRecord() {
    this._userSession
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userSession) => {
        this.userSession = userSession

        this._record
          .getRecord({
            publicRecordId: this.isPublicRecord || undefined,
          })
          .pipe(takeUntil(this.$destroy))
          .subscribe((userRecord) => {
            if (!isEmpty(userRecord.fundings)) {
              this.fundings = userRecord.fundings
              this.total.emit(userRecord.fundings.length)
            }
          })
      })
  }

  trackByFundingGroup(index, item: FundingGroup) {
    return item.activePutCode
  }

  expandedClicked(expanded: boolean) {
    this.expanded.emit({ type: 'fundings', expanded })
  }
}
