import { Component, Input, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'
import { UserService } from 'src/app/core'
import { RecordService } from 'src/app/core/record/record.service'
import { FundingGroup } from 'src/app/types/record-funding.endpoint'
import { UserRecord } from 'src/app/types/record.local'
import { UserSession } from 'src/app/types/session.local'
import { RecordFundingsService } from '../../../core/record-fundings/record-fundings.service'

@Component({
  selector: 'app-fundings',
  templateUrl: './funding-stacks-groups.component.html',
  styleUrls: ['./funding-stacks-groups.component.scss'],
})
export class FundingStacksGroupsComponent implements OnInit {
  @Input() isPublicRecord: any = false
  @Input() expandedContent: boolean

  $destroy: Subject<boolean> = new Subject<boolean>()
  userSession: UserSession
  userRecord: UserRecord

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
            this.userRecord = userRecord

            this._recordFundingsService
              .getFundings({
                publicRecordId: this.isPublicRecord,
              })
              .pipe(first())
              .subscribe((data) => {
                this.userRecord.fundings = data
              })
          })
      })
  }

  trackByFundingGroup(index, item: FundingGroup) {
    return item.activePutCode
  }
}
