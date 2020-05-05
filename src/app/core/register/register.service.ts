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
import { RegisterFormAdapterMixin } from './register.form-adapter'
import { RegisterBackendValidatorMixin } from './register.backend-validators'

// Mixing boiler plate

class RegisterServiceBase {
  constructor(
    public _http: HttpClient,
    public _errorHandler: ErrorHandlerService
  ) {}
}
const _RegisterServiceMixingBase = RegisterBackendValidatorMixin(
  RegisterFormAdapterMixin(RegisterServiceBase)
)

@Injectable({
  providedIn: 'root',
})
export class RegisterService extends _RegisterServiceMixingBase {
  backendRegistrationForm: RegisterForm

  constructor(_http: HttpClient, _errorHandler: ErrorHandlerService) {
    super(_http, _errorHandler)
  }

  public checkDuplicatedResearcher(names: {
    familyNames: string
    givenNames: string
  }) {
    return of([
      {
        orcid: '0000-0002-7305-2704',
        email: null,
        givenNames: 'leonardo',
        familyNames: 'mendoza',
        institution: null,
        createdDate: '2018-12-18 UTC',
      },
      {
        orcid: '0000-0002-1744-6557',
        email: null,
        givenNames: 'leonardo',
        familyNames: 'mendoza',
        institution: null,
        createdDate: '2018-12-18 UTC',
      },
      {
        orcid: '0000-0002-1366-7037',
        email: null,
        givenNames: 'Leonardo',
        familyNames: 'Mendoza',
        institution: null,
        createdDate: '2020-04-29 UTC',
      },
      {
        orcid: '0000-0002-2036-7905',
        email: null,
        givenNames: 'Leonardo',
        familyNames: 'Mendoza',
        institution: null,
        createdDate: '2020-04-15 UTC',
      },
    ])
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
}
