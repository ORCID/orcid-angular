import { EventEmitter, Input, Output } from '@angular/core'
import { FormGroup } from '@angular/forms'

export abstract class BaseStep {
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
