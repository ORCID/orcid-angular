import { Component, EventEmitter, Inject, Input, Output } from '@angular/core'
import { PlatformInfoService } from '../../platform-info'
import { AssertionVisibilityString, EmailsEndpoint } from 'src/app/types'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { error } from 'console'
import { WINDOW } from '../../window'

@Component({
  selector: 'app-share-emails-domains',
  templateUrl: './share-emails-domains.component.html',
  styleUrls: [
    './share-emails-domains.component.scss',
    './share-emails-domains.component.scss-theme.scss',
  ],
})
export class ShareEmailsDomainsComponent {
  beforeSummit = true
  afterSummit = false
  userPrivateDomains: AssertionVisibilityString[]
  @Input() userEmailsJson: EmailsEndpoint
  @Input() organizationName: string
  form: any
  constructor(
    public platformInfo: PlatformInfoService,
    private fb: FormBuilder,
    private recordEmailsService: RecordEmailsService,
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
  }

  getTop3MostRecentPrivateDomains(
    value: EmailsEndpoint
  ): AssertionVisibilityString[] {
    return value?.emailDomains
      .filter((domain) => domain.visibility !== 'PUBLIC')
      .sort((a, b) => {
        return b.createdDate.timestamp - a.createdDate.timestamp
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
          this.afterSummit = true
          this.beforeSummit = false
          setTimeout(() => {
            this.finish.emit()
          }, 10000)
        },
        (error) => this.finish.emit()
      )
    } else {
      this.finish.emit()
    }
  }
}
