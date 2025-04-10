import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core'
import { PlatformInfoService } from '../../platform-info'
import {
  AssertionVisibilityString,
  EmailsEndpoint,
  RequestInfoForm,
} from 'src/app/types'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { error } from 'console'
import { WINDOW } from '../../window'
import {
  MAT_LEGACY_DIALOG_DATA,
  MatLegacyDialogRef,
  MatLegacyDialogState,
} from '@angular/material/legacy-dialog'
import { map, takeUntil } from 'rxjs/operators'
import { UserService } from 'src/app/core'
import { Subject } from 'rxjs'



@Component({
  selector: 'app-share-emails-domains',
  templateUrl: './share-emails-domains.component.html',
  styleUrls: [
    './share-emails-domains.component.scss',
    './share-emails-domains.component.scss-theme.scss',
  ],
})
export class ShareEmailsDomainsComponent implements OnDestroy {
  beforeSummit = true
  afterSummit = false
  userPrivateDomains: AssertionVisibilityString[]
  @Input() userEmailsJson: EmailsEndpoint
  form: any
  $destroy: Subject<void> = new Subject<void>()
  oauthRequest: RequestInfoForm
  organizationName: string
  constructor(
    public platformInfo: PlatformInfoService,
    private fb: FormBuilder,
    private recordEmailsService: RecordEmailsService,
    private _user: UserService,
    @Inject(WINDOW) private window: Window
  ) {}

  public loadingEmails = true
  @Output() finish = new EventEmitter<void>()

  ngOnInit() {
    this.window.scrollTo(0, 0)
    this.userPrivateDomains = this.getTop3MostRecentPrivateDomains(
      this.userEmailsJson
    )
    this.form = this.fb.group({
      items: this.fb.array(
        this.userPrivateDomains?.map((item) => this.createItemFormGroup(item))
      ),
    })

    this._user
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userInfo) => {
        this.oauthRequest = userInfo.oauthSession
        this.organizationName = this.oauthRequest?.clientName
      })
  }

  getTop3MostRecentPrivateDomains(
    value: EmailsEndpoint
  ): AssertionVisibilityString[] {
    return value?.emailDomains
      .filter((domain) => domain.visibility !== 'PUBLIC')
      .sort((a, b) => {
        if (b?.createdDate?.timestamp && a?.createdDate?.timestamp) {
          return b.createdDate.timestamp - a.createdDate.timestamp
        } else {
          return 0
        }
      })
      .slice(0, 3)
  }

  createItemFormGroup(item: AssertionVisibilityString): FormGroup {
    return this.fb.group({
      email: new FormControl(item.value),
      selected: new FormControl(true),
    })
  }

  get domainToMakePublic(): string[] {
    return (
      this.form?.value?.items
        ?.filter((item: any) => item.selected)
        .map((item: any) => item.email) || []
    )
  }

  accept(answear: boolean) {
    if (answear && this.domainToMakePublic.length > 0) {
      this.userEmailsJson.emailDomains.forEach((domain) => {
        if (this.domainToMakePublic.includes(domain.value)) {
          domain.visibility = 'PUBLIC'
        }
      })

      this.recordEmailsService.postEmails(this.userEmailsJson).subscribe(
        (response) => {
          this.afterEmailUpdates(this.domainToMakePublic)
        },
        (error) => this.finishIntertsitial()
      )
    } else {
      this.finishIntertsitial()
    }
  }
  afterEmailUpdates(emails: string[]) {
    this.afterSummit = true
    this.beforeSummit = false
    setTimeout(() => {
      this.finishIntertsitial()
    }, 10000)
  }

  finishIntertsitial(emails?: string[]) {
    this.finish.emit()
  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.unsubscribe()
  }


}
