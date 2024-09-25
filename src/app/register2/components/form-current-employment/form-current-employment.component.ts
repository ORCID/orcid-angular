import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core'
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgForm,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { Register2Service } from 'src/app/core/register2/register2.service'
import { OrcidValidators } from 'src/app/validators'

import { first, switchMap, tap } from 'rxjs/operators'
import { ReactivationService } from '../../../core/reactivation/reactivation.service'
import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseForm } from '../BaseForm'
import { ErrorStateMatcher } from '@angular/material/core'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { Router } from '@angular/router'
import { MAX_LENGTH_LESS_THAN_ONE_THOUSAND } from 'src/app/constants'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import {
  AffiliationType,
  Organization,
} from 'src/app/types/record-affiliation.endpoint'
import { EMPTY, Observable, of } from 'rxjs'
import { RecordAffiliationService } from 'src/app/core/record-affiliations/record-affiliations.service'
import { dateMonthYearValidator } from 'src/app/shared/validators/date/date.validator'
import { RegisterStateService } from '../../register-state.service'
import { OrgDisambiguated } from 'src/app/types'
import { RegisterObservabilityService } from '../../register-observability.service'
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    )
  }
}

@Component({
  selector: 'app-form-current-employment',
  templateUrl: './form-current-employment.component.html',
  styleUrls: [
    './form-current-employment.component.scss',
    './form-current-employment.component.scss-theme.scss',
    '../register2.style.scss',
    '../register2.scss-theme.scss',
  ],
  preserveWhitespaces: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormCurrentEmploymentComponent),
      multi: true,
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => FormCurrentEmploymentComponent),
      multi: true,
    },
  ],
})
export class FormCurrentEmploymentComponent extends BaseForm implements OnInit {
  // matcher = new MyErrorStateMatcher()
  selectedOrganizationFromDatabase: Organization
  displayOrganizationHint: boolean
  requireOrganizationDisambiguatedDataOnRefresh = false
  private _type: AffiliationType
  affiliationFound = false
  rorIdHasBeenMatched: boolean

  @Input()
  public get type(): AffiliationType {
    return this._type
  }

  filteredOptions: Observable<Organization[]>

  nextButtonWasClicked: boolean
  @Input() reactivation: ReactivationLocal
  @ViewChild(FormGroupDirective) formGroupDir: FormGroupDirective
  ariaLabelClearOrganization = $localize`:@@register.clearOrganization:Clear organization`
  organizationPlaceholder = $localize`:@@register.organizationPlaceholder:Type your organization name`
  departmentPlaceholder = $localize`:@@register.departmentPlaceholder:School, college or department`
  rolePlaceholder = $localize`:@@register.rolePlaceholder:Your role or job in the organization`
  yearPlaceholder = $localize`:@@register.yearPlaceholder:Year`
  monthPlaceholder = $localize`:@@register.monthPlaceholder:Month`
  ariaLabelStartDate = $localize`:@@shared.startDate:Start date`
  ngOrcidYear = $localize`:@@shared.year:Year`
  ngOrcidMonth = $localize`:@@shared.month:Month`
  ariaLabelOrganization = $localize`:@@register.organization:Organization`
  ariaLabelPrefilledOrganization = $localize`:@@register.prefilledOrganization:Organization - We've added an organization based on your email domain`

  years = Array(110)
    .fill(0)
    .map((i, idx) => idx + new Date().getFullYear() - 108)
    .reverse()

  months = Array(12)
    .fill(0)
    .map((i, idx) => idx + 1)

  organization: string | Organization | OrgDisambiguated = ''
  platform: PlatformInfo
  isMobile: boolean
  rorId: string = 'https://ror.org/036mest28'
  constructor(
    private _register: Register2Service,
    private _platform: PlatformInfoService,
    private _liveAnnouncer: LiveAnnouncer,
    private _recordAffiliationService: RecordAffiliationService,
    private _formBuilder: FormBuilder,
    private registerStateService: RegisterStateService,
    private _registerObservabilityService: RegisterObservabilityService
  ) {
    super()
    this._platform.get().subscribe((platform) => {
      this.platform = platform
      this.isMobile = platform.columns4 || platform.columns8
    })
  }

