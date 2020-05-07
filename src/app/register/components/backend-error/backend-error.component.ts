import { Component, OnInit, Input } from '@angular/core'

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
