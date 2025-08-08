import {
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  Output,
} from '@angular/core'
import { AssertionVisibilityString, EmailsEndpoint } from 'src/app/types'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
} from '@angular/forms'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { error } from 'console'
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogState,
} from '@angular/material/dialog'
import { OrganizationsService, UserService } from 'src/app/core'
import { RecordService } from 'src/app/core/record/record.service'
import { RecordAffiliationService } from 'src/app/core/record-affiliations/record-affiliations.service'
import { RegisterService } from 'src/app/core/register/register.service'

import {
  BaseInterstitialDialogInput,
  BaseInterstitialDialogOutput,
} from 'src/app/core/login-interstitials-manager/abstractions/dialog-interface'
import { PlatformInfoService } from 'src/app/cdk/platform-info/platform-info.service'
import { WINDOW } from 'src/app/cdk/window'
import { AffiliationsInterstitialComponent } from '../interstitial-component/affiliations-interstitial.component'
import { Affiliation } from 'src/app/types/record-affiliation.endpoint'

export interface AffilationsComponentDialogInput
  extends BaseInterstitialDialogInput {
  type: 'affiliation-interstitial'
}

export interface AffilationsComponentDialogOutput
  extends BaseInterstitialDialogOutput {
  type: 'affiliation-interstitial'
  addedAffiliation?: Affiliation
}

@Component({
    templateUrl: '../interstitial-component/affiliations-interstitial.component.html',
    styleUrls: [
        './affiliations-interstitial-dialog.component.scss',
        '../interstitial-component/affiliations-interstitial.component.scss',
        '../interstitial-component/affiliations-interstitial.component.scss-theme.scss',
    ],
    standalone: false
})
export class AffiliationsInterstitialDialogComponent extends AffiliationsInterstitialComponent {
  @HostBinding('class.columns-12') desktop: boolean = false
  organizationFromDatabase: any

  constructor(
    @Inject(WINDOW) window: Window,
    platformService: PlatformInfoService,
    recordAffiliationService: RecordAffiliationService,
    formBuilder: UntypedFormBuilder,
    recordService: RecordService,
    organizationService: OrganizationsService,
    registerService: RegisterService,
    private dialogRef: MatDialogRef<
      AffiliationsInterstitialDialogComponent,
      AffilationsComponentDialogOutput
    >,
    user: UserService
  ) {
    super(
      window,
      platformService,
      recordAffiliationService,
      formBuilder,
      recordService,
      organizationService,
      registerService,
      user
    )
  }
  override afterSummit(affiliation?: Affiliation) {
    this.finishIntertsitial(affiliation)
  }

  override finishIntertsitial(affiliation?: Affiliation) {
    this.dialogRef.close({
      type: 'affiliation-interstitial',
      addedAffiliation: affiliation,
    })
  }
}
