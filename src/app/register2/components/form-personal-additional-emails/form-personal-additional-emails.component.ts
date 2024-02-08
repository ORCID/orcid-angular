import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core'
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms'
import { OrcidValidators } from 'src/app/validators'

import { ErrorStateMatcherForFormLevelErrors } from '../../ErrorStateMatcherForFormLevelErrors'

@Component({
  selector: 'app-form-personal-additional-emails',
  templateUrl: './form-personal-additional-emails.component.html',
  styleUrls: [
    './form-personal-additional-emails.component.scss',
    '../register2.style.scss',
    '../register2.scss-theme.scss',
  ],
})
export class FormPersonalAdditionalEmailsComponent implements AfterViewInit {
  labelInfoAboutEmails = $localize`:@@register.ariaLabelInfoEmails:info about emails`
  labelDeleteEmail = $localize`:@@register.ariaLabelDeleteEmail:delete email`
  labelClose = $localize`:@@register.ariaLabelClose:close`
  labelAddAnAddionalEmail = $localize`:@@register.addAnAdditionalEmail:Add an additional email`
  @ViewChildren('emailInput') inputs: QueryList<ElementRef>
  @Input() additionalEmails: UntypedFormGroup
  @Input() nextButtonWasClicked: boolean
  additionalEmailsPopoverTrigger
  additionalEmailsCount = 1

  constructor(
    private _ref: ChangeDetectorRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  backendErrorsMatcher = new ErrorStateMatcherForFormLevelErrors(
    this.getControlErrorAtFormLevel,
    'backendErrors'
  )

  getControlErrorAtFormLevel(
    control: AbstractControl | null,
    errorGroup: string
  ): string[] {
    return (
      control?.parent?.parent?.errors?.[errorGroup]?.['additionalEmails'][
        control.value
      ] || []
    )
  }

  // deleteEmailInput(id: string): void {
  //   this.additionalEmails.removeControl(id)
  //   this._changeDetectorRef.detectChanges()

  //   const input = this.inputs.filter(
  //     (x) => this.parseInt(x.nativeElement.id) > this.parseInt(id)
  //   )?.[0]
  //   if (input) {
  //     input.nativeElement.focus()
  //   } else if (this.inputs.last) {
  //     this.inputs.last.nativeElement.focus()
  //   }
  // }

  // addAdditionalEmail(): void {
  //   const controlName = ++this.additionalEmailsCount
  //   this.additionalEmails.addControl(
  //     this.zeroPad(controlName, 2),
  //     new UntypedFormControl('', {
  //       validators: [OrcidValidators.email],
  //     })
  //   )
  //   this._changeDetectorRef.detectChanges()
  //   const input = this.inputs.last.nativeElement as HTMLInputElement
  //   input.focus()
  // }

  parseInt(number: string) {
    return parseInt(number, 10)
  }

  zeroPad(num, places) {
    return String(num).padStart(places, '0')
  }

  public ngAfterViewInit() {
    this._ref.detectChanges()
  }
  get additionalEmailsTouched() {
    return this.additionalEmails.touched
  }
}
