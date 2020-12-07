import { Component, Input, OnInit } from '@angular/core'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { NameForm, RequestInfoForm, UserInfo } from '../../../types'
import { UserRecord } from '../../../types/record.local'
import { UserService } from '../../../core'
import { RecordService } from '../../../core/record/record.service'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-my-orcid',
  templateUrl: './my-orcid.component.html',
  styleUrls: ['./my-orcid.component.scss'],
})
export class MyOrcidComponent implements OnInit {
  platform: PlatformInfo
  userSession: {
    userInfo: UserInfo
    nameForm: NameForm
    oauthSession: RequestInfoForm
    displayName: string
    orcidUrl: string
    loggedIn: boolean
  }
  userRecord: UserRecord
  destroy$: Subject<boolean> = new Subject<boolean>()


  constructor(
    private _platform: PlatformInfoService,
    private _user: UserService,
    private _record: RecordService
  ) {}

  ngOnInit(): void {
    this._platform.get().subscribe((value) => (this.platform = value))
    this._user
      .getUserSession()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userSession) => {
        this.userSession = userSession

        // TODO @amontenegro
        // AVOID requiring the orcid url to getPerson to call all the record data on parallel
        this._record
          .getRecord(this.userSession.userInfo.EFFECTIVE_USER_ORCID)
          .pipe(takeUntil(this.destroy$))
          .subscribe((userRecord) => {
            this.userRecord = userRecord
          })
      })
  }
}
