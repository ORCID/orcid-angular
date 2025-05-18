import {
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  Output,
} from '@angular/core'
import { PlatformInfoService } from '../../platform-info'
import { AssertionVisibilityString, EmailsEndpoint } from 'src/app/types'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { error } from 'console'
import { WINDOW } from '../../window'
import {
  MAT_LEGACY_DIALOG_DATA,
  MatLegacyDialogRef,
  MatLegacyDialogState,
} from '@angular/material/legacy-dialog'
import { ShareEmailsDomainsComponent } from './share-emails-domains.component'
import { UserService } from 'src/app/core'
import {
  BaseInterstitialDialogInput,
  BaseInterstitialDialogOutput,
} from 'src/app/core/login-interstitials-manager/abstractions/dialog-interface'

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
  templateUrl: './share-emails-domains.component.html',
  styleUrls: [
    './share-emails-domains-dialog.component.scss',
    './share-emails-domains.component.scss-theme.scss',
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
    user: UserService
  ) {
    super(platformInfo, fb, recordEmailsService, user, window)
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

  override afterEmailUpdates(emails: string[]) {
    this.finishIntertsitial(emails)
  }
}
