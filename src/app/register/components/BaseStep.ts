import { EventEmitter, Input, Output, Directive } from '@angular/core'
import { UntypedFormGroup } from '@angular/forms'

@Directive()
export abstract class BaseStepDirective {
  public _formGroup: UntypedFormGroup
  @Input()
  set formGroup(formGroup: UntypedFormGroup) {
    this._formGroup = formGroup
    this.formGroupChange.emit(this._formGroup)
  }
  get formGroup() {
    return this._formGroup
  }
  @Output() formGroupChange = new EventEmitter<UntypedFormGroup>()
}
