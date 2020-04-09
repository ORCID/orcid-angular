import { OnInit, Input, Component } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { TLD_REGEXP } from 'src/app/constants'
import { ErrorStateMatcherForFormLevelErrors } from '../../ErrorStateMatcherForFormLevelErrors'

@Component({
  selector: 'app-form-personal-additional-emails',
  templateUrl: './form-personal-additional-emails.component.html',
  styleUrls: ['./form-personal-additional-emails.component.scss'],
})
export class FormPersonalAdditionalEmailsComponent implements OnInit {
  @Input() additionalEmails: FormGroup

  backendErrorsMatcher = new ErrorStateMatcherForFormLevelErrors(
    this.getControlErrorAtFormLevel,
    'backendErrors'
  )
  emailsAdditionalErrorsMatcher = new ErrorStateMatcherForFormLevelErrors(
    this.getControlErrorAtFormLevel,
    'allEmailsAreUnique'
  )

  constructor() {}

  getControlErrorAtFormLevel(
    control: FormControl | null,
    errorGroup: string
  ): string[] {
    return (
      (control &&
        control.value &&
        control.parent.parent.errors &&
        control.parent.parent.errors[errorGroup] &&
        control.parent.parent.errors[errorGroup]['additionalEmails'][
          control.value
        ] &&
        control.parent.parent.errors[errorGroup]['additionalEmails'][
          control.value
        ] &&
        control.parent.parent.errors[errorGroup]['additionalEmails'][
          control.value
        ]) ||
      []
    )
  }

  addAdditionalEmail(): void {
    const controlName = (
      Object.keys(this.additionalEmails.controls).length + 1
    ).toString()
    this.additionalEmails.addControl(
      controlName,
      new FormControl('', {
        validators: [Validators.email, Validators.pattern(TLD_REGEXP)],
        // asyncValidators: this._register.backendValueValidate(controlName),
      })
    )
  }

  ngOnInit() {}
}
