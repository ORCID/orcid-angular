import { CommonModule } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { take } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { ApplicationRoutes } from 'src/app/constants'
import { RegisterBackendErrors } from 'src/app/types/register.local'
@Component({
  selector: 'app-backend-error',
  templateUrl: './backend-error.component.html',
  styleUrls: ['./backend-error.component.scss'],
  imports: [CommonModule],
  preserveWhitespaces: true,
  standalone: true,
})
export class BackendErrorComponent implements OnInit {
  recognizedError = RegisterBackendErrors
  _errorCode: string
  @Input() nextButtonWasClicked = false
  @Input() showEmailAlreadyExistUntilNextButtonWasClicked = false

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
    private _router: Router
  ) {}
  ngOnInit() {
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