  ngOnInit() {
    this.registerStateService.getNextButtonClickFor('c2').subscribe(() => {
      this.nextButtonWasClicked = true
      this._registerObservabilityService.stepC2NextButtonClicked(this.form)
    })
    this.registerStateService.getSkipButtonClickFor('c2').subscribe(() => {
      this._registerObservabilityService.stepC2SkipButtonClicked(this.form)
    })
    this.registerStateService.matchOrganization$.subscribe((organization) => {
      this.organization = organization
      this.form.patchValue({
        organization: organization,
      })
      this.rorIdHasBeenMatched = !!organization

      if (this.rorIdHasBeenMatched) {
        this.form.controls.organization.markAsTouched()
      } else {
        this.form.controls.organization.markAsUntouched()
      }
    })
    this.form = new UntypedFormGroup({
      organization: new UntypedFormControl(this.organization, {
        validators: [
          Validators.required,
          Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND),
          this.mustBeOrganizationType(),
        ],
      }),
      departmentName: new UntypedFormControl('', {
        validators: [Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND)],
      }),
      roleTitle: new UntypedFormControl('', {
        validators: [Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND)],
      }),
      startDateGroup: this._formBuilder.group(
        {
          startDateMonth: [''],
          startDateYear: [''],
        },
        { validator: dateMonthYearValidator('startDate') }
      ),
    })

    this.filteredOptions = this.form.get('organization').valueChanges.pipe(
      tap((organization: string | Organization) => {
        // Auto fill form when the user select an organization from the autocomplete list
        if (
          typeof organization === 'object' &&
          organization.disambiguatedAffiliationIdentifier
        ) {
          this.selectedOrganizationFromDatabase = organization
          this.requireOrganizationDisambiguatedDataOnRefresh = true
          this.displayOrganizationHint = true
          // this.fillForm(organization)
        }
        if (!organization) {
          this.selectedOrganizationFromDatabase = undefined
          this.requireOrganizationDisambiguatedDataOnRefresh = true
          this.displayOrganizationHint = false
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
  }

  get organizationIsInvalidAndTouched() {
    return (
      (this.form.hasError('required', 'organization') ||
        this.form.hasError('mustBeOrganizationType', 'organization')) &&
      (this.form.get('organization').touched || this.nextButtonWasClicked)
    )
  }

  get organizationIsValidAndTouched() {
    return (
      !this.form.hasError('required', 'organization') &&
      !this.form.hasError('mustBeOrganizationType', 'organization') &&
      (this.form.get('organization').touched || this.nextButtonWasClicked)
    )
  }

  get departmentNameIsInvalidAndTouched() {
    return (
      this.form.hasError('maxlength', 'departmentName') &&
      (this.form.get('departmentName').touched || this.nextButtonWasClicked)
    )
  }

  get roleTitleIsInvalidAndTouched() {
    return (
      this.form.hasError('maxlength', 'roleTitle') &&
      (this.form.get('roleTitle').touched || this.nextButtonWasClicked)
    )
  }

  autoCompleteDisplayOrganization(
    organization: Organization | string | OrgDisambiguated
  ) {
    if (typeof organization === 'object') {
      return organization.value
    }
  }

  private _filter(value: string): Observable<Organization[]> {
    if (value) {
      return this._recordAffiliationService.getOrganization(value).pipe(first())
    }

    return EMPTY
  }

  clearForm() {
    this.rorIdHasBeenMatched = false
    this.form.patchValue({
      organization: '',
    })
    this.form.controls.organization.markAsUntouched()
  }

  // OVERWRITE
  registerOnChange(fn: any) {
    this.form.valueChanges.subscribe((value) => {
      const affiliation = this._register.formGroupToAffiliationRegisterForm(
        this.form as UntypedFormGroup
      )
      fn({
        affiliationForm: {
          ...affiliation,
        },
      })
    })
  }

  mustBeOrganizationType(): ValidatorFn {
    return (formGroup: UntypedFormGroup) => {
      if (formGroup.value && typeof formGroup.value === 'string') {
        return { mustBeOrganizationType: true }
      }
      return null
    }
  }
}
