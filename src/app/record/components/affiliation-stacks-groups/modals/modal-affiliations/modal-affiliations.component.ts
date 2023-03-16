import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core'
import { EMPTY, of, Subject } from 'rxjs'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'

import {
  PlatformInfo,
  PlatformInfoService,
} from '../../../../../cdk/platform-info'
import { WINDOW } from '../../../../../cdk/window'
import {
  Affiliation,
  AffiliationType,
  Organization,
} from '../../../../../types/record-affiliation.endpoint'
import { RecordAffiliationService } from '../../../../../core/record-affiliations/record-affiliations.service'
import { VisibilityStrings } from '../../../../../types/common.endpoint'
import { RecordCountriesService } from '../../../../../core/record-countries/record-countries.service'
import { first, map, switchMap, tap } from 'rxjs/operators'
import {
  MAX_LENGTH_LESS_THAN_ONE_THOUSAND,
  MAX_LENGTH_LESS_THAN_TWO_THOUSAND,
  URL_REGEXP,
} from '../../../../../constants'
import {
  dateValidator,
  endDateValidator,
} from '../../../../../shared/validators/date/date.validator'
import { Observable } from 'rxjs/internal/Observable'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { RecordService } from 'src/app/core/record/record.service'

@Component({
  selector: 'app-modal-affiliations',
  templateUrl: './modal-affiliations.component.html',
  styleUrls: [
    './modal-affiliations.component.scss',
    './modal-affiliations.component.scss-theme.scss',
  ],
})
export class ModalAffiliationsComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()
  closeLabel = $localize`:@@shared.ariaLabelClose:Close`
  saveLabel = $localize`:@@shared.saveChangesTo:Save changes to`
  ngOrcidYear = $localize`:@@shared.year:Year`
  ngOrcidMonth = $localize`:@@shared.month:Month`
  ngOrcidDay = $localize`:@@shared.day:Day`

  cancelChanges = $localize`:@@shared.cancelChangesAndClose:Cancel changes and close`
  linkLabel = $localize`:@@shared.link:Link`
  endDateLabel = $localize`:@@shared.endDate:End date`
  private _type: AffiliationType
  dateLabel: string
  @Input()
  public get type(): AffiliationType {
    return this._type
  }
  public set type(value: AffiliationType) {
    this._type = value
    if (value !== 'distinction') {
      this.dateLabel = $localize`:@@shared.startDate:Start date`
    } else {
      this.dateLabel = $localize`:@@shared.distinctionDate:Date of distinction`
    }
  }

  @Input() affiliation: Affiliation
  @Input() options: { createACopy: boolean }

  platform: PlatformInfo
  affiliationForm: UntypedFormGroup
  countryCodes: { key: string; value: string }[]
  loadingCountryCodes = true
  loadingAffiliations = true
  isMobile: boolean
  defaultVisibility: VisibilityStrings
  filteredOptions: Observable<Organization[]>

  organization: string | Organization = ''
  city = ''
  region = ''
  country = ''
  department = ''
  title = ''
  link = ''

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
  days = Array(31)
    .fill(0)
    .map((i, idx) => idx + 1)

  ngOrcidSelectACountryOrLocation = $localize`:@@shared.selectACountryOrLocation:Select a country or location`
  ngOrcidDefaultVisibilityLabel = $localize`:@@shared.visibilityDescription:Control who can see this information by setting the visibility. Your default visibility is`

  selectedOrganizationFromDatabase: Organization
  requireOrganizationDisambiguatedDataOnRefresh = false
  displayOrganizationHint: boolean

  get organizationIsInvalidAndTouched() {
    return (
      this.affiliationForm.hasError('required', 'organization') &&
      (this.affiliationForm.get('organization').dirty ||
        this.affiliationForm.get('organization').touched)
    )
  }

  get cityIsInvalidAndTouched() {
    return (
      this.affiliationForm.hasError('required', 'city') &&
      (this.affiliationForm.get('city').dirty ||
        this.affiliationForm.get('city').touched)
    )
  }

  get countryIsInvalidAndTouched() {
    return (
      this.affiliationForm.hasError('required', 'country') &&
      (this.affiliationForm.get('country').dirty ||
        this.affiliationForm.get('country').touched)
    )
  }

  constructor(
    @Inject(WINDOW) private window: Window,
    private _platform: PlatformInfoService,
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordCountryService: RecordCountriesService,
    private _recordAffiliationService: RecordAffiliationService,
    private _formBuilder: UntypedFormBuilder,
    private _snackbar: SnackbarService,
    private _record: RecordService
  ) {
    this._platform.get().subscribe((platform) => {
      this.platform = platform
      this.isMobile = platform.columns4 || platform.columns8
    })
  }

  ngOnInit(): void {
    this.initialValues()

    this.affiliationForm = this._formBuilder.group(
      {
        organization: new UntypedFormControl(this.organization, {
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
        country: new UntypedFormControl('', {
          validators: [Validators.required],
        }),
        department: new UntypedFormControl(this.department, {
          validators: [Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND)],
        }),
        title: new UntypedFormControl(this.title, {
          validators: [Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND)],
        }),
        startDateGroup: this._formBuilder.group(
          {
            startDateDay: ['', []],
            startDateMonth: ['', []],
            startDateYear: ['', []],
          },
          { validator: dateValidator('startDate') }
        ),
        endDateGroup: this._formBuilder.group(
          {
            endDateDay: [''],
            endDateMonth: [''],
            endDateYear: [''],
          },
          { validator: dateValidator('endDate') }
        ),
        link: new UntypedFormControl(this.link, {
          validators: [
            Validators.pattern(URL_REGEXP),
            Validators.maxLength(MAX_LENGTH_LESS_THAN_TWO_THOUSAND),
          ],
        }),
        visibility: new UntypedFormControl(this.defaultVisibility, {
          validators: [Validators.required],
        }),
      },
      {
        validator: endDateValidator(),
      }
    )

    this._record
      .getPreferences()
      .pipe(first())
      .subscribe((userPreferences) => {
        this.defaultVisibility = userPreferences.default_visibility
        this.loadingAffiliations = false
        this.affiliationForm.patchValue({
          visibility: this.affiliation?.visibility?.visibility
            ? this.affiliation.visibility.visibility
            : this.defaultVisibility,
        })
      })

    this.filteredOptions = this.affiliationForm
      .get('organization')
      .valueChanges.pipe(
        tap((organization: string | Organization) => {
          // Auto fill form when the user select an organization from the autocomplete list
          if (
            typeof organization === 'object' &&
            organization.disambiguatedAffiliationIdentifier
          ) {
            this.selectedOrganizationFromDatabase = organization
            this.requireOrganizationDisambiguatedDataOnRefresh = true
            this.displayOrganizationHint = true
            this.fillForm(organization)
          }
          if (!organization) {
            this.selectedOrganizationFromDatabase = undefined
            this.requireOrganizationDisambiguatedDataOnRefresh = true
            this.displayOrganizationHint = false
            this.affiliationForm.patchValue({
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

    if (this.affiliation) {
      if (this.affiliation.endDate.year) {
        this.affiliationForm.patchValue({
          endDateGroup: {
            endDateYear: this.affiliation.endDate.year
              ? Number(this.affiliation.endDate.year)
              : '',
            endDateMonth: this.affiliation.endDate.month
              ? Number(this.affiliation.endDate.month)
              : '',
            endDateDay: this.affiliation.endDate.day
              ? Number(this.affiliation.endDate.day)
              : '',
          },
        })
      }

      if (this.affiliation.startDate.year) {
        this.affiliationForm.patchValue({
          startDateGroup: {
            startDateYear: this.affiliation.startDate.year
              ? Number(this.affiliation.startDate.year)
              : '',
            startDateMonth: this.affiliation.startDate.month
              ? Number(this.affiliation.startDate.month)
              : '',
            startDateDay: this.affiliation.startDate.day
              ? Number(this.affiliation.startDate.day)
              : '',
          },
        })
      }

      if (this.affiliation.visibility?.visibility) {
        this.affiliationForm.patchValue({
          visibility: this.affiliation.visibility.visibility,
        })
      }
    }

    this._recordCountryService
      .getCountryCodes()
      .pipe(first())
      .subscribe((codes) => {
        this.countryCodes = codes
        this.loadingCountryCodes = false
        if (this.affiliation) {
          this.affiliationForm.patchValue({
            country: this.countryCodes.find(
              (x) => x.value === this.affiliation.country.value
            ).key,
          })
        }
      })

    if (!this.affiliation?.putCode) {
      // Update the visibility with the default value
      this.affiliationForm.patchValue({
        visibility: this.defaultVisibility,
      })
    } else {
      this.loadingAffiliations = false
    }
  }

  initialValues() {
    if (this.affiliation) {
      this.displayOrganizationHint = true
      if (this.affiliation.orgDisambiguatedName) {
        this.selectedOrganizationFromDatabase = {
          value: this.affiliation.orgDisambiguatedName,
        } as Organization
      }
      this.organization = {
        value: this.affiliation.affiliationName.value,
      } as Organization
      this.city = this.affiliation.city.value
      this.region = this.affiliation.region.value
      this.country = this.affiliation.country.value
      this.department = this.affiliation.departmentName.value
      this.title = this.affiliation.roleTitle.value
      this.link = this.affiliation.url.value
    }
  }

  autoCompleteDisplayOrganization(organization: Organization) {
    return organization.value
  }

  formToBackendAffiliation(
    affiliationForm: UntypedFormGroup
  ): Observable<Affiliation> {
    const affiliationToSave = {
      visibility: {
        visibility: affiliationForm.get('visibility').value
          ? affiliationForm.get('visibility').value
          : this.defaultVisibility,
      },
      putCode: {
        value: this.options?.createACopy
          ? null
          : this.affiliation?.putCode?.value,
      },
      city: {
        value: affiliationForm.get('city').value,
      },
      region: {
        value: affiliationForm.get('region').value,
      },
      country: {
        value: this.countryCodes.find(
          (x) => x.key === affiliationForm.get('country').value
        ).value,
      },
      roleTitle: {
        value: affiliationForm.get('title').value,
      },
      departmentName: {
        value: affiliationForm.get('department').value
          ? affiliationForm.get('department').value
          : '',
      },
      affiliationType: {
        value: this.type,
      },
      startDate: {
        day: affiliationForm.get('startDateGroup.startDateDay').value
          ? this.addTrailingZero(
              affiliationForm.get('startDateGroup.startDateDay').value
            )
          : '',
        month: affiliationForm.get('startDateGroup.startDateMonth').value
          ? this.addTrailingZero(
              affiliationForm.get('startDateGroup.startDateMonth').value
            )
          : '',
        year: affiliationForm.get('startDateGroup.startDateYear').value
          ? affiliationForm.get('startDateGroup.startDateYear').value
          : '',
      },
      endDate: {
        day: affiliationForm.get('endDateGroup.endDateDay').value
          ? this.addTrailingZero(
              affiliationForm.get('endDateGroup.endDateDay').value
            )
          : '',
        month: affiliationForm.get('endDateGroup.endDateMonth')
          ? this.addTrailingZero(
              affiliationForm.get('endDateGroup.endDateMonth').value
            )
          : '',
        year: affiliationForm.get('endDateGroup.endDateYear').value
          ? affiliationForm.get('endDateGroup.endDateYear').value
          : '',
      },
      url: {
        value: affiliationForm.get('link').value,
      },
      source: this.options?.createACopy ? null : this.affiliation?.source,
      sourceName: this.affiliation?.sourceName,
      dateSortString: this.affiliation?.dateSortString,
      affiliationExternalIdentifiers:
        this.affiliation?.affiliationExternalIdentifiers,
      affiliationTypeForDisplay: this.affiliation?.affiliationTypeForDisplay,
      assertionOriginClientId: this.affiliation?.assertionOriginClientId,
      assertionOriginName: this.affiliation?.assertionOriginName,
      assertionOriginOrcid: this.affiliation?.assertionOriginOrcid,
      disambiguationSource: this.affiliation?.disambiguationSource,
      disambiguatedAffiliationSourceId:
        this.affiliation?.disambiguatedAffiliationSourceId,
      orgDisambiguatedId: this.affiliation?.orgDisambiguatedId,
      orgDisambiguatedCity: this.affiliation?.orgDisambiguatedCity,
      orgDisambiguatedCountry: this.affiliation?.orgDisambiguatedCountry,
      orgDisambiguatedExternalIdentifiers:
        this.affiliation?.orgDisambiguatedExternalIdentifiers,
      orgDisambiguatedName: this.affiliation?.orgDisambiguatedName,
      orgDisambiguatedRegion: this.affiliation?.orgDisambiguatedRegion,
      orgDisambiguatedUrl: this.affiliation?.orgDisambiguatedUrl,
    } as Affiliation

    if (this.selectedOrganizationFromDatabase) {
      affiliationToSave.affiliationName = {
        value: this.selectedOrganizationFromDatabase.value,
      }
    } else {
      affiliationToSave.affiliationName = {
        value: affiliationForm.get('organization').value?.value
          ? affiliationForm.get('organization').value?.value
          : affiliationForm.get('organization').value,
      }
    }

    if (this.requireOrganizationDisambiguatedDataOnRefresh) {
      // When a organization was selected from the drop down get the disambiguated source to populate the affiliation
      if (
        this.selectedOrganizationFromDatabase
          ?.disambiguatedAffiliationIdentifier
      ) {
        return this._recordAffiliationService
          .getOrganizationDisambiguated(
            this.selectedOrganizationFromDatabase
              .disambiguatedAffiliationIdentifier
          )
          .pipe(
            map((disambiguated) => {
              affiliationToSave.disambiguatedAffiliationSourceId = {
                value: disambiguated.sourceId,
              }
              affiliationToSave.disambiguationSource = {
                value: disambiguated.sourceType,
              }
              affiliationToSave.orgDisambiguatedId = {
                value: this.selectedOrganizationFromDatabase.sourceType,
              }

              return affiliationToSave
            })
          )
      } else {
        // When a organization was NOT selected empty the organization fills
        affiliationToSave.disambiguatedAffiliationSourceId = undefined
        affiliationToSave.disambiguationSource = undefined
        affiliationToSave.orgDisambiguatedId = undefined
        return of(affiliationToSave)
      }
    } else {
      return of(affiliationToSave)
    }
  }

  fillForm(organization: Organization) {
    this.affiliationForm.patchValue({
      city: organization.city,
      region: organization.region,
      country: this.countryCodes.find((x) => x.value === organization.country)
        .key,
    })
  }

  clearForm() {
    this.affiliationForm.patchValue({
      organization: '',
    })
  }

  private _filter(value: string): Observable<Organization[]> {
    if (value) {
      return this._recordAffiliationService.getOrganization(value).pipe(first())
    }

    return EMPTY
  }

  private addTrailingZero(date: string): string {
    if (date && Number(date) < 10) {
      return '0' + date
    }
    return date
  }

  toOrganization() {
    this.window.document.getElementById('organization').scrollIntoView()
  }

  toAffiliationDetails() {
    this.window.document.getElementById('affiliation-details').scrollIntoView()
  }

  toVisibility() {
    this.window.document.getElementById('visibility').scrollIntoView()
  }

  saveEvent() {
    if (this.affiliationForm.valid) {
      this.loadingAffiliations = true
      this.formToBackendAffiliation(this.affiliationForm)
        .pipe(
          switchMap((affiliation) =>
            this._recordAffiliationService.postAffiliation(affiliation)
          ),
          first()
        )
        .subscribe((affiliation) => {
          if (affiliation?.errors?.length > 0) {
            this.loadingAffiliations = false
            this._snackbar.showValidationError(
              affiliation?.errors[0],
              $localize`:@@shared.pleaseReview:Please review and fix the issue`
            )
          } else {
            this.closeEvent()
          }
        })
    } else {
      this._snackbar.showValidationError()
    }
  }

  closeEvent() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
