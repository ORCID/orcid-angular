import { FormGroup } from '@angular/forms'
import { Output, Input, EventEmitter } from '@angular/core'

export class BaseStep {
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
