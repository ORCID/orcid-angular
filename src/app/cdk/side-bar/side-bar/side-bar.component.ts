import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { UserService } from 'src/app/core'
import { Observable, Subject } from 'rxjs'
import { UserInfo, NameForm, RequestInfoForm } from 'src/app/types'
import { takeUntil } from 'rxjs/operators'
import { RecordService } from 'src/app/core/record/record.service'
import { UserRecord } from 'src/app/types/record.local'
import { ModalEmailComponent } from '../modals/modal-email/modal-email.component'

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: [
    './side-bar.component.scss-theme.scss',
    './side-bar.component.scss',
  ],
})
export class SideBarComponent implements OnInit, OnDestroy {
  @Input() onlyOrcidId = false

  modalEmailComponent = ModalEmailComponent

  destroy$: Subject<boolean> = new Subject<boolean>()
  userSession: {
    userInfo: UserInfo
    nameForm: NameForm
    oauthSession: RequestInfoForm
    displayName: string
    orcidUrl: string
    loggedIn: boolean
  }
  userRecord: UserRecord
  constructor(private _user: UserService, private _record: RecordService) {}

  ngOnInit(): void {
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

  ngOnDestroy() {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }
}
