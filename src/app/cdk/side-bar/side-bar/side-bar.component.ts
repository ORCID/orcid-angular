import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'
import { UserService } from 'src/app/core'
import { RecordService } from 'src/app/core/record/record.service'
import { Address, Assertion, AssertionVisibilityString, NameForm, UserInfo } from 'src/app/types'
import { LegacyOauthRequestInfoForm as RequestInfoForm } from 'src/app/types/request-info-form.endpoint'
import { UserRecord } from 'src/app/types/record.local'

import { PlatformInfo, PlatformInfoService } from '../../platform-info'
import { ModalCountryComponent } from '../modals/modal-country/modal-country.component'
import { ModalEmailComponent } from '../modals/modal-email/modal-email.component'
import { ModalKeywordComponent } from '../modals/modal-keyword/modal-keyword.component'
import { ModalPersonIdentifiersComponent } from '../modals/modal-person-identifiers/modal-person-identifiers.component'
import { ModalWebsitesComponent } from '../modals/modal-websites/modal-websites.component'
import { ActivatedRoute } from '@angular/router'
import { RecordUtil } from 'src/app/shared/utils/record.util'
import { TogglzService } from 'src/app/core/togglz/togglz.service'

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: [
    './side-bar.component.scss-theme.scss',
    './side-bar.component.scss',
  ],
  standalone: false,
})
export class SideBarComponent implements OnInit, OnDestroy {
  labelManageYourEmails = $localize`:"@@record.manageYourEmails:Manage your emails`
  labelManageYourWebsites = $localize`:"@@record.manageYourWebsite:Manage your websites & social links`
  labelManageYourKeyword = $localize`:"@@record.labelManageYourKeyword:Manage your keywords`
  labelManageYourCountries = $localize`:"@@record.labelManageYourCountries:Manage your countries`
  labelManageYourPersonalIds = $localize`:"@@record.labelManageYourPersonalIds:Manage your personalIds`
  selfAssertedSource = $localize`:@@record.selfAssertedSource:Self-asserted source`
  orcidEmailValidation = $localize`:@@side-bar.orcidEmailValidation:ORCID email validation`

  $destroy: Subject<boolean> = new Subject<boolean>()

  @Output() isSideBarEmpty: EventEmitter<any> = new EventEmitter()

  @Input() isPublicRecord: string
  @Input() orcidId = false
  @Input() hideOrcidId = false
  @Input() loadingUserRecord: boolean

  modalCountryComponent = ModalCountryComponent
  modalEmailComponent = ModalEmailComponent
  modalWebsitesComponent = ModalWebsitesComponent
  modalKeywordComponent = ModalKeywordComponent
  modalPersonalIdentifiers = ModalPersonIdentifiersComponent

  displaySideBar: boolean

  userSession: {
    userInfo: UserInfo
    nameForm: NameForm
    oauthSession: RequestInfoForm
    displayName: string
    orcidUrl: string
    loggedIn: boolean
  }
  userInfo: UserInfo
  userRecord: UserRecord
  platform: PlatformInfo

  websiteOpenState = false
  keywordOpenState = false
  addressOpenState = false
  countriesOpenState = false
  externalIdentifierOpenState = false
  emailsOpenState = false
  recordWithIssues: boolean
  loadingTogglz = true
  emailDomainsTogglz = false

  regionPersonalInformation = $localize`:@@shared.personalInformation:Personal information`
  fragment: string

  constructor(
    _platform: PlatformInfoService,
    private _user: UserService,
    private _record: RecordService,
    private _route: ActivatedRoute,
    private _togglz: TogglzService
  ) {
    _platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.platform = data
      })
  }

  ngOnInit(): void {
    this._togglz
      .getStateOf('EMAIL_DOMAINS_UI')
      .pipe(take(1))
      .subscribe((value) => {
        this.loadingTogglz = false
        this.emailDomainsTogglz = value
      })
    this.getRecord()
    this.externalIdentifierOpenState =
      this._route.snapshot.fragment === 'other-identifiers'
  }

  private getRecord() {
    this._user
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userSession) => {
        this.userSession = userSession
      })

    // Loads the public record if `isPublicRecord` is defined
    // Otherwise loads the current login private record
    this._record
      .getRecord({
        publicRecordId: this.isPublicRecord || undefined,
      })
      .pipe(takeUntil(this.$destroy))
      .subscribe((userRecord) => {
        this.recordWithIssues = userRecord?.userInfo?.RECORD_WITH_ISSUES
        if (!this.orcidId && this.recordWithIssues) {
          this.orcidId = true
        }
        this.userRecord = userRecord

        this.userInfo = userRecord?.userInfo

        this.onSideBarElementsDisplay(userRecord)
      })
  }

  getWebsite(website: Assertion) {
    return website.urlName !== null && website.urlName !== ''
      ? website.urlName
      : website.url.value
  }

  getKeyword(keyword: Assertion) {
    return keyword.content
  }

  getKeywords(keywords: Assertion[]): string[] {
    return keywords.map((keyword) => {
      return keyword.content
    })
  }

  getAddresses(addresses: Address[]): string[] {
    return addresses.map((address) => {
      return address.countryName
    })
  }

  onSideBarElementsDisplay(userRecord: UserRecord): void {
    this.displaySideBar = RecordUtil.isSideBarEmpty(
      !!this.isPublicRecord,
      userRecord
    )
    this.isSideBarEmpty.emit(this.displaySideBar)
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
