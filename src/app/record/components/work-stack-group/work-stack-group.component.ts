import { Component, Input, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { UserService } from 'src/app/core'
import { RecordService } from 'src/app/core/record/record.service'
import { WorkGroup, WorksEndpoint } from 'src/app/types/record-works.endpoint'
import { UserRecord } from 'src/app/types/record.local'
import { UserSession } from 'src/app/types/session.local'

@Component({
  selector: 'app-work-stack-group',
  templateUrl: './work-stack-group.component.html',
  styleUrls: ['./work-stack-group.component.scss'],
})
export class WorkStackGroupComponent implements OnInit {
  @Input() isPublicRecord: string

  $destroy: Subject<boolean> = new Subject<boolean>()

  workGroup: WorksEndpoint
  userSession: UserSession
  userRecord: UserRecord

  constructor(
    private _userSession: UserService,
    private _record: RecordService
  ) {}

  ngOnInit(): void {
    if (!this.isPublicRecord) {
      this.getPrivateRecordWorks()
    }
  }

  private getPrivateRecordWorks() {
    this._userSession
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userSession) => {
        this.userSession = userSession

        // TODO @amontenegro
        // AVOID requiring the orcid url to getPerson to call all the record data on parallel
        this._record
          .getRecord({
            privateRecordId: this.userSession.userInfo.EFFECTIVE_USER_ORCID,
          })
          .pipe(takeUntil(this.$destroy))
          .subscribe((userRecord) => {
            this.userRecord = userRecord
            this.workGroup = this.userRecord.works
          })
      })
  }

  trackByWorkGroup(index, item: WorkGroup) {
    return item.defaultPutCode
  }
}
