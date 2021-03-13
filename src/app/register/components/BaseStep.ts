import { EventEmitter, Input, Output, Directive } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Directive()
export abstract class BaseStepDirective {
  public _formGroup: FormGroup
  @Input()
  set formGroup(formGroup: FormGroup) {
    this._formGroup = formGroup
    this.formGroupChange.emit(this._formGroup)
  }
  get formGroup() {
    return this._formGroup
  }
  @Output() formGroupChange = new EventEmitter<FormGroup>()
}
