import { Component, OnInit, Input } from '@angular/core'

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
  unrecognizedError = false
  constructor() {}
  ngOnInit() {
    if (!(this.errorCode in RegisterBackendErrors)) {
      this.unrecognizedError = true
    }
  }
}
