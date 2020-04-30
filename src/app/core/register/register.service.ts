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
import {
  RegisterForm,
  DuplicatedName,
  VisibilityValue,
  RegisterConfirmResponse,
} from 'src/app/types/register.endpoint'
import { Value } from 'src/app/types/common.endpoint'

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  backendRegistrationForm: RegisterForm
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
      value[controlName] = { value: control.value }

      return this.validateRegisterValue(controlName, value)
        .pipe(
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
        .pipe(
          retry(3),
          catchError(this._errorHandler.handleError)
        )
    }
  }

  backendAdditionalEmailsValidate(): AsyncValidatorFn {
    return (formGroup: FormGroup): Observable<ValidationErrors | null> => {
      const value: RegisterForm = this.formGroupToEmailRegisterForm(formGroup)
      if (!value.emailsAdditional || value.emailsAdditional.length === 0) {
        return of(null)
      }
      return this.validateRegisterValue('emailsAdditional', value)
        .pipe(
          map(response => {
            // Add errors to additional emails controls
            return this.setFormGroupEmailErrors(response, 'backendErrors')
          })
        )
        .pipe(
          retry(3),
          catchError(this._errorHandler.handleError)
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
      return this.validateRegisterValue('password', value)
        .pipe(
          map(response => {
            // Add errors to additional emails controls
            return this.setFormGroupPasswordErrors(response, 'backendErrors')
          })
        )
        .pipe(
          retry(3),
          catchError(this._errorHandler.handleError)
        )
    }
  }

  public checkDuplicatedResearcher(names: {
    familyNames: string
    givenNames: string
  }) {
    return this._http
      .get<DuplicatedName[]>(environment.API_WEB + `dupicateResearcher.json`, {
        params: names,
        withCredentials: true,
      })
      .pipe(
        retry(3),
        catchError(this._errorHandler.handleError)
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
    let additionalEmailsValue: Value[]
    if (formGroup.controls['additionalEmails']) {
      const additionalEmailsControls = (<FormGroup>(
        formGroup.controls['additionalEmails']
      )).controls
      additionalEmailsValue = Object.keys(additionalEmailsControls)
        .filter(name => additionalEmailsControls[name].value !== '')
        .map(name => {
          if (additionalEmailsControls[name].value) {
            return { value: additionalEmailsControls[name].value }
          }
        })
    }
    let emailValue
    if (formGroup.controls['email']) {
      emailValue = formGroup.controls['email'].value
    }

    const value: RegisterForm = {}

    if (emailValue) {
      value['email'] = { value: emailValue }
    }
    if (additionalEmailsValue) {
      value['emailsAdditional'] = additionalEmailsValue
    }
    return value
  }

  formGroupToNamesRegisterForm(formGroup: FormGroup): RegisterForm {
    return {
      givenNames: { value: formGroup.controls['givenNames'].value },
      familyNames: { value: formGroup.controls['familyNames'].value },
    }
  }

  formGroupToActivitiesVisibilityForm(formGroup: FormGroup): RegisterForm {
    let activitiesVisibilityDefault: VisibilityValue
    if (
      formGroup &&
      formGroup.controls &&
      formGroup.controls['activitiesVisibilityDefault']
    ) {
      activitiesVisibilityDefault = {
        visibility: formGroup.controls['activitiesVisibilityDefault'].value,
      }
    }
    return { activitiesVisibilityDefault }
  }

  formGroupToPasswordRegisterForm(formGroup: FormGroup): RegisterForm {
    let password: Value
    if (formGroup && formGroup.controls && formGroup.controls['password']) {
      password = { value: formGroup.controls['password'].value }
    }
    let passwordConfirm: Value
    if (
      formGroup &&
      formGroup.controls &&
      formGroup.controls['passwordConfirm']
    ) {
      passwordConfirm = { value: formGroup.controls['passwordConfirm'].value }
    }
    return { password, passwordConfirm }
  }

  formGroupToTermOfUserRegisterForm(formGroup: FormGroup): RegisterForm {
    let termsOfUse: Value
    if (formGroup && formGroup.controls && formGroup.controls['termsOfUse']) {
      termsOfUse = { value: formGroup.controls['termsOfUse'].value }
    }
    return { termsOfUse }
  }

  formGroupToSendOrcidNewsForm(formGroup: FormGroup) {
    let sendOrcidNews: Value
    if (
      formGroup &&
      formGroup.controls &&
      formGroup.controls['sendOrcidNews']
    ) {
      sendOrcidNews = { value: formGroup.controls['sendOrcidNews'].value }
    }
    return { sendOrcidNews }
  }

  formGroupToRecaptchaForm(
    formGroup: FormGroup,
    widgetId: number
  ): RegisterForm {
    const value: RegisterForm = {}
    value.grecaptchaWidgetId = {
      value: widgetId != null ? widgetId.toString() : null,
    }
    if (formGroup && formGroup.controls && formGroup.controls['captcha']) {
      value.grecaptcha = { value: formGroup.controls['captcha'].value }
    }
    return value
  }

  confirmRegistration(
    registrationForm: RegisterForm,
    type?: 'shibboleth'
  ): Observable<any> {
    return this._http
      .post(
        `${environment.API_WEB}${type ? '/' + type : ''}'/registerConfirm.json`,
        registrationForm,
        {
          withCredentials: true,
        }
      )
      .pipe(
        retry(3),
        catchError(this._errorHandler.handleError)
      )
  }

  getRegisterForm(): Observable<RegisterForm> {
    return this._http
      .get<RegisterForm>(`${environment.API_WEB}register.json`, {
        withCredentials: true,
      })
      .pipe(
        retry(3),
        catchError(this._errorHandler.handleError)
      )
      .pipe(map(form => (this.backendRegistrationForm = form)))
  }

  backendRegisterFormValidate(
    StepA: FormGroup,
    StepB: FormGroup,
    StepC: FormGroup,
    type?: 'shibboleth'
  ): Observable<RegisterForm> {
    const registerForm = this.formGroupToFullRegistrationForm(
      StepA,
      StepB,
      StepC
    )
    return this._http
      .post<RegisterForm>(`${environment.API_WEB}register.json`, registerForm)
      .pipe(
        retry(3),
        catchError(this._errorHandler.handleError)
      )
  }

  register(
    StepA: FormGroup,
    StepB: FormGroup,
    StepC: FormGroup,
    type?: 'shibboleth'
  ): Observable<RegisterConfirmResponse> {
    // TODO: @amontenegro Why does the backend require this?
    this.backendRegistrationForm.valNumClient =
      this.backendRegistrationForm.valNumServer / 2
    const registerForm = this.formGroupToFullRegistrationForm(
      StepA,
      StepB,
      StepC
    )
    return this._http
      .post<RegisterConfirmResponse>(
        `${environment.API_WEB}registerConfirm.json`,
        Object.assign(this.backendRegistrationForm, registerForm)
      )
      .pipe(
        retry(3),
        catchError(this._errorHandler.handleError)
      )
  }

  formGroupToFullRegistrationForm(
    StepA: FormGroup,
    StepB: FormGroup,
    StepC: FormGroup
  ): RegisterForm {
    return {
      ...StepA.value.personal,
      ...StepB.value.password,
      ...StepB.value.sendOrcidNews,
      ...StepC.value.activitiesVisibilityDefault,
      ...StepC.value.termsOfUse,
      ...StepC.value.captcha,
    }
  }
}
