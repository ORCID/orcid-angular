import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core'
import {
  AssertionVisibilityString,
  EmailsEndpoint,
  RequestInfoForm,
} from 'src/app/types'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'

import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators'
import { UserService } from 'src/app/core'
import { Subject } from 'rxjs'
import { PlatformInfoService } from 'src/app/cdk/platform-info/platform-info.service'
import { WINDOW } from 'src/app/cdk/window/window.service'
import { RecordService } from 'src/app/core/record/record.service'

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
  afterSummitStatus = false
  userPrivateDomains: AssertionVisibilityString[]
  form: any
  $destroy: Subject<void> = new Subject<void>()
  organizationName: string
  userEmailsJson: EmailsEndpoint
  constructor(
    public platformInfo: PlatformInfoService,
    private fb: FormBuilder,
    private recordEmailsService: RecordEmailsService,
    private _user: UserService,
    private _recordService: RecordService,
    @Inject(WINDOW) private window: Window
  ) {}

  public loadingEmails = true
  @Output() finish = new EventEmitter<void>()

  ngOnInit() {
    this.window.scrollTo(0, 0)
    this._recordService
      .getRecord()
      .pipe(
        filter((record) => !!record.emails?.emailDomains),
        take(1),
        map((record) => {
          this.loadingEmails = false
          this.userEmailsJson = record.emails
          this.userPrivateDomains = this.getTop3MostRecentPrivateDomains(
            record.emails
          )

          this.form = this.fb.group({
            items: this.fb.array(
              this.userPrivateDomains?.map((item) =>
                this.createItemFormGroup(item)
              )
            ),
          })
        })
      )
      .subscribe()

    this._user
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userInfo) => {
        this.organizationName = userInfo.oauthSession?.clientName
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
          this.afterSummit(this.domainToMakePublic)
        },
        (error) => this.finishIntertsitial()
      )
    } else {
      this.finishIntertsitial()
    }
  }
  afterSummit(emails: string[]) {
    this.afterSummitStatus = true
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
