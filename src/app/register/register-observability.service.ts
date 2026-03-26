import { Injectable } from '@angular/core'
import { OrganizationsService } from '../core'
import { Organization } from 'src/app/types/record-affiliation.endpoint'
import { Subject } from 'rxjs'
import { OrgDisambiguated } from '../types'
import { RumJourneyEventService } from '../rum/service/customEvent.service'
import { JourneyType } from '../rum/journeys/types'
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms'
import { RegisterStateService } from './register-state.service'
import {
  AppEventName,
  stepBackButtonClickedEvent,
  stepLoadedEvent,
} from '../rum/app-event-names'
import init from 'helphero'
@Injectable({
  providedIn: 'root',
})
export class RegisterObservabilityService {
  rorIdHasBeenMatched: boolean = false
  matchOrganization$ = new Subject<string | Organization>()
  primaryEmailMatched: Organization
  secondaryEmail: Organization
  registrationJourneyStarted: any
  constructor(
    private _observability: RumJourneyEventService,
    private _registrationStateService: RegisterStateService
  ) {
    this._registrationStateService.getBackButtonClick().subscribe((step) => {
      this._observability.recordEvent(
        'orcid_registration',
        stepBackButtonClickedEvent(step.step)
      )
    })
  }

  signInButtonClicked() {
    this._observability.recordEvent(
      'orcid_registration',
      AppEventName.StepASignInButtonClicked
    )
  }

  stepANextButtonClicked(form: UntypedFormGroup) {
    this._observability.recordEvent(
      'orcid_registration',
      AppEventName.StepANextButtonClicked,
      {
        formValid: form.valid,
        errors: {
          givenNamesError: form.controls.givenNames.errors,
          familyNamesError: form.controls.familyNames.errors,
          emailError: (form.controls.emails as UntypedFormGroup).controls.email
            .errors,
          confirmEmailError: (form.controls.emails as UntypedFormGroup).controls
            .confirmEmail?.errors,
          additionalEmailsError: (form.controls.emails as UntypedFormGroup)
            .controls.additionalEmails?.errors,
        },
      }
    )
  }

  stepBNextButtonClicked(form: UntypedFormGroup) {
    this._observability.recordEvent(
      'orcid_registration',
      AppEventName.StepBNextButtonClicked,
      {
        formValid: form.valid,
        errors: {
          passwordError: form.controls.password.errors,
          confirmPasswordError: form.controls.passwordConfirm.errors,
        },
      }
    )
  }

  stepC2NextButtonClicked(form: UntypedFormGroup) {
    this._observability.recordEvent(
      'orcid_registration',
      AppEventName.StepC2NextButtonClicked,
      {
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
    this._observability.recordEvent(
      'orcid_registration',
      AppEventName.StepC2SkipButtonClicked,
      {
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
      AppEventName.StepCNextButtonClicked,
      {
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
      AppEventName.StepDNextButtonClicked,
      {
        formValid: form.valid,
        errors: {
          captcha: form.controls.captcha.errors,
          sendMemberUpdatesError: form.controls.sendOrcidNews.errors,
          termsOfUseError: form.controls.termsOfUse.errors,
        },
      }
    )
  }

  stepLoaded(step: 'a' | 'b' | 'c2' | 'c' | 'd') {
    this._observability.recordEvent('orcid_registration', stepLoadedEvent(step))
  }

  initializeJourney(reactivation) {
    if (!this.registrationJourneyStarted) {
      this._observability.startJourney('orcid_registration', {
        ...reactivation,
      })
      this.registrationJourneyStarted = true
    }
  }

  completeJourney(attributes: any = {}) {
    this._observability.recordEvent(
      'orcid_registration',
      AppEventName.JourneyComplete,
      attributes
    )
    this._observability.finishJourney('orcid_registration')
    this.registrationJourneyStarted = false
  }

  reportRegisterEvent(eventName: string, attributes: any = {}) {
    this._observability.recordEvent('orcid_registration', eventName, attributes)
  }

  reportRegisterErrorEvent(eventName: string, attributes: any = {}) {
    this._observability.recordEvent(
      'orcid_registration',
      `${eventName}-error`,
      attributes
    )
  }
}
