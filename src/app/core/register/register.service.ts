import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { retry, catchError, map, tap } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import {
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormGroup,
  FormControl,
} from '@angular/forms'
import { Observable, of } from 'rxjs'
import { RegisterForm } from 'src/app/types/register.endpoint'
import { Value } from 'src/app/types/common.endpoint'

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
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
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  validateRegisterValue(
    controlName: string,
    value: RegisterForm
  ): Observable<RegisterForm> {
    return this._http
      .post<RegisterForm>(
        environment.API_WEB +
          `oauth/custom/register/${
            this.formInputs[controlName].validationEndpoint
          }.json`,
        value
      )
      .pipe(
        retry(3),
        catchError(this._errorHandler.handleError)
      )
  }

  backendValueValidate(
    controlName: 'givenNames' | 'familyNames' | 'email' | 'password'
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (control.value === '') {
        return of(null)
      }
      const value = {}
      value[controlName] = control.value

      return this.validateRegisterValue(controlName, value).pipe(
        map(res => {
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

  backendAdditionalEmailsValidate(): AsyncValidatorFn {
    return (formGroup: FormGroup): Observable<ValidationErrors | null> => {
      const value: RegisterForm = this.formGroupToEmailRegisterForm(formGroup)
      if (value.emailsAdditional.length === 0) {
        return of(null)
      }
      return this.validateRegisterValue('emailsAdditional', value).pipe(
        map(response => {
          // Add errors to additional emails controls
          return this.setFormGroupEmailErrors(response, 'backendErrors')
        }),
        tap(backedError => {
          console.log('BACKEND FORM VALIDATION IS')
          console.log(backedError)
        })
      )
    }
  }

  backendPasswordValidate(): AsyncValidatorFn {
    return (formGroup: FormGroup): Observable<ValidationErrors | null> => {
      const value: RegisterForm = this.formGroupToPasswordRegisterForm(
        formGroup
      )
      if (value.password.value === '' || value.passwordConfirm.value === '') {
        return of(null)
      }
      return this.validateRegisterValue('password', value).pipe(
        map(response => {
          // Add errors to additional emails controls
          return this.setFormGroupPasswordErrors(response, 'backendErrors')
        }),
        tap(backedError => {
          console.log('BACKEND FORM VALIDATION IS')
          console.log(backedError)
        })
      )
    }
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

    registerForm.emailsAdditional.forEach(responseControl => {
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

  formGroupToEmailRegisterForm(formGroup: FormGroup): RegisterForm {
    const additionalEmailsControls = (<FormGroup>(
      formGroup.controls['additionalEmails']
    )).controls
    const emailValue = formGroup.controls['email'].value
    const additionalEmailsValue: Value[] = Object.keys(additionalEmailsControls)
      .filter(name => additionalEmailsControls[name].value !== '')
      .map(name => {
        if (additionalEmailsControls[name].value) {
          return { value: additionalEmailsControls[name].value }
        }
      })
    const value: RegisterForm = {
      emailsAdditional: additionalEmailsValue,
      email: { value: emailValue },
    }
    return value
  }

  formGroupToPasswordRegisterForm(formGroup: FormGroup): RegisterForm {
    const password = formGroup.controls['password'].value
    const passwordConfirmation = formGroup.controls['passwordConfirm'].value

    const value: RegisterForm = {
      password: { value: password },
      passwordConfirm: { value: passwordConfirmation },
    }
    return value
  }
}
