import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
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
  @Input() ariaLabelPublic = $localize`:@@share.ariaLabelPublic:set item visibility to Everyone`
  @Input() ariaLabelTrustedParty = $localize`:@@share.ariaLabelTrustedParty:set item visibility to Trusted Parties `
  @Input() ariaLabelPrivate = $localize`:@@share.ariaLabelPrivate:set item visibility to Only Me`
  ariaLabelCurrentlySelected = $localize`:@@share.currentSelected: (Currently selected)`

  @Input() type:
    | 'top-bar'
    | 'side-bar'
    | 'affiliations'
    | 'employment'
    | 'education'
    | 'qualification'
    | 'invited-position'
    | 'distinction'
    | 'membership'
    | 'service'
    | 'peer-review'
    | 'main'
    | 'works'
    | 'activities'
    | 'funding'
    | 'research-resources'

  private onChange: (value: string) => void
  private onTouched: (value: string) => void
  @Input() whiteBackground = false

  _privacy: VisibilityStrings

  @Input() set privacy(value: VisibilityStrings) {
    this._privacy = value
  }
  get privacy(): VisibilityStrings {
    return this._privacy
  }
  @Input() alignment: 'start' | 'bottom' = null
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
