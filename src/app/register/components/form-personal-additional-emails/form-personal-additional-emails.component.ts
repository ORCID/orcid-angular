import {
  OnInit,
  Input,
  Component,
  ViewChild,
  AfterViewInit,
} from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { TLD_REGEXP } from 'src/app/constants'
import { ErrorStateMatcherForFormLevelErrors } from '../../ErrorStateMatcherForFormLevelErrors'

@Component({
  selector: 'app-form-personal-additional-emails',
  templateUrl: './form-personal-additional-emails.component.html',
  styleUrls: ['./form-personal-additional-emails.component.scss'],
})
export class FormPersonalAdditionalEmailsComponent {
  @Input() additionalEmails: FormGroup
  @ViewChild(`#namesPopover`) namesPopover
  @ViewChild(`#namesPopoverTrigger`) namesPopoverTrigger

  backendErrorsMatcher = new ErrorStateMatcherForFormLevelErrors(
    this.getControlErrorAtFormLevel,
    'backendErrors'
  )
  emailsAdditionalErrorsMatcher = new ErrorStateMatcherForFormLevelErrors(
    this.getControlErrorAtFormLevel,
    'allEmailsAreUnique'
  )

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
    const controlName = Object.keys(this.additionalEmails.controls).length + 1
    this.additionalEmails.addControl(
      this.zeroPad(controlName, 2),
      new FormControl('', {
        validators: [Validators.email, Validators.pattern(TLD_REGEXP)],
      })
    )
  }

  parseInt(number: string) {
    return parseInt(number, 10)
  }

  zeroPad(num, places) {
    return String(num).padStart(places, '0')
  }
}
