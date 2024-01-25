import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { take } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { ApplicationRoutes } from 'src/app/constants'
import { RegisterBackendErrors } from 'src/app/types/register.local'
import { TogglzService } from '../../../core/togglz/togglz.service'
@Component({
  selector: 'app-backend-error',
  templateUrl: './backend-error.component.html',
  styleUrls: ['./backend-error.component.scss'],
  preserveWhitespaces: true,
})
export class BackendErrorComponent implements OnInit {
  recognizedError = RegisterBackendErrors
  _errorCode: string
  @Input() nextButtonWasClicked = false
  @Input() showEmailAlreadyExistUntilNextButtonWasClicked = false
  registrationTogglz = false

  @Input()
  set errorCode(errorCode: string) {
    // This will change the string send by the backend into a code, to handle the error trough a code
    if (errorCode.indexOf('resend-claim') >= 0) {
      errorCode = RegisterBackendErrors[3]
    }
    this._errorCode = errorCode
  }
  get errorCode() {
    return this._errorCode
  }
  @Input() value?: string
  unrecognizedError = false
  constructor(
    private _platformInfo: PlatformInfoService,
    private _router: Router,
    private _togglz: TogglzService
  ) {}
  ngOnInit() {
    this._togglz
      .getStateOf('REGISTRATION_2_0')
      .pipe(take(1))
      .subscribe((value) => (this.registrationTogglz = value))
    if (!(this.errorCode in RegisterBackendErrors)) {
      this.unrecognizedError = true
    }
  }

  navigateToSignin(email) {
    this._platformInfo
      .get()
      .pipe(take(1))
      .subscribe((platform) => {
        return this._router.navigate([ApplicationRoutes.signin], {
          // keeps all parameters to support Oauth request
          // and set show login to true
          queryParams: { ...platform.queryParameters, email, show_login: true },
        })
      })
  }
}
