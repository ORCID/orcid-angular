import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { retry, catchError, map, tap, switchMap } from 'rxjs/operators'
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
import { RequestInfoForm } from 'src/app/types'
import { UserService } from '../user/user.service'
import { STANDARD_ERROR_REPORT } from 'src/app/errors'

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

  constructor(
    _http: HttpClient,
    _errorHandler: ErrorHandlerService,
    private _userService: UserService
  ) {
    super(_http, _errorHandler)
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
        catchError((error) =>
          this._errorHandler.handleError(error, STANDARD_ERROR_REPORT)
        )
      )
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
        catchError((error) =>
          this._errorHandler.handleError(error, STANDARD_ERROR_REPORT)
        )
      )
  }

  getRegisterForm(): Observable<RegisterForm> {
    return this._http
      .get<RegisterForm>(`${environment.API_WEB}register.json`, {
        withCredentials: true,
      })
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, STANDARD_ERROR_REPORT)
        )
      )
      .pipe(map((form) => (this.backendRegistrationForm = form)))
  }

  register(
    StepA: FormGroup,
    StepB: FormGroup,
    StepC: FormGroup,
    type?: 'shibboleth',
    requestInfoForm?: RequestInfoForm,
    updateUserService = false
  ): Observable<RegisterConfirmResponse> {
    // TODO: @amontenegro Why does the backend require this?
    this.backendRegistrationForm.valNumClient =
      this.backendRegistrationForm.valNumServer / 2
    const registerForm = this.formGroupToFullRegistrationForm(
      StepA,
      StepB,
      StepC
    )
    this.addOauthContext(registerForm, requestInfoForm)
    this.addShibbolethContext(registerForm, type)
    return this._http
      .post<RegisterConfirmResponse>(
        `${environment.API_WEB}registerConfirm.json`,
        Object.assign(this.backendRegistrationForm, registerForm)
      )
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, STANDARD_ERROR_REPORT)
        ),
        switchMap((value) => {
          // At the moment by default the userService wont be refreshed, only on the oauth login
          // other logins that go outside this application, wont require to refresh the user service
          if (updateUserService) {
            return this._userService.refreshUserSession().pipe(
              map((userStatus) => {
                if (!userStatus.loggedIn && !value.errors) {
                  // sanity check the user should be logged
                  // TODO @leomendoza123 show and report error
                }
                return value
              })
            )
          } else {
            return of(value)
          }
        })
      )
  }

  addOauthContext(
    registerForm: RegisterForm,
    requestInfoForm?: RequestInfoForm
  ): void {
    if (requestInfoForm) {
      registerForm.referredBy = { value: requestInfoForm.clientId }
    }
  }
  addShibbolethContext(registerForm, type?: 'shibboleth'): void {
    // TODO @leomendoza123 https://github.com/ORCID/orcid-angular/issues/206
    return
  }
}
