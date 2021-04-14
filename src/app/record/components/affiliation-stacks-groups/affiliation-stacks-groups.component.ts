import { Component, Input, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { UserService } from 'src/app/core'
import { RecordService } from 'src/app/core/record/record.service'
import {
  AffiliationGroup,
  AffiliationUIGroup,
} from 'src/app/types/record-affiliation.endpoint'
import { UserRecord } from 'src/app/types/record.local'
import { UserSession } from 'src/app/types/session.local'

@Component({
  selector: 'app-affiliations',
  templateUrl: './affiliation-stacks-groups.component.html',
  styleUrls: ['./affiliation-stacks-groups.component.scss'],
})
export class AffiliationStacksGroupsComponent implements OnInit {
  $destroy: Subject<boolean> = new Subject<boolean>()
  @Input() isPublicRecord: any = false

  profileAffiliationUiGroups: AffiliationUIGroup[]
  userSession: UserSession
  userRecord: UserRecord

  constructor(
    private _userSession: UserService,
    private _record: RecordService
  ) {}

  ngOnInit(): void {
    console.log('RECORD ON AFFILIATIONS', this.isPublicRecord)

    if (!this.isPublicRecord) {
      this.getPrivateRecord()
    }
  }

  private getPrivateRecord() {
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
            this.profileAffiliationUiGroups = this.userRecord.affiliations
          })
      })
  }

  trackByProfileAffiliationUiGroups(index, item: AffiliationUIGroup) {
    return item.type
  }

  trackByAffiliationGroup(index, item: AffiliationGroup) {
    return item.activePutCode
  }
}
