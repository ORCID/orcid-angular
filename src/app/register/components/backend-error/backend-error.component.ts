import { Component, OnInit, Input } from '@angular/core'

enum RegisterBackendErrors {
  'orcid.frontend.verify.duplicate_email',
  'additionalEmailCantBePrimaryEmail',
}

@Component({
  selector: 'app-backend-error',
  templateUrl: './backend-error.component.html',
  styleUrls: ['./backend-error.component.scss'],
})
export class BackendErrorComponent implements OnInit {
  recognizedError = RegisterBackendErrors
  @Input() errorCode: string
  unrecognizedError = false
  constructor() {}
  ngOnInit() {
    console.log(this.recognizedError)
    console.log(this.recognizedError[this.errorCode])

    if (!(this.errorCode in RegisterBackendErrors)) {
      this.unrecognizedError = true
    }
  }
}
