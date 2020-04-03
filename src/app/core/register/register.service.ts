import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { retry, catchError, map } from 'rxjs/operators'
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
  }
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  validateRegisterValue(
    controlName: string,
    value: { [key: string]: Value | Value[] }
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
    controlName: 'givenNames' | 'familyNames' | 'email'
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = {}
      value[controlName] = control.value

      return this.validateRegisterValue(controlName, value).pipe(
        map(res => {
          if (res[controlName].errors && res[controlName].errors.length > 0) {
            const error = {
              backendError: res[controlName].errors,
            }
            control.setErrors(error)
          }
          return null
        })
      )
    }
  }

  backendAdditionalEmailsValidate(): AsyncValidatorFn {
    return (formGroup: FormGroup): Observable<ValidationErrors | null> => {
      console.log(formGroup)
      const additionalEmailsControls = (<FormGroup>(
        formGroup.controls['additionalEmails']
      )).controls
      const emailValue = formGroup.controls['email'].value

      const additionalEmailsValue: Value[] = Object.keys(
        additionalEmailsControls
      ).map(name => {
        return { value: additionalEmailsControls[name].value }
      })

      const value: { [key: string]: Value[] } | {} = {
        emailsAdditional: additionalEmailsValue,
        email: emailValue,
      }

      console.log('validate', value)

      return this.validateRegisterValue('emailsAdditional', value).pipe(
        map(response => {
          // Add errors to additional emails controls

          response.emailsAdditional.forEach(responseControl => {
            // If there is an error for any email on the response
            if (responseControl.errors && responseControl.errors.length > 0) {
              // Find the form control with the matching email
              Object.keys(additionalEmailsControls).map(name => {
                if (
                  additionalEmailsControls[name].value === responseControl.value
                ) {
                  // Add the backend errors to the form control
                  additionalEmailsControls[name].setErrors({
                    backendError: responseControl.errors,
                  })
                }
              })
            }
          })
          // Add errors to email control
          if (response.email.errors && response.email.errors.length > 0) {
            formGroup.controls['email'].setErrors({
              backendError: response.email.errors,
            })
          }

          return null
        })
      )
    }
  }
}
