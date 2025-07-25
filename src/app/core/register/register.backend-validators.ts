import { HttpClient } from '@angular/common/http'
import {
  AbstractControl,
  AsyncValidatorFn,
  UntypedFormGroup,
  ValidationErrors,
} from '@angular/forms'
import { Observable, of } from 'rxjs'
import { catchError, map, retry } from 'rxjs/operators'
import { Constructor } from 'src/app/types'
import { RegisterForm } from 'src/app/types/register.endpoint'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

interface HasHttpClientAndErrorHandler {
  _http: HttpClient
  _errorHandler: ErrorHandlerService
}

interface HasFormAdapters {
  formGroupToEmailRegisterForm(formGroup: UntypedFormGroup): RegisterForm
  formGroupToPasswordRegisterForm(formGroup: UntypedFormGroup): RegisterForm
  formGroupToFullRegistrationForm(
    StepA: UntypedFormGroup,
    StepB: UntypedFormGroup,
    StepC: UntypedFormGroup,
    StepC2: UntypedFormGroup,
    StepD: UntypedFormGroup,
    isReactivation?: boolean
  ): RegisterForm
}

export function RegisterBackendValidatorMixin<
  T extends Constructor<HasHttpClientAndErrorHandler & HasFormAdapters>
>(base: T) {
  return class RegisterBackendValidator extends base {
    constructor(...args: any[]) {
      super(...args)
    }
    formInputs = {
      givenNames: {
        validationEndpoint: 'validateGivenNames',
      },
      familyNames: {
        validationEndpoint: 'validateFamilyNames',
      },
      email: {
        validationEndpoint: 'validateEmail',
      },
      emailsAdditional: {
        validationEndpoint: 'validateEmailsAdditional',
      },
      passwordConfirm: {
        validationEndpoint: 'validatePasswordConfirm',
      },
      password: {
        validationEndpoint: 'validatePassword',
      },
    }

    validateRegisterValue(
      controlName: string,
      value: RegisterForm
    ): Observable<RegisterForm> {
      return this._http
        .post<RegisterForm>(
          runtimeEnvironment.API_WEB +
            `oauth/custom/register/${this.formInputs[controlName].validationEndpoint}.json`,
          value
        )
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error))
        )
    }

    validateAdditionalEmailsReactivation(
      value: RegisterForm
    ): Observable<RegisterForm> {
      return this._http
        .post(
          `${runtimeEnvironment.API_WEB}reactivateAdditionalEmailsValidate.json`,
          value
        )
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error))
        )
    }

    backendValueValidate(
      controlName: 'givenNames' | 'familyNames' | 'email' | 'password'
    ): AsyncValidatorFn {
      return (
        control: AbstractControl
      ): Observable<ValidationErrors | null> => {
        if (control.value === '') {
          return of(null)
        }
        const value = {}
        value[controlName] = { value: control.value }

        return this.validateRegisterValue(controlName, value).pipe(
          map((res) => {
            if (res[controlName].errors && res[controlName].errors.length > 0) {
              const error = {
                backendError: res[controlName].errors,
              }
              return error
            }
            return null
          })
        )
      }
    }

    backendAdditionalEmailsValidate(reactivate: boolean): AsyncValidatorFn {
      return (
        formGroup: UntypedFormGroup
      ): Observable<ValidationErrors | null> => {
        const value: RegisterForm = this.formGroupToEmailRegisterForm(formGroup)
        if (!value.emailsAdditional || value.emailsAdditional.length === 0) {
          return of(null)
        }

        if (reactivate) {
          return this.validateAdditionalEmailsReactivation(value).pipe(
            map((response) => {
              // Add errors to additional emails controls
              return this.setFormGroupEmailErrors(response, 'backendErrors')
            })
          )
        }

        return this.validateRegisterValue('emailsAdditional', value).pipe(
          map((response) => {
            // Add errors to additional emails controls
            return this.setFormGroupEmailErrors(response, 'backendErrors')
          })
        )
      }
    }

    backendPasswordValidate(): AsyncValidatorFn {
      return (
        formGroup: UntypedFormGroup
      ): Observable<ValidationErrors | null> => {
        const value: RegisterForm =
          this.formGroupToPasswordRegisterForm(formGroup)
        if (value.password.value === '' || value.passwordConfirm.value === '') {
          return of(null)
        }
        return this.validateRegisterValue('password', value).pipe(
          map((response) => {
            // Add errors to additional emails controls
            return this.setFormGroupPasswordErrors(response, 'backendErrors')
          })
        )
      }
    }

    backendRegisterFormValidate(
      StepA: UntypedFormGroup,
      StepB: UntypedFormGroup,
      StepC: UntypedFormGroup,
      StepC2: UntypedFormGroup,
      StepD: UntypedFormGroup,
      isReactivation?: boolean,
      type?: 'shibboleth'
    ): Observable<RegisterForm> {
      const registerForm = this.formGroupToFullRegistrationForm(
        StepA,
        StepB,
        StepC,
        StepC2,
        StepD
      )
      registerForm.isReactivation = isReactivation
      return this._http
        .post<RegisterForm>(
          `${runtimeEnvironment.API_WEB}register.json`,
          registerForm
        )
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error))
        )
    }

    public setFormGroupEmailErrors(
      registerForm: RegisterForm,
      errorGroup: string
    ) {
      let hasErrors = false
      const error = {}
      error[errorGroup] = {
        additionalEmails: {},
        email: [],
      }

      registerForm.emailsAdditional.forEach((responseControl) => {
        if (responseControl.errors && responseControl.errors.length > 0) {
          hasErrors = true
          error[errorGroup]['additionalEmails'][responseControl.value] =
            responseControl.errors
        }
      })

      if (
        registerForm.email &&
        registerForm.email.errors &&
        registerForm.email.errors.length > 0
      ) {
        hasErrors = true
        error[errorGroup]['email'].push({
          value: registerForm.email.value,
          errors: registerForm.email.errors,
        })
      }

      return hasErrors ? error : null
    }

    public setFormGroupPasswordErrors(
      registerForm: RegisterForm,
      errorGroup: string
    ) {
      let hasErrors = false
      const error = {}
      error[errorGroup] = {
        password: [],
        passwordConfirm: [],
      }

      if (
        registerForm.password &&
        registerForm.password.errors &&
        registerForm.password.errors.length > 0
      ) {
        hasErrors = true
        error[errorGroup]['password'].push({
          value: registerForm.email.value,
          errors: registerForm.email.errors,
        })
      }
      if (
        registerForm.passwordConfirm &&
        registerForm.passwordConfirm.errors &&
        registerForm.passwordConfirm.errors.length > 0
      ) {
        hasErrors = true
        error[errorGroup]['passwordConfirm'].push({
          value: registerForm.passwordConfirm.value,
          errors: registerForm.passwordConfirm.errors,
        })
      }

      return hasErrors ? error : null
    }
  }
}
