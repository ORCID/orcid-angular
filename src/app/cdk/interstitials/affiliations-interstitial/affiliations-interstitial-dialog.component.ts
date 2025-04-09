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
import { Register2Service } from 'src/app/core/register2/register2.service'

export type AffilationsComponentDialogInput = {
  userEmailsJson: EmailsEndpoint
  organizationName?: string
}
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
    _platform: PlatformInfoService,
    _recordCountryService: RecordCountriesService,
    _recordAffiliationService: RecordAffiliationService,
    _formBuilder: UntypedFormBuilder,
    _record: RecordService,
    _organizationService: OrganizationsService,
    registerService: Register2Service,
    _recordAffiliation: RecordAffiliationService,

    private dialogRef: MatLegacyDialogRef<
      AffiliationsInterstitialDialogComponent,
      AffilationsComponentDialogOutput
    >,
    user: UserService
  ) {
    super(
      window,
      _platform,
      _recordCountryService,
      _recordAffiliationService,
      _formBuilder,
      _record,
      _organizationService,
      registerService,
      _recordAffiliation
    )
  }
  override finishIntertsitial(affiliation?: string) {
    console.log ('finishIntertsitial', affiliation)
    this.dialogRef.close({
      type: 'affiliation-interstitial',
      addedAffiliation: affiliation,
    })
  }
}
