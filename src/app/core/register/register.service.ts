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
} from '@angular/forms'
import { Observable } from 'rxjs'
import { RegisterForm } from 'src/app/types/register.endpoint'

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
  }
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  validateUserName(
    controlName: string,
    controlValue: String
  ): Observable<RegisterForm> {
    const value = {}
    value[controlName] = controlValue
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

  validator(
    controlName: 'givenNames' | 'familyNames' | 'email'
  ): AsyncValidatorFn {
    return (formGroup: FormGroup): Observable<ValidationErrors | null> => {
      const control: AbstractControl = formGroup.controls[controlName]
      return this.validateUserName(controlName, control.value).pipe(
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
}
