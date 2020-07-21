import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { OrcidValidators } from 'src/app/validators'

import { ErrorStateMatcherForFormLevelErrors } from '../../ErrorStateMatcherForFormLevelErrors'

@Component({
  selector: 'app-form-personal-additional-emails',
  templateUrl: './form-personal-additional-emails.component.html',
  styleUrls: ['./form-personal-additional-emails.component.scss'],
})
export class FormPersonalAdditionalEmailsComponent implements AfterViewInit {
  labelInfoAboutEmails = $localize`:@@register.ariaLabelInfoEmails:info about emails`
  labelDeleteEmail = $localize`:@@register.ariaLabelDeleteEmail:delete email`
  labelClose = $localize`:@@register.ariaLabelClose:close`
  @Input() additionalEmails: FormGroup
  additionalEmailsPopoverTrigger
  additionalEmailsCount = 1

  constructor(private _ref: ChangeDetectorRef) {}

  backendErrorsMatcher = new ErrorStateMatcherForFormLevelErrors(
    this.getControlErrorAtFormLevel,
    'backendErrors'
  )

  getControlErrorAtFormLevel(
    control: FormControl | null,
    errorGroup: string
  ): string[] {
    return (
      control?.parent?.parent?.errors?.[errorGroup]?.['additionalEmails'][
        control.value
      ] || []
    )
  }

  deleteEmailInput(id: string): void {
    this.additionalEmails.removeControl(id)
  }

  addAdditionalEmail(): void {
    const controlName = ++this.additionalEmailsCount
    this.additionalEmails.addControl(
      this.zeroPad(controlName, 2),
      new FormControl('', {
        validators: [OrcidValidators.email],
      })
    )
  }

  parseInt(number: string) {
    return parseInt(number, 10)
  }

  zeroPad(num, places) {
    return String(num).padStart(places, '0')
  }

  public ngAfterViewInit() {
    this._ref.detectChanges()
  }
}
