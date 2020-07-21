import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { take } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'

// When the error text is not listed on the RegisterBackendErrors enum
// the error message will be displayed as it comes from the backend
// This is because the backend might return code or a text ready for the UI
enum RegisterBackendErrors {
  'orcid.frontend.verify.duplicate_email',
  'additionalEmailCantBePrimaryEmail',
  'duplicatedAdditionalEmail',
}

@Component({
  selector: 'app-backend-error',
  templateUrl: './backend-error.component.html',
  styleUrls: ['./backend-error.component.scss'],
  preserveWhitespaces: true,
})
export class BackendErrorComponent implements OnInit {
  recognizedError = RegisterBackendErrors
  @Input() errorCode: string
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
