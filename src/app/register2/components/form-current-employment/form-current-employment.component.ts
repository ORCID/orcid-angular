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
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { Router } from '@angular/router'
import { MAX_LENGTH_LESS_THAN_ONE_THOUSAND } from 'src/app/constants'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import {
  AffiliationType,
  Organization,
} from 'src/app/types/record-affiliation.endpoint'
import { EMPTY, Observable, of } from 'rxjs'
import { RecordAffiliationService } from 'src/app/core/record-affiliations/record-affiliations.service'
import {
  dateMonthYearValidator,
  dateValidator,
  endDateMonthYearValidator,
} from 'src/app/shared/validators/date/date.validator'
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

  @Input()
  public get type(): AffiliationType {
    return this._type
  }

  filteredOptions: Observable<Organization[]>

  @Input() nextButtonWasClicked: boolean
  @Input() reactivation: ReactivationLocal
  @ViewChild(FormGroupDirective) formGroupDir: FormGroupDirective
  organizationPlaceholder = $localize`:@@register.organizationPlaceholder:Type your organization name`
  departmentPlaceholder = $localize`:@@register.departmentPlaceholder:School, college or department`
  rolePlaceholder = $localize`:@@register.rolePlaceholder:Your role or job in the organization`
  yearPlaceholder = $localize`:@@register.yearPlaceholder:Year`
  monthPlaceholder = $localize`:@@register.monthPlaceholder:Month`
  ariaLabelStartDate = $localize`:@@shared.startDate:Start date`
  ngOrcidYear = $localize`:@@shared.year:Year`
  ngOrcidMonth = $localize`:@@shared.month:Month`

  years = Array(110)
    .fill(0)
    .map((i, idx) => idx + new Date().getFullYear() - 108)
    .reverse()

  months = Array(12)
    .fill(0)
    .map((i, idx) => idx + 1)

  // emailPlaceholder = $localize`:@@register.emailPlaceholder:The email address you use most`
  // arialabelConfirmEmail = $localize`:@@register.labelConfirmEmail:Confirm your email address`
  // labelInfoAboutName = $localize`:@@register.ariaLabelInfo:info about names`
  // labelClose = $localize`:@@register.ariaLabelClose:close`
  // labelConfirmEmail = $localize`:@@register.confirmEmail:Confirm primary email`
  // labelNameYouMostCommonly = $localize`:@@register.labelNameYouMostMost:The names you most commonly go by`
  // labelFamilyNamePlaceholder = $localize`:@@register.familyNamePlaceholder:Your family name or surname
  // `
  professionalEmail: boolean
  personalEmail: boolean
  undefinedEmail: boolean
  emailsAreValidAlreadyChecked: boolean
  organization: string | Organization = ''
  platform: import('/Users/l.mendoza/code/orcid-angular/src/app/cdk/platform-info/platform-info.type').PlatformInfo
  isMobile: boolean
  constructor(
    private _register: Register2Service,
    private _reactivationService: ReactivationService,
    private _platform: PlatformInfoService,
    private _router: Router,
    private _liveAnnouncer: LiveAnnouncer,
    private _recordAffiliationService: RecordAffiliationService,
    private _formBuilder: FormBuilder
  ) {
    super()
    this._platform.get().subscribe((platform) => {
      this.platform = platform
      this.isMobile = platform.columns4 || platform.columns8
    })
  }

  emails: UntypedFormGroup = new UntypedFormGroup({})
  additionalEmails: UntypedFormGroup = new UntypedFormGroup({
    '0': new UntypedFormControl('', {
      validators: [OrcidValidators.email],
    }),
  })

  ngOnInit() {
    this.form = new UntypedFormGroup({
      organization: new UntypedFormControl(this.organization, {
        validators: [
          Validators.required,
          Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND),
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
        dateMonthYearValidator('startDate')
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

  autoCompleteDisplayOrganization(organization: Organization) {
    return organization.value
  }

  private _filter(value: string): Observable<Organization[]> {
    if (value) {
      return this._recordAffiliationService.getOrganization(value).pipe(first())
    }

    return EMPTY
  }

  clearForm() {
    this.form.patchValue({
      organization: '',
    })
    this.form.controls.organization.markAsUntouched()
  }

  // allEmailsAreUnique(): ValidatorFn {
  //   return (formGroup: UntypedFormGroup) => {
  //     let hasError = false
  //     const registerForm =
  //       this._register.formGroupToEmailRegisterForm(formGroup)

  //     const error = { backendErrors: { additionalEmails: {} } }

  //     Object.keys(registerForm.emailsAdditional).forEach((key, i) => {
  //       const additionalEmail = registerForm.emailsAdditional[key]
  //       if (!error.backendErrors.additionalEmails[additionalEmail.value]) {
  //         error.backendErrors.additionalEmails[additionalEmail.value] = []
  //       }
  //       const additionalEmailsErrors = error.backendErrors.additionalEmails
  //       if (
  //         registerForm.email &&
  //         additionalEmail.value === registerForm.email.value
  //       ) {
  //         hasError = true
  //         additionalEmailsErrors[additionalEmail.value] = [
  //           'additionalEmailCantBePrimaryEmail',
  //         ]
  //       } else {
  //         Object.keys(registerForm.emailsAdditional).forEach(
  //           (elementKey, i2) => {
  //             const element = registerForm.emailsAdditional[elementKey]
  //             if (i !== i2 && additionalEmail.value === element.value) {
  //               hasError = true
  //               additionalEmailsErrors[additionalEmail.value] = [
  //                 'duplicatedAdditionalEmail',
  //               ]
  //             }
  //           }
  //         )
  //       }
  //     })

  //     if (hasError) {
  //       return error
  //     } else {
  //       return null
  //     }
  //   }
  // }

  // OVERWRITE
  registerOnChange(fn: any) {
    this.form.valueChanges.subscribe((value) => {
      console.log('previous value', value)
      const affiliation = this._register.formGroupToAffiliationRegisterForm(
        this.form as UntypedFormGroup
      )
      console.log('affiliationsForm', affiliation)

      fn({
        affiliationForm: {
          ...affiliation,
        },
      })
    })
  }

  get organizationFormTouched() {
    return (
      ((this.form.controls.organization as any).controls?.organization as any)
        ?.touched || this.nextButtonWasClicked
    )
  }

  get emailFormTouched() {
    return (
      ((this.form.controls.emails as any).controls?.email as any)?.touched ||
      this.nextButtonWasClicked
    )
  }

  get emailConfirmationFormTouched() {
    return (
      ((this.form.controls.emails as any).controls?.confirmEmail as any)
        ?.touched || this.nextButtonWasClicked
    )
  }

  get familyNamesFormTouched() {
    return this.form.controls.familyNames?.touched || this.nextButtonWasClicked
  }

  get emailValid() {
    return ((this.form.controls.emails as any).controls?.email as any).valid
  }

  get emailConfirmationValid() {
    return ((this.form.controls.emails as any).controls?.confirmEmail as any)
      .valid
  }

  get givenNameFormTouched() {
    return this.form.controls.givenNames?.touched || this.nextButtonWasClicked
  }

  // get emailsAreValid() {
  //   const validStatus = this.emailConfirmationValid && this.emailValid
  //   if (!this.emailsAreValidAlreadyChecked && validStatus) {
  //     this.announce($localize`:@@register.emailAreValid:Your emails match`)
  //   } else if (this.emailsAreValidAlreadyChecked && !validStatus) {
  //     this.announce(
  //       $localize`:@@register.emailAreNotValid:Your emails do not match`
  //     )
  //   }
  //   this.emailsAreValidAlreadyChecked = validStatus
  //   return validStatus
  // }

  get emailError(): boolean {
    if (this.emailFormTouched && this.emails.controls.email.errors) {
      const backendError = this.emails.controls.email.errors?.backendError
      return !(
        backendError &&
        backendError[0] === 'orcid.frontend.verify.duplicate_email' &&
        !this.nextButtonWasClicked
      )
    }
    return false
  }

  mustBeOrganizationType(): ValidatorFn {
    return (formGroup: UntypedFormGroup) => {
      // const organization = formGroup.controls.organization.valuec
      console.log('formGroup >', formGroup.value, '<')
      if (formGroup.value && typeof formGroup.value === 'string') {
        return { mustBeOrganizationType: true }
      }
      return null
    }
  }

  // private announce(announcement: string) {
  //   if (environment.debugger) {
  //     console.debug('📢' + announcement)
  //   }
  //   this._liveAnnouncer.announce(announcement, 'assertive')
  // }

  // navigateToSignin(email) {
  //   this._platform
  //     .get()
  //     .pipe(take(1))
  //     .subscribe((platform) => {
  //       return this._router.navigate([ApplicationRoutes.signin], {
  //         // keeps all parameters to support Oauth request
  //         // and set show login to true
  //         queryParams: { ...platform.queryParameters, email, show_login: true },
  //       })
  //     })
  // }
}
