import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { Observable, of } from 'rxjs'
import { catchError, first, map, retry, switchMap } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { RequestInfoForm } from 'src/app/types'
import {
  DuplicatedName,
  RegisterConfirmResponse,
  RegisterForm,
} from 'src/app/types/register.endpoint'
import { environment } from 'src/environments/environment'

import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { UserService } from '../user/user.service'
import { RegisterBackendValidatorMixin } from './register.backend-validators'
import { RegisterFormAdapterMixin } from './register.form-adapter'
import { ERROR_REPORT } from 'src/app/errors'
import { objectToUrlParameters } from '../../constants'
import { ReactivationLocal } from '../../types/reactivation.local'

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
    private _userService: UserService,
    private _platform: PlatformInfoService
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
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getRegisterForm(): Observable<RegisterForm> {
    return this._http
      .get<RegisterForm>(`${environment.API_WEB}register.json`, {
        withCredentials: true,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
      .pipe(map((form) => (this.backendRegistrationForm = form)))
  }

  register(
    StepA: FormGroup,
    StepB: FormGroup,
    StepC: FormGroup,
    reactivation: ReactivationLocal,
    requestInfoForm?: RequestInfoForm,
    updateUserService = false
  ): Observable<RegisterConfirmResponse> {
    this.backendRegistrationForm.valNumClient =
      this.backendRegistrationForm.valNumServer / 2
    const registerForm = this.formGroupToFullRegistrationForm(
      StepA,
      StepB,
      StepC
    )
    this.addOauthContext(registerForm, requestInfoForm)
    return this._platform.get().pipe(
      first(),
      switchMap((platform) => {
        let url = `${environment.API_WEB}`
        if (
          platform.institutional ||
          platform.queryParameters.linkType === 'shibboleth'
        ) {
          url += `shibboleth/`
        }
        if (reactivation.isReactivation) {
          url += `reactivationConfirm.json?${objectToUrlParameters(
            platform.queryParameters
          )}`
          registerForm.resetParams = reactivation.reactivationCode
        } else {
          url += `registerConfirm.json?${objectToUrlParameters(
            platform.queryParameters
          )}`
        }

        const registerFormWithTypeContext = this.addCreationTypeContext(
          platform,
          registerForm
        )

        return this._http
          .post<RegisterConfirmResponse>(
            url,
            Object.assign(
              this.backendRegistrationForm,
              registerFormWithTypeContext
            )
          )
          .pipe(
            retry(3),
            catchError((error) =>
              this._errorHandler.handleError(error, ERROR_REPORT.REGISTER)
            ),
            switchMap((value) => {
              // At the moment by default the userService wont be refreshed, only on the oauth login
              // other logins that go outside this application, wont require to refresh the user service
              if (updateUserService) {
                // call refreshUserSession with force session update to handle register actions from sessions with a logged in user
                return this._userService.refreshUserSession(true, true).pipe(
                  first(),
                  map((userStatus) => {
                    if (!userStatus.loggedIn && !value.errors) {
                      // sanity check the user should be logged
                      // sanity check the user should be logged
                      this._errorHandler.handleError(
                        new Error('registerSanityIssue'),
                        ERROR_REPORT.REGISTER
                      )
                    }
                    return value
                  })
                )
              } else {
                return of(value)
              }
            })
          )
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
  addCreationTypeContext(
    platform: PlatformInfo,
    registerForm: RegisterForm
  ): RegisterForm {
    /// TODO @leomendoza123 depend only on the user session thirty party login data
    /// avoid taking data from the the parameters.
    if (
      platform.social ||
      platform.queryParameters.providerId === 'facebook' ||
      platform.queryParameters.providerId === 'google'
    ) {
      registerForm.linkType = 'social'
      return registerForm
    } else if (platform.institutional || platform.queryParameters.providerId) {
      registerForm.linkType = 'shibboleth'
      return registerForm
    } else {
      return registerForm
    }
  }
}
