import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import {
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { Subject, Observable, of, EMPTY } from 'rxjs'
import { switchMap, tap, first, takeUntil, map } from 'rxjs/operators'

import { WINDOW } from 'src/app/cdk/window'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { RecordCountriesService } from 'src/app/core/record-countries/record-countries.service'
import { RecordAffiliationService } from 'src/app/core/record-affiliations/record-affiliations.service'
import { RecordService } from 'src/app/core/record/record.service'
import { Organization, Value } from 'src/app/types/common.endpoint'
import {
  affiliationToOrganization,
  MAX_LENGTH_LESS_THAN_ONE_THOUSAND,
} from 'src/app/constants'
import { dateMonthYearValidator } from 'src/app/shared/validators/date/date.validator'
import { OrganizationsService } from 'src/app/core'
import { Register2Service } from 'src/app/core/register2/register2.service'
import { AssertionVisibilityString } from 'src/app/types'
import {
  Affiliation,
  AffiliationType,
} from 'src/app/types/record-affiliation.endpoint'

@Component({
  selector: 'app-share-emails-domains',
  templateUrl: './affiliations-interstitial.component.html',
  styleUrls: [
    './affiliations-interstitial.component.scss',
    './affiliations-interstitial.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
})
export class AffiliationsInterstitialComponent implements OnInit, OnDestroy {
  /** Main form group. */
  form: UntypedFormGroup

  /** Some state for UI. */
  organizationFromDatabase: Organization | undefined
  displayOrganizationHint = false
  rorIdHasBeenMatched = false

  /** For unsubscribing from streams. */
  private destroy$ = new Subject<void>()

  /** Observables */
  filteredOptions$: Observable<Organization[]>

  /** Basic label/placeholder strings. */
  ariaLabelClearOrganization = 'Clear organization'
  organizationPlaceholder = 'Type your organization name'
  departmentPlaceholder = 'School, college or department'
  rolePlaceholder = 'Your role or job in the organization'
  ariaLabelStartDate = 'Start date'
  ngOrcidYear = 'Year'
  ngOrcidMonth = 'Month'
  ariaLabelOrganization = 'Organization'
  ariaLabelPrefilledOrganization = 'Organization (prefilled from email)'

  /** Range of possible years. */
  years = Array(110)
    .fill(0)
    .map((_, i) => i + (new Date().getFullYear() - 108))
    .reverse()

  months = Array(12)
    .fill(0)
    .map((_, i) => i + 1)
  platform: PlatformInfo
  userDomainMatched: string

  /**
   * Inject the allowed services.
   * (Remove if not needed in your own app.)
   */
  constructor(
    @Inject(WINDOW) private window: Window,
    private _platform: PlatformInfoService,
    private _recordCountryService: RecordCountriesService,
    private _recordAffiliationService: RecordAffiliationService,
    private _formBuilder: UntypedFormBuilder,
    private _record: RecordService,
    private _organizationService: OrganizationsService,
    private registerService: Register2Service,
    private recordAffiliation: RecordAffiliationService
  ) {}

  ngOnInit(): void {
    this._platform.get().subscribe((data) => {
      this.platform = data
    })

    this._record
      .getRecord()
      .pipe(
        map((record) => {
          //latest domain
          return record?.emails?.emailDomains?.[0]
        }),
        switchMap((domain: AssertionVisibilityString) => {
          if (domain) {
            this.userDomainMatched = domain.value
            // Fetch the organization name from the domain
            return this.registerService
              .getEmailCategory(domain.value)
              .pipe(map((response) => response.rorId))
          }
          return EMPTY
        }),
        switchMap((rorId: string) => {
          if (rorId) {
            return this._organizationService
              .getOrgDisambiguated('ROR', rorId)
              .pipe(first())
          }
          return EMPTY
        })
      )
      .subscribe((org) => {
        if (org) {
          this.organizationFromDatabase = affiliationToOrganization(org)
          this.rorIdHasBeenMatched = true
          this.displayOrganizationHint = true
        }

        this.form = this._formBuilder.group({
          organization: new UntypedFormControl(this.organizationFromDatabase, [
            Validators.required,
            Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND),
            this.mustBeOrganizationType(),
          ]),
          departmentName: new UntypedFormControl('', [
            Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND),
          ]),
          roleTitle: new UntypedFormControl('', [
            Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND),
          ]),
          startDateGroup: this._formBuilder.group(
            {
              startDateYear: [''],
              startDateMonth: [''],
            },
            {
              validators: [dateMonthYearValidator('startDate')],
            }
          ),
        })

        if (this.rorIdHasBeenMatched) {
          this.form.controls.organization.markAsTouched()
        } else {
          this.form.controls.organization.markAsUntouched()
        }

        // Set up autocomplete filtering
        this.filteredOptions$ = this.form
          .get('organization')!
          .valueChanges.pipe(
            tap((val: string | Organization) => {
              // Clear or set organization if user picks from the list
              if (typeof val === 'object') {
                this.organizationFromDatabase = val
                this.displayOrganizationHint = true
              } else if (!val) {
                // If input is empty
                this.organizationFromDatabase = undefined
                this.displayOrganizationHint = false
                this.rorIdHasBeenMatched = false
              }
            }),
            switchMap((val: string | Organization) => {
              if (typeof val === 'string' && val.trim()) {
                // Filter using the real service (RecordAffiliationService)
                return this._recordAffiliationService
                  .getOrganization(val)
                  .pipe(first())
              } else {
                return of([]) // return empty
              }
            })
          )

        this.form.valueChanges.pipe(
          takeUntil(this.destroy$),
          tap((value) => {
            console.log(value)
          })
        )
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  /**
   * We'll show an error if the user typed a string but not an Organization object
   * and left/touched the field.
   */
  mustBeOrganizationType() {
    return (control: AbstractControl) => {
      const value = control.value
      if (value && typeof value === 'string') {
        return { mustBeOrganizationType: true }
      }
      return null
    }
  }

  get organizationIsInvalidAndTouched(): boolean {
    const orgControl = this.form.get('organization')
    return !!(
      orgControl &&
      orgControl.invalid &&
      (orgControl.touched || orgControl.dirty)
    )
  }

  get organizationIsValidAndTouched() {
    return (
      !this.form.hasError('required', 'organization') &&
      !this.form.hasError('mustBeOrganizationType', 'organization') &&
      this.form.get('organization').touched
    )
  }

  get departmentNameIsInvalidAndTouched(): boolean {
    const ctrl = this.form.get('departmentName')
    return !!(ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty))
  }

  get roleTitleIsInvalidAndTouched(): boolean {
    const ctrl = this.form.get('roleTitle')
    return !!(ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty))
  }

  autoCompleteDisplayOrganization(org: Organization | string): string {
    if (typeof org === 'object' && org !== null) {
      return org.value
    }
    return ''
  }

  /** Resets organization-related form data. */
  clearOrganization() {
    this.rorIdHasBeenMatched = false
    this.organizationFromDatabase = undefined
    this.form.patchValue({ organization: '' })
    this.form.get('organization')?.markAsUntouched()
  }

  /** Example submit method for the Save button. */
  accept(value): void {
    // Mark the form as touched so error messages will appear
    this.form.markAllAsTouched()

    if (value && this.form.valid) {
      const affiliation: Affiliation = {
        orgDisambiguatedId: { value: 'ROR' },
        disambiguatedAffiliationSourceId: {
          value: this.organizationFromDatabase?.sourceId,
        },
        departmentName: { value: this.form.value.departmentName },
        roleTitle: { value: this.form.value.roleTitle },
        startDate: {
          day: '',
          year: this.form.value.startDateGroup.startDateYear.toString(),
          month: this.form.value.startDateGroup.startDateMonth.toString()
            ? this.addTrailingZero(
                this.form.value.startDateGroup.startDateMonth.toString()
              )
            : '',
        },
        affiliationName: {
          value: this.organizationFromDatabase?.value,
        },
        city: {
          value: this.organizationFromDatabase?.city,
        },
        region: {
          value: this.organizationFromDatabase?.region,
        },
        country: {
          value: this.organizationFromDatabase?.country,
        },
        affiliationType: {
          value: AffiliationType.employment,
        },
        disambiguationSource: { value: 'ROR' },
        endDate: {
          day: '',
          year: '',
          month: '',
        },
        dateSortString: undefined,
        url: {
          value: '',
        },
        visibility: {
          visibility: 'PUBLIC',
        },
        putCode: {} as Value,
      }
      this.recordAffiliation.postAffiliation(affiliation).subscribe(
        (response) => {
          this.finishIntertsitial(affiliation?.affiliationName?.value) // Handle success
        },
        (error) => {
          this.finishIntertsitial() // Handle error
        }
      )
      // Typically you'd call an API or service to save the data
      console.log('Form data:', this.form.value)
      // Close dialog, if you are using a dialog flow
    } else {
      this.finishIntertsitial()
    }
  }
  finishIntertsitial(institutionName?: string) {
    console.log('OAUTH finishIntertsitial')
  }

  addTrailingZero(date: string): string {
    if (date && Number(date) < 10) {
      return '0' + date
    }
    return date
  }
}
