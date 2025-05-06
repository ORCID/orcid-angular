import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import {
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms'
import { Subject, Observable, of, EMPTY } from 'rxjs'
import { switchMap, first, takeUntil, map, tap } from 'rxjs/operators'

import { WINDOW } from 'src/app/cdk/window'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { RecordAffiliationService } from 'src/app/core/record-affiliations/record-affiliations.service'
import { RecordService } from 'src/app/core/record/record.service'
import { Organization, Value } from 'src/app/types/common.endpoint'
import {
  affiliationToOrganization,
  MAX_LENGTH_LESS_THAN_ONE_THOUSAND,
} from 'src/app/constants'
import { dateMonthYearValidator } from 'src/app/shared/validators/date/date.validator'
import { OrganizationsService } from 'src/app/core'
import { RegisterService } from 'src/app/core/register/register.service'
import { AssertionVisibilityString } from 'src/app/types'
import {
  Affiliation,
  AffiliationType,
} from 'src/app/types/record-affiliation.endpoint'

@Component({
  selector: 'app-affiliation-interstitial',
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

  /** Organization detected from user’s email domain, if any. */
  organizationFromDatabase: Organization | undefined
  displayOrganizationHint = false
  rorIdHasBeenMatched = false

  /** For unsubscribing from streams. */
  private destroy$ = new Subject<void>()

  /** Filtered options observable for the organization autocomplete. */
  filteredOptions$: Observable<Organization[]>

  /** Label/placeholder strings. */
  ariaLabelClearOrganization = $localize`:@@register.clearOrganization:Clear organization`
  organizationPlaceholder = $localize`:@@register.organizationPlaceholder:Type your organization name`
  departmentPlaceholder = $localize`:@@register.departmentPlaceholder:School, college or department`
  rolePlaceholder = $localize`:@@register.rolePlaceholder:Your role or job in the organization`
  ariaLabelStartDate = $localize`:@@shared.startDate:Start date`
  ngOrcidYear = $localize`:@@shared.year:Year`
  ngOrcidMonth = $localize`:@@shared.month:Month`
  ariaLabelOrganization = $localize`:@@register.organization:Organization`
  ariaLabelPrefilledOrganization = $localize`:@@register.prefilledOrganization:Organization - We've added an organization based on your email domain`

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

  constructor(
    @Inject(WINDOW) private window: Window,
    private platformService: PlatformInfoService,
    private recordAffiliationService: RecordAffiliationService,
    private formBuilder: UntypedFormBuilder,
    private recordService: RecordService,
    private organizationService: OrganizationsService,
    private register2Service: RegisterService
  ) {}

  ngOnInit(): void {
    this.platformService.get().subscribe((data) => {
      this.platform = data
    })
    // Attempt to detect organization from user’s email domain
    this.recordService
      .getRecord()
      .pipe(
        map((record) =>
          this.sortDomainsByCreatedDate(record?.emails?.emailDomains)
        ),
        switchMap((domain: AssertionVisibilityString) => {
          if (domain) {
            this.userDomainMatched = domain.value
            return this.register2Service
              .getEmailCategory(domain.value)
              .pipe(map((response) => response.rorId))
          }
          return EMPTY
        }),
        switchMap((rorId: string) => {
          if (rorId) {
            return this.organizationService
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

        // Build the form
        this.form = this.formBuilder.group({
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
          startDateGroup: this.formBuilder.group(
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

        // Autocomplete for organization
        this.filteredOptions$ = this.form
          .get('organization')!
          .valueChanges.pipe(
            tap((val: string | Organization) => {
              if (typeof val === 'object') {
                this.organizationFromDatabase = val
                this.displayOrganizationHint = true
              } else if (!val) {
                this.organizationFromDatabase = undefined
                this.displayOrganizationHint = false
                this.rorIdHasBeenMatched = false
              }
            }),
            switchMap((val: string | Organization) => {
              if (typeof val === 'string' && val.trim()) {
                return this.recordAffiliationService
                  .getOrganization(val)
                  .pipe(first())
              } else {
                return of([])
              }
            })
          )
      })
  }

  sortDomainsByCreatedDate(
    domains: AssertionVisibilityString[] | undefined
  ): AssertionVisibilityString {
    if (!Array.isArray(domains) || domains.length === 0) return undefined

    const sorted = domains.slice().sort((a, b) => {
      const aTimestamp = a.createdDate?.timestamp ?? 0
      const bTimestamp = b.createdDate?.timestamp ?? 0
      return bTimestamp - aTimestamp
    })

    return sorted[0]
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  /**
   * Validator: ensures user has selected an actual Organization object
   * rather than simply typed text.
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
      this.form.get('organization')!.touched
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

  /** Clear the chosen organization. */
  clearOrganization() {
    this.rorIdHasBeenMatched = false
    this.organizationFromDatabase = undefined
    this.form.patchValue({ organization: '' })
    this.form.get('organization')?.markAsUntouched()
  }

  /** Handle "Save" action. */
  accept(value: any): void {
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
        url: { value: '' },
        visibility: { visibility: 'PUBLIC' },
        putCode: {} as Value,
      }

      this.recordAffiliationService.postAffiliation(affiliation).subscribe(
        () => this.finishIntertsitial(affiliation?.affiliationName?.value),
        () => this.finishIntertsitial()
      )
    } else {
      this.finishIntertsitial()
    }
  }

  finishIntertsitial(institutionName?: string) {
    // PLACEHOLDER end-of-flow handling for OAUTH
    console.warn('OAUTH finishIntertsitial')
  }

  /** Ensure single-digit months are properly zero-padded. */
  addTrailingZero(date: string): string {
    if (date && Number(date) < 10) {
      return '0' + date
    }
    return date
  }
}
