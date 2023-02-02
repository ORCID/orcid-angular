import { Component, Inject, OnDestroy, OnInit, Input } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  UntypedFormArray,
} from '@angular/forms'
import {
  dateMonthYearValidator,
  endDateMonthYearValidator,
} from '../../../../../shared/validators/date/date.validator'
import { translatedTitleValidator } from '../../../../../shared/validators/translated-title/translated-title.validator'

import {
  MAX_LENGTH_LESS_THAN_FIVE_THOUSAND,
  MAX_LENGTH_LESS_THAN_ONE_THOUSAND,
  MAX_LENGTH_LESS_THAN_TWO_HUNDRED_FIFTY_FIVE,
  MAX_LENGTH_LESS_THAN_TWO_THOUSAND,
  MAX_LENGTH_LESS_THAN_TWO_THOUSAND_EIGHTY_FOUR,
  URL_REGEXP,
} from '../../../../../constants'
import { UserRecord } from '../../../../../types/record.local'
import { RecordCountriesService } from '../../../../../core/record-countries/record-countries.service'
import { EMPTY, of, Subject } from 'rxjs'
import {
  PlatformInfo,
  PlatformInfoService,
} from '../../../../../cdk/platform-info'
import {
  VisibilityStrings,
  Organization,
  ExternalIdentifier,
} from '../../../../../types/common.endpoint'
import { Observable } from 'rxjs/internal/Observable'
import { first, switchMap, tap } from 'rxjs/operators'
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
import { validateFundingAmount } from 'src/app/shared/validators/funding-amount/funding-amount.validator'

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
  fundingForm: UntypedFormGroup
  showTranslationTitle = false
  languageMap = LanguageMap
  currencyCodeMap = CurrencyCodeMap
  userRecord: UserRecord
  isMobile: boolean
  filteredOptions: Observable<Organization[]>
  loadingFunding = true
  countryCodes: { key: string; value: string }[]
  loadingCountryCodes = true
  fundingType = ''
  fundingSubtype = ''
  fundingProjectTitle = ''
  fundingProjectLink = ''
  description = ''
  defaultVisibility: VisibilityStrings
  agencyName: string | Organization = ''
  city = ''
  region = ''
  country = ''
  countryForDisplay = ''
  amount = ''
  currencyCode = ''
  grantsArray: UntypedFormArray
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
  selectedOrganizationFromDatabase: Organization
  displayOrganizationHint: boolean

  years = Array(110)
    .fill(0)
    .map((i, idx) => idx + new Date().getFullYear() - 108)
    .reverse()
  yearsEndDate = Array(120)
    .fill(0)
    .map((i, idx) => idx + new Date().getFullYear() - 108)
    .reverse()
  months = Array(12)
    .fill(0)
    .map((i, idx) => idx + 1)

  totalFundingAmountCurrency = $localize`:@@share.totalFundingAmountCurrency:Currency`
  totalFundingAmount = $localize`:@@share.totalFundingAmount:Total funding amount`
  ariaLabelStartDate = $localize`:@@shared.startDate:Start date`
  ariaLabelEndDate = $localize`:@@shared.startDate:End date`
  ariaLabelSaveChanges = $localize`:@@shared.saveFundingChanges:Save funding changes`
  ariaLabelCancelChanges = $localize`:@@shared.cancelFundingChanges:Cancel changes and close Funding`

  ngOrcidYear = $localize`:@@shared.year:Year`
  ngOrcidMonth = $localize`:@@shared.month:Month`
  ngOrcidFundingType = $localize`:@@funding.selectAType:Select a funding type`
  ngOrcidSelectLanguage = $localize`:@@shared.selectLanguage:Select a language`
  ngOrcidSelectACountryOrLocation = $localize`:@@shared.selectACountryOrLocation:Select a country or location`
  ngOrcidDefaultVisibilityLabel = $localize`:@@shared.visibilityDescription:Control who can see this information by setting the visibility. Your default visibility is`

  constructor(
    @Inject(WINDOW) private window: Window,
    private _platform: PlatformInfoService,
    public dialogRef: MatDialogRef<ModalComponent>,

    @Inject(MAT_DIALOG_DATA) public data: UserRecord,
    private _userService: UserService,
    private _recordCountryService: RecordCountriesService,
    private _fundingsService: RecordFundingsService,
    private _formBuilder: UntypedFormBuilder,
    private _snackBar: SnackbarService,
    private _record: RecordService
  ) {
    this._platform.get().subscribe((platform) => {
      this.platform = platform
      this.isMobile = platform.columns4 || platform.columns8
    })
  }

  ngOnInit(): void {
    this.initialValues()
    this.fundingForm = this._formBuilder.group(
      {
        fundingType: new UntypedFormControl(this.fundingType, {
          validators: [Validators.required],
        }),
        fundingSubtype: new UntypedFormControl(this.fundingSubtype, {
          validators: [
            Validators.maxLength(MAX_LENGTH_LESS_THAN_TWO_HUNDRED_FIFTY_FIVE),
          ],
        }),
        fundingProjectTitle: new UntypedFormControl(this.fundingProjectTitle, {
          validators: [
            Validators.required,
            Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND),
          ],
        }),
        translatedTitleGroup: this._formBuilder.group(
          {
            translatedTitleContent: new UntypedFormControl('', {
              validators: [
                Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND),
              ],
            }),
            translatedTitleLanguage: [''],
          },
          {
            validators: [
              translatedTitleValidator,
              Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND),
            ],
          }
        ),
        fundingProjectLink: new UntypedFormControl(this.fundingProjectLink, {
          validators: [
            Validators.pattern(URL_REGEXP),
            Validators.maxLength(MAX_LENGTH_LESS_THAN_TWO_THOUSAND),
          ],
        }),
        description: new UntypedFormControl(this.description, {
          validators: [
            Validators.maxLength(MAX_LENGTH_LESS_THAN_FIVE_THOUSAND),
          ],
        }),
        amount: new UntypedFormControl(this.amount, {
          validators: validateFundingAmount(),
        }),
        currencyCode: new UntypedFormControl(this.currencyCode, {}),
        startDateGroup: this._formBuilder.group(
          {
            startDateMonth: [''],
            startDateYear: [''],
          },
          { validator: [dateMonthYearValidator('startDate')] }
        ),
        endDateGroup: this._formBuilder.group(
          {
            endDateMonth: [''],
            endDateYear: [''],
          },
          { validator: dateMonthYearValidator('endDate') }
        ),
        agencyName: new UntypedFormControl(this.agencyName, {
          validators: [
            Validators.required,
            Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND),
          ],
        }),
        city: new UntypedFormControl(this.city, {
          validators: [
            Validators.required,
            Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND),
          ],
        }),
        region: new UntypedFormControl(this.region, {
          validators: [Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND)],
        }),
        country: new UntypedFormControl(this.country, {
          validators: [
            Validators.required,
            Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND),
          ],
        }),
        grants: new UntypedFormArray([]),
        visibility: new UntypedFormControl(this.defaultVisibility, {
          validators: [Validators.required],
        }),
      },
      {
        validator: endDateMonthYearValidator(),
      }
    )
    this.grantsArray = this.fundingForm.controls.grants as UntypedFormArray

    if (this.funding) {
      this.initFormValues()
    }
    this._record
      .getPreferences()
      .pipe(first())
      .subscribe((userPreferences) => {
        this.defaultVisibility = userPreferences.default_visibility
        this.fundingForm.patchValue({
          visibility: this.funding?.visibility?.visibility
            ? this.funding?.visibility?.visibility
            : this.defaultVisibility,
        })
      })
    this.listenFormChanges()
    this.getCountryCodes()
  }

  private getCountryCodes() {
    this._recordCountryService
      .getCountryCodes()
      .pipe(first())
      .subscribe((codes) => {
        this.countryCodes = codes
        this.loadingCountryCodes = false
        if (this.funding) {
          this.fundingForm.patchValue({
            country: this.countryCodes.find(
              (x) => x.value === this.funding.country.value
            ).key,
          })
        }
      })
  }

  autoCompleteDisplayOrganization(organization: Organization) {
    return organization.value
  }

  private listenFormChanges() {
    this.filteredOptions = this.fundingForm.get('agencyName').valueChanges.pipe(
      tap((organization: string | Organization) => {
        // Auto fill form when the user select an organization from the autocomplete list
        if (
          typeof organization === 'object' &&
          organization.disambiguatedAffiliationIdentifier
        ) {
          this.selectedOrganizationFromDatabase = organization
          this.displayOrganizationHint = true
          this.fillForm(organization)
        }
        if (!organization) {
          this.selectedOrganizationFromDatabase = undefined
          this.displayOrganizationHint = false
          this.fundingForm.patchValue({
            city: '',
            region: '',
            country: '',
          })
        }
      }),
      switchMap((organization: string | Organization) => {
        if (
          typeof organization === 'string' &&
          !this.selectedOrganizationFromDatabase
        ) {
          // Display matching organization based on the user string input
          return this._filter((organization as string) || '').pipe(
            tap((x) => {
              this.displayOrganizationHint = true
            })
          )
        } else {
          // Do not display options once the user has selected an Organization
          return of([])
        }
      })
    )

    this.fundingForm.get('amount').valueChanges.subscribe((value) => {
      if (value) {
        this.fundingForm.get('currencyCode').setValidators(Validators.required)
        this.fundingForm
          .get('currencyCode')
          .updateValueAndValidity({ emitEvent: true })
        this.fundingForm
          .get('amount')
          .updateValueAndValidity({ emitEvent: true })
      }
    })
  }

  private initFormValues() {
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
    if (this.funding.fundingTitle?.translatedTitle) {
      this.fundingForm.patchValue({
        translatedTitleGroup: {
          translatedTitleContent:
            this.funding.fundingTitle?.translatedTitle.content,
          translatedTitleLanguage:
            this.funding.fundingTitle?.translatedTitle.languageCode,
        },
      })
    }

    this.funding.externalIdentifiers.forEach((grant) => {
      this.addAnotherGrant(grant)
    })
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
      this.fundingSubtype =
        this.funding.organizationDefinedFundingSubType?.subtype?.value
      this.fundingProjectTitle = this.funding.fundingTitle?.title.value
      this.translatedTitleContent =
        this.funding.fundingTitle?.translatedTitle?.content
      this.translatedTitleLanguage =
        this.funding.fundingTitle?.translatedTitle?.languageCode
      this.fundingProjectLink = this.funding.url?.value
      this.description = this.funding.description?.value
      this.currencyCode = this.funding.currencyCode?.value
      this.amount = this.funding.amount?.value
      this.disambiguatedFundingSourceId =
        this.funding.disambiguatedFundingSourceId?.value
      this.disambiguatedFundingSource = this.funding.disambiguationSource?.value
      this.showTranslationTitle =
        !!this.funding.fundingTitle?.translatedTitle?.content
      this.agencyName = {
        value: this.funding.fundingName.value,
      } as Organization
      if (this.disambiguatedFundingSourceId) {
        this.selectedOrganizationFromDatabase = {
          value: this.agencyName.value,
        } as Organization
      }
      this.displayOrganizationHint = true
    } else {
      this.loadingFunding = false
    }
  }

  formToBackendFunding(): Funding {
    const funding = {
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
          content: this.fundingForm.get(
            'translatedTitleGroup.translatedTitleContent'
          ).value,
          languageCode: this.fundingForm.get(
            'translatedTitleGroup.translatedTitleLanguage'
          ).value,
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
        day: '',
        month: this.fundingForm.get('startDateGroup.startDateMonth').value
          ? this.addTrailingZero(
              this.fundingForm.get('startDateGroup.startDateMonth').value
            )
          : '',
        year: this.fundingForm.get('startDateGroup.startDateYear').value
          ? this.fundingForm.get('startDateGroup.startDateYear').value
          : '',
      },
      endDate: {
        day: '',
        month: this.fundingForm.get('endDateGroup.endDateMonth').value
          ? this.addTrailingZero(
              this.fundingForm.get('endDateGroup.endDateMonth').value
            )
          : '',
        year: this.fundingForm.get('endDateGroup.endDateYear').value
          ? this.fundingForm.get('endDateGroup.endDateYear').value
          : '',
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
    } as Funding

    if (this.selectedOrganizationFromDatabase) {
      funding.fundingName = {
        value: this.selectedOrganizationFromDatabase.value,
      }
      funding.disambiguatedFundingSourceId = {
        value:
          this.disambiguatedFundingSourceId ||
          this.selectedOrganizationFromDatabase.sourceId,
      }
      funding.disambiguationSource = {
        value:
          this.disambiguatedFundingSource ||
          this.selectedOrganizationFromDatabase.sourceType,
      }
    } else {
      funding.fundingName = {
        value: this.fundingForm.get('agencyName').value?.value
          ? this.fundingForm.get('agencyName').value?.value
          : this.fundingForm.get('agencyName').value,
      }
    }
    return funding
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
        grantNumber: [
          existingGrant?.externalIdentifierId?.value || '',
          [Validators.maxLength(MAX_LENGTH_LESS_THAN_TWO_THOUSAND_EIGHTY_FOUR)],
        ],
        grantUrl: [
          existingGrant?.url?.value || '',
          [
            Validators.pattern(URL_REGEXP),
            Validators.maxLength(MAX_LENGTH_LESS_THAN_TWO_THOUSAND),
          ],
        ],
        fundingRelationship: [
          existingGrant?.relationship?.value || FundingRelationships.self,
          [],
        ],
      })
    )

    this.checkGrantsChanges(this.grantsArray.controls.length - 1)
  }

  deleteGrant(id: number) {
    this.grantsArray.removeAt(id)
    this.grantsArrayDisplayState.splice(id, 1)
  }

  saveEvent() {
    this.fundingForm.markAllAsTouched()
    if (this.fundingForm.valid) {
      this.loadingFunding = true
      this._fundingsService
        .save(this.formToBackendFunding())
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
    const formGroup = this.grantsArray.controls[index] as UntypedFormGroup
    formGroup.controls.grantNumber.valueChanges.subscribe((value) => {
      if (value) {
        formGroup.controls.grantNumber.addValidators(
          Validators.maxLength(MAX_LENGTH_LESS_THAN_TWO_THOUSAND_EIGHTY_FOUR)
        )
        formGroup.controls.grantNumber.updateValueAndValidity({
          emitEvent: false,
        })
      } else {
        formGroup.controls.grantNumber.removeValidators(
          Validators.maxLength(MAX_LENGTH_LESS_THAN_TWO_THOUSAND_EIGHTY_FOUR)
        )
        formGroup.controls.grantNumber.updateValueAndValidity({
          emitEvent: false,
        })
      }
    })

    formGroup.controls.grantUrl.valueChanges.subscribe((value) => {
      if (value) {
        formGroup.controls.grantNumber.addValidators(Validators.required)
        formGroup.controls.grantNumber.updateValueAndValidity({
          emitEvent: false,
        })
        formGroup.controls.grantUrl.setValidators([
          Validators.pattern(URL_REGEXP),
          Validators.maxLength(MAX_LENGTH_LESS_THAN_TWO_THOUSAND),
        ])
        formGroup.controls.grantUrl.updateValueAndValidity({
          emitEvent: false,
        })
      } else {
        formGroup.controls.grantNumber.removeValidators(Validators.required)
        formGroup.controls.grantNumber.updateValueAndValidity()
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
