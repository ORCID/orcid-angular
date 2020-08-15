import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { take } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { MAT_HAMMER_OPTIONS } from '@angular/material/core'

// When the error text is not listed on the RegisterBackendErrors enum
// the error message will be displayed as it comes from the backend
// This is because the backend might return code or a text ready for the UI
enum RegisterBackendErrors {
  'orcid.frontend.verify.duplicate_email',
  'additionalEmailCantBePrimaryEmail',
  'duplicatedAdditionalEmail',
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
    // the backend send a string instead of a for the main email, and a error code for additional emails
    // this will change the string on the main email to use the code an show the same error use on additional email
    if (errorCode.indexOf('resend-claim')) {
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
        return this._router.navigate(['/signin'], {
          // keeps all parameters to support Oauth request
          // and set show login to true
          queryParams: { ...platform.queryParameters, email, show_login: true },
        })
      })
  }
}
