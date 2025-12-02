import { Component, Inject, Input, OnInit, forwardRef } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { VisibilityStrings } from 'src/app/types/common.endpoint'
import { WINDOW } from '../../window'

@Component({
  selector: 'app-visibility-selector',
  templateUrl: './visibility-selector.component.html',
  styleUrls: [
    './visibility-selector.component.scss',
    './visibility-selector.component.scss-theme.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VisibilitySelectorComponent),
      multi: true,
    },
  ],
  standalone: false,
})
export class VisibilitySelectorComponent
  implements OnInit, ControlValueAccessor
{
  private _privacy: VisibilityStrings

  private _disableVisibilities: VisibilityStrings[]

  @Input() multiEdit: 'multi' | 'single' | 'selected' = 'single'

  @Input() editable = true

  @Input() mobile = false

  @Input()
  ariaLabelPublic: string = $localize`:@@share.ariaLabelPublic:set item visibility to Everyone`
  @Input()
  ariaLabelTrustedParty: string = $localize`:@@share.ariaLabelTrustedParty:set item visibility to Trusted Parties `
  @Input()
  ariaLabelPrivate: string = $localize`:@@share.ariaLabelPrivate:set item visibility to Only Me`
  ariaLabelCurrentlySelected: string = $localize`:@@share.currentSelected: (Currently selected)`
  ariaLabelVisibility: string = $localize`:@@share.visibilityCurrentlySetTo:visibility is currently set to`

  @Input() itemTitle: string

  @Input() visibilityError
  mainButtonLabel: string

  @Input() set privacy(value: VisibilityStrings) {
    this._privacy = value
  }
  get privacy(): VisibilityStrings {
    return this._privacy
  }

  @Input()
  set disableVisibilities(value: VisibilityStrings[]) {
    this._disableVisibilities = value
    this.updateDisableOptions(value)
  }
  get disableVisibilities(): VisibilityStrings[] {
    return this._disableVisibilities
  }

  disableOptions: Record<VisibilityStrings, boolean> = {
    PUBLIC: false,
    LIMITED: false,
    PRIVATE: false,
  }

  constructor(@Inject(WINDOW) private window: Window) {}

  ngOnInit(): void {}
  private onChange: (value: string) => void
  private onTouched: (value: string) => void

  private() {
    this.privacy = 'PRIVATE'
    this.visibilityError = false
    this.updateAriaLabel(this.privacy)
    this.onChange(this.privacy)
    this.onTouched(this.privacy)
  }
  limited() {
    this.privacy = 'LIMITED'
    this.visibilityError = false
    this.updateAriaLabel(this.privacy)
    this.onChange(this.privacy)
    this.onTouched(this.privacy)
  }
  public() {
    this.privacy = 'PUBLIC'
    this.visibilityError = false
    this.updateAriaLabel(this.privacy)
    this.onChange(this.privacy)
    this.onTouched(this.privacy)
  }

  updateDisableOptions(value: VisibilityStrings[]) {
    Object.keys(this.disableOptions).forEach(
      (visibility: VisibilityStrings) => {
        value.includes(visibility)
          ? (this.disableOptions[visibility] = true)
          : (this.disableOptions[visibility] = false)
      }
    )
  }

  writeValue(visibility: VisibilityStrings): void {
    this.updateAriaLabel(visibility)
    this.privacy = visibility
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }
  setDisabledState?(isDisabled: boolean): void {}
  navigate() {
    this.window.open(
      'https://support.orcid.org/hc/en-us/articles/360006897614-Visibility-settings'
    )
  }
  updateAriaLabel(visibility: VisibilityStrings) {
    switch (visibility) {
      case 'PUBLIC':
        this.mainButtonLabel =
          this.ariaLabelVisibility +
          ' ' +
          $localize`:@@register.VisibilityEveryone:Everyone`

        break
      case 'PRIVATE':
        this.mainButtonLabel =
          this.ariaLabelVisibility + ' ' + $localize`:@@shared.onlyMe:Only me`

        break
      case 'LIMITED':
        this.mainButtonLabel =
          this.ariaLabelVisibility + ' ' + $localize`:@@account.trusted:Trusted`

        break

      default:
        break
    }
  }
}
