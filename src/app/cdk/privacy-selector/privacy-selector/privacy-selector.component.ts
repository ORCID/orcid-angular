import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core'
import {
  NG_VALUE_ACCESSOR,
  NG_ASYNC_VALIDATORS,
  NG_VALIDATORS,
  ControlValueAccessor,
  AsyncValidator,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms'
import { VisibilityStrings } from 'src/app/types/common.endpoint'

@Component({
  selector: 'app-privacy-selector',
  templateUrl: './privacy-selector.component.html',
  styleUrls: [
    './privacy-selector.component.scss-theme.scss',
    './privacy-selector.component.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrivacySelectorComponent),
      multi: true,
    },
  ],
})
export class PrivacySelectorComponent implements OnInit, ControlValueAccessor {
  private onChange: (value: string) => void
  private onTouched: (value: string) => void

  _privacy: VisibilityStrings

  set privacy(value: VisibilityStrings) {
    this._privacy = value
  }
  get privacy(): VisibilityStrings {
    return this._privacy
  }
  privacyChange = new EventEmitter<VisibilityStrings>()

  constructor() {}

  private() {
    this.privacy = 'PRIVATE'
    this.onChange(this.privacy)
    this.onTouched(this.privacy)
    
  }
  limited() {
    this.privacy = 'LIMITED'
    this.onChange(this.privacy)
    this.onTouched(this.privacy)
  }
  public() {
    this.privacy = 'PUBLIC'
    this.onChange(this.privacy)
    this.onTouched(this.privacy)
  }

  writeValue(visibility: VisibilityStrings): void {
    this.privacy = visibility
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.')
  }

  ngOnInit(): void {}
}
