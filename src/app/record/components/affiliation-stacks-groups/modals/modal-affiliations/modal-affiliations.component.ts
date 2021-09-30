import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core'
import { EMPTY, of, Subject } from 'rxjs'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

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
import { RecordCountryCodesEndpoint } from '../../../../../types'
import { URL_REGEXP } from '../../../../../constants'
import { dateValidator, endDateValidator } from '../../../../../shared/validators/date/date.validator'
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

  @Input() type: AffiliationType
  @Input() affiliation: Affiliation
  @Input() options: { createACopy: boolean }

  platform: PlatformInfo
  affiliationForm: FormGroup
  countryCodes: { key: string; value: string }[]
  originalCountryCodes: RecordCountryCodesEndpoint
  loadingCountryCodes = true
  loadingAffiliations = true
  isMobile: boolean
  startDateValid: boolean
  endDateValid: boolean
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
    .map((i, idx) => idx + new Date().getFullYear() - 109)
    .reverse()
  yearsEndDate = Array(120)
    .fill(0)
    .map((i, idx) => idx + new Date().getFullYear() - 109)
    .reverse()
  months = Array(12)
    .fill(0)
    .map((i, idx) => idx + 1)
  days = Array(31)
    .fill(0)
    .map((i, idx) => idx + 1)

  ngOrcidYear = $localize`:@@shared.year:Year`
  ngOrcidMonth = $localize`:@@shared.month:Month`
  ngOrcidDay = $localize`:@@shared.day:Day`
  selectedOrganizationFromDatabase: Organization
  requireOrganizationDisambiguatedDataOnRefresh = false
  displayOrganizationHint: boolean

  constructor(
    @Inject(WINDOW) private window: Window,
    private _platform: PlatformInfoService,
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordCountryService: RecordCountriesService,
    private _recordAffiliationService: RecordAffiliationService,
    private _formBuilder: FormBuilder,
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
    this.affiliationForm = this._formBuilder.group({
      organization: new FormControl(this.organization, {
        validators: [Validators.required],
      }),
      city: new FormControl(this.city, {
        validators: [Validators.required],
      }),
      region: new FormControl(this.region, {}),
      country: new FormControl('', {
        validators: [Validators.required],
      }),
      department: new FormControl(this.department, {}),
      title: new FormControl(this.title, {}),
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
      link: new FormControl(this.link, {
        validators: [Validators.pattern(URL_REGEXP)],
      }),
      visibility: new FormControl(this.defaultVisibility, {
        validators: [Validators.required],
      }),
    }, {
      validator: endDateValidator()
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
            endDateYear: Number(this.affiliation.endDate.year),
            endDateMonth: Number(this.affiliation.endDate.month),
            endDateDay: Number(this.affiliation.endDate.day),
          },
        })
      }

      if (this.affiliation.startDate.year) {
        this.affiliationForm.patchValue({
          startDateGroup: {
            startDateYear: Number(this.affiliation.startDate.year),
            startDateMonth: Number(this.affiliation.startDate.month),
            startDateDay: Number(this.affiliation.startDate.day),
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
      this._record
        .getPreferences()
        .pipe(first())
        .subscribe((userPreferences) => {
          this.defaultVisibility = userPreferences.default_visibility
          this.affiliationForm.patchValue({
            visibility: this.defaultVisibility,
          })
          this.loadingAffiliations = false
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
    affiliationForm: FormGroup
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
      affiliationExternalIdentifiers: this.affiliation
        ?.affiliationExternalIdentifiers,
      affiliationTypeForDisplay: this.affiliation?.affiliationTypeForDisplay,
      assertionOriginClientId: this.affiliation?.assertionOriginClientId,
      assertionOriginName: this.affiliation?.assertionOriginName,
      assertionOriginOrcid: this.affiliation?.assertionOriginOrcid,
      disambiguationSource: this.affiliation?.disambiguationSource,
      disambiguatedAffiliationSourceId: this.affiliation
        ?.disambiguatedAffiliationSourceId,
      orgDisambiguatedId: this.affiliation?.orgDisambiguatedId,
      orgDisambiguatedCity: this.affiliation?.orgDisambiguatedCity,
      orgDisambiguatedCountry: this.affiliation?.orgDisambiguatedCountry,
      orgDisambiguatedExternalIdentifiers: this.affiliation
        ?.orgDisambiguatedExternalIdentifiers,
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
        value: affiliationForm.get('organization').value,
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
        .subscribe(() => {
          this.closeEvent()
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
