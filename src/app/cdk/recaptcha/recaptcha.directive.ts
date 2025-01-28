// This component was build based on
// https://netbasal.com/how-to-integrate-recaptcha-in-your-angular-forms-400c43344d5c
// and
// https://github.com/DethAriel/ng-recaptcha
// Using the Orcid WINDOW injectable, environment and Angular i18n directly

import {
  Directive,
  Inject,
  OnInit,
  NgZone,
  ElementRef,
  LOCALE_ID,
  Output,
  EventEmitter,
} from '@angular/core'
import { WINDOW } from '../window'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'

export interface ReCaptchaConfig {
  theme?: 'dark' | 'light'
  type?: 'audio' | 'image'
  size?: 'compact' | 'normal'
  tabindex?: number
}

interface WindowWithCaptcha extends Window {
  grecaptcha: {
    render: (ElementRef, ReCaptchaConfig) => number
  }
  orcidReCaptchaOnLoad: () => void
}

@Directive({
  selector: '[appRecaptcha]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RecaptchaDirective,
      multi: true,
    },
  ],
})
export class RecaptchaDirective implements OnInit, ControlValueAccessor {
  @Output() captchaFail = new EventEmitter<boolean>()
  @Output() captchaLoaded = new EventEmitter<number>()
  private onChange: (value: string) => void
  private onTouched: (value: string) => void

  constructor(
    @Inject(WINDOW) private window: WindowWithCaptcha,
    @Inject(LOCALE_ID) public locale: string,
    private ngZone: NgZone,
    private element: ElementRef,
    private _errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.registerReCaptchaCallback()
    this.addScript()
  }

  registerReCaptchaCallback() {
    this.window.orcidReCaptchaOnLoad = () => {
      const config = {
        sitekey: runtimeEnvironment.GOOGLE_RECAPTCHA,
        callback: (response: string) => {
          this.ngZone.run(() => this.onSuccess(response))
        },

        'expired-callback': (response: string) => {
          this.ngZone.run(() => this.onExpired())
        },
        'error-callback': () => {
          this.ngZone.run(() => this.onCaptchaFail())
        },
      }
      const id = this.render(this.element.nativeElement, config)
      this.captchaLoaded.emit(id)
    }
  }

  onExpired() {
    this.ngZone.run(() => {
      this.onChange(null)
      this.onTouched(null)
    })
  }

  onSuccess(token: string) {
    this.onChange(token)
    this.onTouched(token)
  }

  onCaptchaFail() {
    this.captchaFail.emit(true)
    this._errorHandler.handleError(new Error('captchaFail')).subscribe()
  }

  private render(element: HTMLElement, config): number {
    return this.window.grecaptcha.render(element, config)
  }

  addScript() {
    const script = this.window.document.createElement('script')
    const lang = this.locale ? '&hl=' + this.locale : ''
    script.src = `https://www.google.com/recaptcha/api.js?onload=orcidReCaptchaOnLoad&render=explicit${lang}`
    script.async = true
    script.defer = true
    this.window.document.body.appendChild(script)
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }
  setDisabledState?(isDisabled: boolean): void {}
}
