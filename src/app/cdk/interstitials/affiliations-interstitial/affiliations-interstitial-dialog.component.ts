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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
} from '@angular/forms'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { error } from 'console'
import { WINDOW } from '../../window'
import {
  MAT_LEGACY_DIALOG_DATA,
  MatLegacyDialogRef,
  MatLegacyDialogState,
} from '@angular/material/legacy-dialog'
import { OrganizationsService, UserService } from 'src/app/core'
import { AffiliationsInterstitialComponent } from './affiliations-interstitial.component'
import { RecordService } from 'src/app/core/record/record.service'
import { RecordCountriesService } from 'src/app/core/record-countries/record-countries.service'
import { RecordAffiliationService } from 'src/app/core/record-affiliations/record-affiliations.service'
import { RegisterService } from 'src/app/core/register/register.service'

export type AffilationsComponentDialogInput = void
export type AffilationsComponentDialogOutput = {
  type: 'affiliation-interstitial'
  addedAffiliation?: string
}

@Component({
  templateUrl: './affiliations-interstitial.component.html',
  styleUrls: [
    './affiliations-interstitial-dialog.component.scss',
    './affiliations-interstitial.component.scss-theme.scss',
  ],
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
    private dialogRef: MatLegacyDialogRef<
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
      registerService
    )
  }
  override finishIntertsitial(affiliation?: string) {
    this.dialogRef.close({
      type: 'affiliation-interstitial',
      addedAffiliation: affiliation,
    })
  }
}
