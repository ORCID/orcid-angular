import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { UserRecord } from '../../../types/record.local'
import { NameForm, RequestInfoForm, UserInfo } from '../../../types'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { ModalNameComponent } from './modals/modal-name/modal-name.component'
import { ModalBiographyComponent } from './modals/modal-biography/modal-biography.component'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { UserService } from '../../../core'
import { RecordService } from '../../../core/record/record.service'

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: [
    './top-bar.component.scss',
    './top-bar.component.scss-theme.scss',
  ],
})
export class TopBarComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  userSession: {
    userInfo: UserInfo
    nameForm: NameForm
    oauthSession: RequestInfoForm
    displayName: string
    orcidUrl: string
    loggedIn: boolean
  }
  userRecord: UserRecord

  modalNameComponent = ModalNameComponent
  modalBiographyComponent = ModalBiographyComponent

  platform: PlatformInfo
  givenNames: String = ''
  familyName: String = ''
  creditName: String = ''

  constructor(
    private _platform: PlatformInfoService,
    private _user: UserService,
    private _record: RecordService
  ) {
    _platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.platform = data
      })
  }

  ngOnInit(): void {
    this._user
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userSession) => {
        this.userSession = userSession

        // TODO @amontenegro
        // AVOID requiring the orcid url to getPerson to call all the record data on parallel
        this._record
          .getRecord(this.userSession.userInfo.EFFECTIVE_USER_ORCID)
          .pipe(takeUntil(this.$destroy))
          .subscribe((userRecord) => {
            this.userRecord = userRecord
            this.givenNames = this.userRecord.names.givenNames
              ? this.userRecord.names.givenNames.value
              : ''
            this.familyName = this.userRecord.names.familyName
              ? this.userRecord.names.familyName.value
              : ''
            this.creditName = this.userRecord.names.creditName
              ? this.userRecord.names.creditName.value
              : ''
          })
      })
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
