import { Component, Inject, OnDestroy, OnInit, Input } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms'
import { dateMonthYearValidator } from '../../../../../shared/validators/date/date.validator'

import { URL_REGEXP } from '../../../../../constants'
import { UserRecord } from '../../../../../types/record.local'
import { RecordCountriesService } from '../../../../../core/record-countries/record-countries.service'
import { EMPTY, Subject } from 'rxjs'
import {
  PlatformInfo,
  PlatformInfoService,
} from '../../../../../cdk/platform-info'
import {
  VisibilityStrings,
  Organization,
  ExternalIdentifier,
} from '../../../../../types/common.endpoint'
import { RecordCountryCodesEndpoint } from '../../../../../types'
import { Observable } from 'rxjs/internal/Observable'
import {
  debounceTime,
  first,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs/operators'
import { UserSession } from '../../../../../types/session.local'
import { RecordFundingsService } from 'src/app/core/record-fundings/record-fundings.service'
import { UserService } from '../../../../../core'
import { WINDOW } from '../../../../../cdk/window'
import {
  FundingRelationships,
  LanguageMap,
  CurrencyCodeMap,
  FundingTypes,
  Funding,
  FundingTypesLabel,
  FundingExternalIndentifierType,
} from 'src/app/types/record-funding.endpoint'
import { Title } from '@angular/platform-browser'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { RecordService } from 'src/app/core/record/record.service'

@Component({
  selector: 'app-modal-funding',
  templateUrl: './modal-funding.component.html',
  styleUrls: [
    './modal-funding.component.scss-theme.scss',
    './modal-funding.component.scss',
  ],
})
export class ModalFundingComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  @Input() type: string
  @Input() funding: Funding
  @Input() options: { createACopy: boolean }

  platform: PlatformInfo
  fundingForm: FormGroup
  showTranslationTitle = false
  languageMap = LanguageMap
  currencyCodeMap = CurrencyCodeMap
  userRecord: UserRecord
  userSession: UserSession
  isMobile: boolean
  filteredOptions: Observable<Organization[]>
  loadingFunding = true
  startDateValid: boolean
  endDateValid: boolean
  countryCodes: { key: string; value: string }[]
  originalCountryCodes: RecordCountryCodesEndpoint
  loadingCountryCodes = true
  fundingType = ''
  fundingSubtype = ''
  fundingProjectTitle = ''
  fundingProjectLink = ''
  description = ''
  defaultVisibility: VisibilityStrings
  agencyName = ''
  city = ''
  region = ''
  country = ''
  countryForDisplay = ''
  amount = ''
  currencyCode = ''
  grantsArray: FormArray
  grantsArrayDisplayState: boolean[] = []

  disambiguatedFundingSourceId = ''
  disambiguatedFundingSource = ''
  translatedTitleContent = ''
  translatedTitleLanguage = ''
  fundingTypes = FundingTypes
  fundingTitle = Title
  fundingTypesLabel = FundingTypesLabel
  fundingRelationships: FundingRelationships[] = Object.keys(
    FundingRelationships
  ) as FundingRelationships[]

  years = Array(110)
    .fill(0)
    .map((i, idx) => idx + new Date().getFullYear() - 109)
    .reverse()
  yearsEndDate = Array(120)
    .fill(0)
    .map((i, idx) => idx + new Date().getFullYear() - 109)
    .reverse()
  months = Array(12)
    .fill(0)
    .map((i, idx) => idx + 1)

  ngOrcidYear = $localize`:@@shared.year:Year`
  ngOrcidMonth = $localize`:@@shared.month:Month`

  constructor(
    @Inject(WINDOW) private window: Window,
    private _platform: PlatformInfoService,
    public dialogRef: MatDialogRef<ModalComponent>,

    @Inject(MAT_DIALOG_DATA) public data: UserRecord,
    private _userService: UserService,
    private _recordCountryService: RecordCountriesService,
    private _fundingsService: RecordFundingsService,
    private _formBuilder: FormBuilder,
    private _snackBar: SnackbarService,
    private _record: RecordService
  ) {
    this._platform.get().subscribe((platform) => {
      this.platform = platform
      this.isMobile = platform.columns4 || platform.columns8
    })

    this._userService
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userSession) => {
        this.userSession = userSession
      })
  }

  ngOnInit(): void {
    this.initialValues()

    this.fundingForm = this._formBuilder.group({
      fundingType: new FormControl(this.fundingType, {
        validators: [Validators.required],
      }),
      fundingSubtype: new FormControl(this.fundingSubtype, {}),
      fundingProjectTitle: new FormControl(this.fundingProjectTitle, {
        validators: [Validators.required],
      }),
      translatedTitleContent: [this.translatedTitleContent, []],
      translatedTitleLanguage: [this.translatedTitleLanguage, []],
      fundingProjectLink: new FormControl(this.fundingProjectLink, {
        validators: [Validators.pattern(URL_REGEXP)],
      }),
      description: new FormControl(this.description, {
        validators: [Validators.required],
      }),
      amount: new FormControl(this.amount, {}),
      currencyCode: new FormControl(this.currencyCode, {}),
      startDateGroup: this._formBuilder.group(
        {
          startDateMonth: [''],
          startDateYear: [''],
        },
        { validator: dateMonthYearValidator('startDate') }
      ),
      endDateGroup: this._formBuilder.group(
        {
          endDateMonth: [''],
          endDateYear: [''],
        },
        { validator: dateMonthYearValidator('endDate') }
      ),
      agencyName: new FormControl(this.agencyName, {
        validators: [Validators.required],
      }),
      city: new FormControl(this.city, {
        validators: [Validators.required],
      }),
      region: new FormControl(this.region, {}),
      country: new FormControl(this.country, {
        validators: [Validators.required],
      }),
      grants: new FormArray([]),
      visibility: new FormControl(this.defaultVisibility, {
        validators: [Validators.required],
      }),
    })
    this.grantsArray = this.fundingForm.controls.grants as FormArray

    if (this.funding) {
      if (this.funding.endDate.year) {
        this.fundingForm.patchValue({
          endDateGroup: {
            endDateYear: Number(this.funding.endDate.year),
            endDateMonth: Number(this.funding.endDate.month),
          },
        })
      }

      if (this.funding.startDate.year) {
        this.fundingForm.patchValue({
          startDateGroup: {
            startDateYear: Number(this.funding.startDate.year),
            startDateMonth: Number(this.funding.startDate.month),
          },
        })
      }

      if (this.funding.visibility?.visibility) {
        this.fundingForm.patchValue({
          visibility: this.funding.visibility.visibility,
        })
      }

      this.funding.externalIdentifiers.forEach((grant) => {
        this.addAnotherGrant(grant)
      })
    } else {
      // If there is an existing funding, do not overwrite the visibility
      this._record
        .getPreferences()
        .pipe(first())
        .subscribe((userPreferences) => {
          this.defaultVisibility = userPreferences.default_visibility
          this.fundingForm.patchValue({
            visibility: this.defaultVisibility,
          })
        })
    }

    this._recordCountryService
      .getCountryCodes()
      .pipe(first())
      .subscribe((codes) => {
        this.originalCountryCodes = codes
        this.countryCodes = Object.entries(codes).map((keyValue) => {
          return { key: keyValue[0], value: keyValue[1] }
        })
        this.countryCodes.sort((a, b) => {
          if (a.key < b.key) {
            return -1
          }
          if (a.key > b.key) {
            return 1
          }
          return 0
        })
        this.loadingCountryCodes = false
        if (this.funding) {
          this.fundingForm.patchValue({
            country: this.countryCodes.find(
              (x) => x.value === this.funding.country.value
            ).key,
          })
        }
      })

    this.filteredOptions = this.fundingForm.get('agencyName').valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap((val) => {
        return this._filter(val || '')
      })
    )
  }

  initialValues() {
    if (this.funding?.putCode) {
      if (this.funding) {
        this._fundingsService
          .getFundingDetails(this.funding.putCode.value)
          .pipe(first())
          .subscribe((fundingDetails) => {
            this.loadingFunding = false
            this.fundingForm.patchValue({
              description: fundingDetails.description?.value,
            })
            this.fundingForm.patchValue({
              amount: fundingDetails.amount?.value,
            })
            this.fundingForm.patchValue({
              currencyCode: fundingDetails.currencyCode?.value,
            })
            this.fundingForm.patchValue({
              fundingSubtype:
                fundingDetails.organizationDefinedFundingSubType?.subtype
                  ?.value,
            })
          })
      } else {
        this.loadingFunding = false
      }
      this.city = this.funding.city?.value
      this.region = this.funding.region?.value
      this.country = this.funding.country?.value
      this.fundingType = this.funding.fundingType?.value
      this.fundingSubtype = this.funding.organizationDefinedFundingSubType?.subtype?.value
      this.fundingProjectTitle = this.funding.fundingTitle?.title.value
      this.translatedTitleContent = this.funding.fundingTitle?.translatedTitle?.content
      this.translatedTitleLanguage = this.funding.fundingTitle?.translatedTitle?.languageCode
      this.fundingProjectLink = this.funding.url?.value
      this.description = this.funding.description?.value
      this.agencyName = this.funding.fundingName?.value
      this.currencyCode = this.funding.currencyCode?.value
      this.amount = this.funding.amount?.value
      this.loadingFunding = false
      this.disambiguatedFundingSourceId = this.funding.disambiguatedFundingSourceId?.value
      this.disambiguatedFundingSource = this.funding.disambiguationSource?.value
      this.showTranslationTitle = !!this.funding.fundingTitle?.translatedTitle
        ?.content

      if (this.funding.visibility?.visibility) {
        this.defaultVisibility = this.funding.visibility?.visibility
      }
    } else {
      this.loadingFunding = false
    }
  }

  formToBackendAffiliation(): Funding {
    return {
      visibility: {
        visibility: this.fundingForm.get('visibility').value
          ? this.fundingForm.get('visibility').value
          : this.defaultVisibility,
      },
      putCode: {
        value: this.options?.createACopy ? null : this.funding?.putCode?.value,
      },
      fundingTitle: {
        title: this.fundingForm.value.fundingProjectTitle,
        errors: [],
        translatedTitle: {
          content: this.fundingForm.value.translatedTitleContent,
          languageCode: this.fundingForm.value.translatedTitleLanguage,
          errors: [],
        },
      },
      description: {
        value: this.fundingForm.value.description,
      },
      organizationDefinedFundingSubType: {
        subtype: this.fundingForm.value.fundingSubtype,
        alreadyIndexed: false, // what value should be here ?
      },
      fundingName: {
        value: this.fundingForm.value.agencyName,
      },
      fundingType: {
        value: this.fundingForm.value.fundingType,
      },
      currencyCode: {
        value: this.fundingForm.value.currencyCode,
      },
      amount: {
        value: this.fundingForm.value.amount,
      },
      url: {
        value: this.fundingForm.value.fundingProjectLink,
      },
      startDate: {
        month: this.addTrailingZero(
          this.fundingForm.get('startDateGroup.startDateMonth').value
        ),
        year: this.fundingForm.get('startDateGroup.startDateYear').value,
      },
      endDate: {
        month: this.addTrailingZero(
          this.fundingForm.get('endDateGroup.endDateMonth').value
        ),
        year: this.fundingForm.get('endDateGroup.endDateYear').value,
      },
      externalIdentifiers: this.fundingForm.value.grants.map((grant) => {
        return {
          externalIdentifierId: grant.grantNumber,
          externalIdentifierType: FundingExternalIndentifierType.grant_number, // is it allways grant_number?
          url: grant.grantUrl,
          relationship: grant.fundingRelationship,
        }
      }),
      contributors: this.funding?.contributors,
      disambiguatedFundingSourceId: {
        value: this.disambiguatedFundingSourceId,
      },
      disambiguationSource: {
        value: this.disambiguatedFundingSource,
      },
      city: {
        value: this.fundingForm.value.city,
      },
      region: {
        value: this.fundingForm.value.region,
      },
      country: {
        value: this.countryCodes.find(
          (x) => x.key === this.fundingForm.get('country').value
        ).value,
      },
      source: this.options?.createACopy ? null : this.funding?.source,
      sourceName: this.funding?.sourceName,
      dateSortString: this.funding?.dateSortString,
      assertionOriginClientId: this.funding?.assertionOriginClientId,
      assertionOriginName: this.funding?.assertionOriginName,
      assertionOriginOrcid: this.funding?.assertionOriginOrcid,
      countryForDisplay: this.funding?.countryForDisplay,
    }
  }

  onSubmit() {}

  addAnotherGrant(existingGrant?: ExternalIdentifier) {
    if (existingGrant) {
      this.grantsArrayDisplayState.push(false)
    } else {
      this.grantsArrayDisplayState.push(true)
    }

    this.grantsArray.push(
      this._formBuilder.group({
        grantNumber: [existingGrant?.externalIdentifierId?.value || '', []],
        grantUrl: [
          existingGrant?.url?.value || '',
          [Validators.pattern(URL_REGEXP)],
        ],
        fundingRelationship: [FundingRelationships.self, []],
      })
    )

    this.checkGrantsChanges(this.grantsArray.controls.length - 1)
  }

  deleteGrant(id: number) {
    this.grantsArray.removeAt(id)
  }

  saveEvent() {
    this.fundingForm.markAllAsTouched()
    if (this.fundingForm.valid) {
      this._fundingsService
        .save(this.formToBackendAffiliation())
        .pipe(first())
        .subscribe(() => {
          this.closeEvent()
        })
    } else {
      this._snackBar.showValidationError()
    }
  }

  fillForm(organization: Organization) {
    this.fundingForm.patchValue({
      city: organization.city,
      region: organization.region,
      country: this.countryCodes.find((x) => x.value === organization.country)
        .key,
    })
    this.disambiguatedFundingSourceId = organization.sourceId
    this.disambiguatedFundingSource = organization.sourceType
  }

  clearForm() {
    this.fundingForm.patchValue({
      agencyName: '',
      city: '',
      region: '',
      country: '',
    })
    this.disambiguatedFundingSourceId = ''
    this.disambiguatedFundingSource = ''
  }

  private _filter(value: string): Observable<Organization[]> {
    if (value) {
      return this._fundingsService.getOrganization(value).pipe(first())
    }

    return EMPTY
  }

  private checkGrantsChanges(index: number) {
    const formGroup = this.grantsArray.controls[index] as FormGroup
    formGroup.controls.grantNumber.valueChanges.subscribe((value) => {
      if (value) {
        formGroup.controls.grantNumber.setValidators([])
        formGroup.controls.grantNumber.updateValueAndValidity({
          emitEvent: false,
        })
      } else {
        formGroup.controls.grantNumber.clearValidators()
        formGroup.controls.grantNumber.updateValueAndValidity({
          emitEvent: false,
        })
      }
    })

    formGroup.controls.grantUrl.valueChanges.subscribe((value) => {
      if (value) {
        formGroup.controls.grantUrl.setValidators([
          Validators.pattern(URL_REGEXP),
        ])
        formGroup.controls.grantUrl.updateValueAndValidity({
          emitEvent: false,
        })
      } else {
        formGroup.controls.grantUrl.clearValidators()
        formGroup.controls.grantUrl.updateValueAndValidity({
          emitEvent: false,
        })
      }
    })

    formGroup.controls.fundingRelationship.valueChanges.subscribe((value) => {
      if (value) {
        formGroup.controls.fundingRelationship.updateValueAndValidity({
          emitEvent: false,
        })
      } else {
        formGroup.controls.fundingRelationship.clearValidators()
        formGroup.controls.fundingRelationship.updateValueAndValidity({
          emitEvent: false,
        })
      }
    })
  }

  closeEvent() {
    this.dialogRef.close()
  }

  toFundingDetails() {
    this.window.document.getElementById('funding-details').scrollIntoView()
  }

  toFundingAgency() {
    this.window.document.getElementById('funding-agency').scrollIntoView()
  }

  toVisibility() {
    this.window.document.getElementById('visibility').scrollIntoView()
  }

  toFundingIdentifiers() {
    this.window.document.getElementById('funding-identifiers').scrollIntoView()
  }

  cancelExternalIdEdit(id: number) {
    if (
      this.grantsArray.controls[id] &&
      !this.grantsArray.controls[id].value.grantUrl &&
      !this.grantsArray.controls[id].value.grantNumber
    ) {
      this.deleteGrant(id)
    } else {
      this.grantsArrayDisplayState[id] = false
    }
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }

  private addTrailingZero(date: string): string {
    if (date && Number(date) < 10) {
      return '0' + date
    }
    return date
  }
}
