import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { UserService } from 'src/app/core'
import { Subject } from 'rxjs'
import { UserInfo, NameForm, RequestInfoForm, Assertion } from 'src/app/types'
import { takeUntil } from 'rxjs/operators'
import { RecordService } from 'src/app/core/record/record.service'
import { UserRecord } from 'src/app/types/record.local'

import { ModalCountryComponent } from '../modals/modal-country/modal-country.component'
import { PlatformInfo, PlatformInfoService } from '../../platform-info'
import { ModalEmailComponent } from '../modals/modal-email/modal-email.component'
import { ModalWebsitesComponent } from '../modals/modal-websites/modal-websites.component'
import { ModalKeywordComponent } from '../modals/modal-keyword/modal-keyword.component'

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: [
    './side-bar.component.scss-theme.scss',
    './side-bar.component.scss',
  ],
})
export class SideBarComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  @Input() onlyOrcidId = false

  modalCountryComponent = ModalCountryComponent
  modalEmailComponent = ModalEmailComponent
  modalWebsitesComponent = ModalWebsitesComponent
  modalKeywordComponent = ModalKeywordComponent

  userSession: {
    userInfo: UserInfo
    nameForm: NameForm
    oauthSession: RequestInfoForm
    displayName: string
    orcidUrl: string
    loggedIn: boolean
  }
  userRecord: UserRecord
  platform: PlatformInfo

  constructor(
    _platform: PlatformInfoService,
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
          })
      })
  }

  getWebsite(website: Assertion) {
    return website.urlName !== null && website.urlName !== ''
      ? website.urlName
      : website.url.value
  }

  getKeyword(keyword: Assertion) {
    console.log(keyword)
    return keyword.content
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
