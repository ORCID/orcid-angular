import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { UserRecord } from '../../../types/record.local'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { ModalNameComponent } from './modals/modal-name/modal-name.component'
import { ModalBiographyComponent } from './modals/modal-biography/modal-biography.component'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { UserService } from '../../../core'
import { RecordService } from '../../../core/record/record.service'
import { isEmpty } from 'lodash'
import { Assertion } from '../../../types'
import { UserStatus } from '../../../types/userStatus.endpoint'

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
  @Input() isPublicRecord: string

  userRecord: UserRecord
  userStatus: UserStatus

  modalNameComponent = ModalNameComponent
  modalBiographyComponent = ModalBiographyComponent

  platform: PlatformInfo
  givenNames = ''
  familyName = ''
  creditName = ''
  expandedContent = false
  recordWithIssues: boolean
  loadingUserRecord = true

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
    _user
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.userStatus = data
      })
  }

  ngOnInit(): void {
    this._record
      .getRecord({
        publicRecordId: this.isPublicRecord || undefined,
      })
      .pipe(takeUntil(this.$destroy))
      .subscribe((userRecord) => {
        this.recordWithIssues = userRecord?.userInfo?.RECORD_WITH_ISSUES
        this.checkLoadingState(userRecord)
        this.userRecord = userRecord
        if (!isEmpty(userRecord.otherNames)) {
          this.setNames(userRecord)
        }
      })
  }

  checkLoadingState(userRecord: UserRecord) {
    const missingValues = Object.keys(userRecord).filter((key) => {
      if (
        key !== 'names' &&
        key !== 'lastModifiedTime' &&
        this.isPublicRecord
      ) {
        return typeof userRecord[key] === 'boolean' && !userRecord[key]
      } else if (key !== 'lastModifiedTime') {
        return typeof userRecord[key] === 'boolean' && !userRecord[key]
      } else {
        return false
      }
    })
    this.loadingUserRecord = !!missingValues.length
  }

  private setNames(userRecord: UserRecord) {
    this.givenNames = this.userRecord?.names?.givenNames
      ? this.userRecord.names.givenNames.value
      : ''
    this.familyName = this.userRecord?.names?.familyName
      ? this.userRecord.names.familyName.value
      : ''
    this.creditName = this.userRecord?.names?.creditName
      ? this.userRecord.names.creditName.value
      : ''
  }

  getOtherNames(otherNames: Assertion[]): string[] {
    return otherNames.map((otherName) => {
      return otherName.content
    })
  }

  collapse(): void {
    this.expandedContent = !this.expandedContent
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
