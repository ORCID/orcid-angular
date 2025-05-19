import {
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  Output,
} from '@angular/core'
import { AssertionVisibilityString, EmailsEndpoint } from 'src/app/types'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { error } from 'console'
import {
  MAT_LEGACY_DIALOG_DATA,
  MatLegacyDialogRef,
  MatLegacyDialogState,
} from '@angular/material/legacy-dialog'
import { UserService } from 'src/app/core'
import {
  BaseInterstitialDialogInput,
  BaseInterstitialDialogOutput,
} from 'src/app/core/login-interstitials-manager/abstractions/dialog-interface'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { ShareEmailsDomainsComponent } from '../interstitial-component/share-emails-domains.component'
import { RecordService } from 'src/app/core/record/record.service'

export interface ShareEmailsDomainsComponentDialogInput
  extends BaseInterstitialDialogInput {
  type: 'domains-interstitial'
  userEmailsJson: EmailsEndpoint
  organizationName?: string
}
export interface ShareEmailsDomainsComponentDialogOutput
  extends BaseInterstitialDialogOutput {
  type: 'domains-interstitial'
  newlySharedDomains?: string[]
}

@Component({
  templateUrl: '../interstitial-component/share-emails-domains.component.html',
  styleUrls: [
    './share-emails-domains-dialog.component.scss',
    '../interstitial-component/share-emails-domains.component.scss',
    '../interstitial-component/share-emails-domains.component.scss-theme.scss',
  ],
})
export class ShareEmailsDomainsDialogComponent extends ShareEmailsDomainsComponent {
  @HostBinding('class.columns-12') desktop: boolean = false

  constructor(
    platformInfo: PlatformInfoService,
    fb: FormBuilder,
    recordEmailsService: RecordEmailsService,
    @Inject(WINDOW) window: Window,
    @Inject(MAT_LEGACY_DIALOG_DATA)
    public data: ShareEmailsDomainsComponentDialogInput,
    public dialogRef: MatLegacyDialogRef<
      ShareEmailsDomainsDialogComponent,
      ShareEmailsDomainsComponentDialogOutput
    >,
    _recordService: RecordService,
    user: UserService
  ) {
    super(platformInfo, fb, recordEmailsService, user, _recordService, window)
    if (this.data) {
      this.userEmailsJson = this.data.userEmailsJson
      this.organizationName = this.data.organizationName
    }
    platformInfo.get().subscribe((data) => {
      this.desktop = data.desktop
    })
  }

  override finishIntertsitial(emails?: string[]) {
    this.dialogRef.close({
      type: 'domains-interstitial',
      newlySharedDomains: emails,
    })
  }

  override afterSummit(emails: string[]) {
    this.finishIntertsitial(emails)
  }
}
