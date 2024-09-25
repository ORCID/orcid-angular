import { Injectable } from '@angular/core'
import { OrganizationsService } from '../core'
import { Organization } from 'src/app/types/record-affiliation.endpoint'
import { Subject } from 'rxjs'
import { OrgDisambiguated } from '../types'
import { CustomEventService } from '../core/observability-events/observability-events.service'
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms'
import { RegisterStateService } from './register-state.service'
import init from 'helphero'
@Injectable({
  providedIn: 'root',
})
export class RegisterObservabilityService {
  rorIdHasBeenMatched: boolean = false
  matchOrganization$ = new Subject<string | Organization>()
  primaryEmailMatched: Organization
  secondaryEmail: Organization
  constructor(
    private _observability: CustomEventService,
    private _registrationStateService: RegisterStateService
  ) {
    this._registrationStateService.getBackButtonClick().subscribe((step) => {
      this._observability.recordEvent(
        'orcid_registration',
        `step-${step.step}-back-button-clicked`
      )
    })
  }

  signInButtonClicked() {
    this._observability.recordEvent(
      'orcid_registration',
      'step-a-sign-in-button-clicked'
    )
  }

  stepANextButtonClicked(form: UntypedFormGroup) {
    this._observability.recordEvent(
      'orcid_registration',
      'step-a-next-button-clicked',
      {
        // List all form controls errors
        formValues: form.value,
        formValid: form.valid,
        errors: {
          givenNamesError: form.controls.givenNames.errors,
          familyNamesError: form.controls.familyNames.errors,
          emailError: (form.controls.emails as UntypedFormGroup).controls.email
            .errors,
          confirmEmailError: (form.controls.emails as UntypedFormGroup).controls
            .confirmEmail.errors,
          additionalEmailsError: (form.controls.emails as UntypedFormGroup)
            .controls.additionalEmails.errors,
        },
      }
    )
  }

  stepBNextButtonClicked(form: UntypedFormGroup) {
    this._observability.recordEvent(
      'orcid_registration',
      'step-b-next-button-clicked',
      {
        // List all form controls errors
        formValues: form.value,
        formValid: form.valid,
        errors: {
          passwordError: form.controls.password.errors,
          confirmPasswordError: form.controls.passwordConfirm.errors,
        },
      }
    )
  }

  stepC2NextButtonClicked(form: UntypedFormGroup) {
    console.log(form)

    this._observability.recordEvent(
      'orcid_registration',
      'step-c2-next-button-clicked',
      {
        // List all form controls errors
        formValues: form.value,
        formValid: form.valid,
        errors: {
          departmentNameError: form.controls.departmentName.errors,
          roleTitleError: form.controls.roleTitle.errors,
          startDateGroupErrors: form.controls.startDateGroup.errors,
          organizationErrors: form.controls.organization.errors,
        },
      }
    )
  }

  stepC2SkipButtonClicked(form: UntypedFormGroup) {
    console.log(form)
    this._observability.recordEvent(
      'orcid_registration',
      'step-c2-skip-button-clicked',
      {
        // List all form controls errors
        formValues: form.value,
        formValid: form.valid,
        errors: {
          departmentNameError: form.controls.departmentName.errors,
          roleTitleError: form.controls.roleTitle.errors,
          startDateGroupErrors: form.controls.startDateGroup.errors,
          organizationErrors: form.controls.organization.errors,
        },
      }
    )
  }

  stepCNextButtonClicked(form: UntypedFormGroup) {
    this._observability.recordEvent(
      'orcid_registration',
      'step-c-next-button-clicked',
      {
        // List all form controls errors
        formValues: form.value,
        formValid: form.valid,
        errors: {
          visibilityErrors: form.controls.activitiesVisibilityDefault.errors,
        },
      }
    )
  }

  stepDNextButtonClicked(form: UntypedFormGroup) {
    this._observability.recordEvent(
      'orcid_registration',
      'step-d-next-button-clicked',
      {
        // List all form controls errors
        formValues: form.value,
        formValid: form.valid,
        errors: {
          captcha: form.controls.captcha.errors,
          sendMemberUpdatesError: form.controls.sendOrcidNews.errors,
          termsOfUseError: form.controls.termsOfUse.errors,
        },
      }
    )
  }

  stepLoaded(step: 'a' | 'b' | 'c' | 'c2' | 'd') {
    this._observability.recordEvent('orcid_registration', `step-${step}-loaded`)
  }

  initializeHelpHero(reactivation) {
    this._observability.startJourney('orcid_registration', {
      reactivation,
    })
  }
}
