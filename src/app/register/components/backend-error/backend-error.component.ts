import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { take } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { ApplicationRoutes } from 'src/app/constants'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { SignInService } from 'src/app/core/sign-in/sign-in.service'
import { ERROR_REPORT } from 'src/app/errors'

// When the error text is not listed on the RegisterBackendErrors enum
// the error message will be displayed as it comes from the backend
// This is because the backend might return code or a text ready for the UI
enum RegisterBackendErrors {
  'orcid.frontend.verify.duplicate_email',
  'additionalEmailCantBePrimaryEmail',
  'duplicatedAdditionalEmail',
  'orcid.frontend.verify.unclaimed_email',
  'orcid.frontend.verify.deactivated_email',
}

@Component({
  selector: 'app-backend-error',
  templateUrl: './backend-error.component.html',
  styleUrls: ['./backend-error.component.scss'],
  preserveWhitespaces: true,
})
export class BackendErrorComponent implements OnInit {
  recognizedError = RegisterBackendErrors
  _errorCode: string
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
    private _snackbar: SnackbarService,
    private _signIn: SignInService,
    private _errorHandler: ErrorHandlerService
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
        return this._router.navigate(['/signin'], {
          // keeps all parameters to support Oauth request
          // and set show login to true
          queryParams: { ...platform.queryParameters, email, show_login: true },
        })
      })
  }

  reactivateEmail(email) {
    const $deactivate = this._signIn.reactivation(email)
    $deactivate.subscribe((data) => {
      if (data.error) {
        this._errorHandler
          .handleError(
            new Error(data.error),
            ERROR_REPORT.REGISTER_REACTIVATED_EMAIL
          )
          .subscribe()
      } else {
        this._snackbar.showSuccessMessage({
          title: '$localize`:@@register.reactivating:Reactivating your account',
          // tslint:disable-next-line: max-line-length
          message: $localize`:@@ngOrcid.signin.verify.reactivationSent:Thank you for reactivating your ORCID record; please complete the process by following the steps in the email we are now sending you. If you don’t receive an email from us, please`,
          action: $localize`:@@shared.knowledgeBase:contact support.`,
          actionURL: `https://support.orcid.org/hc/en-us/requests/new`,
          closable: true,
        })
        this._router.navigate([ApplicationRoutes.signin])
      }
    })
  }
}
