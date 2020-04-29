// This component was build based on
// https://netbasal.com/how-to-integrate-recaptcha-in-your-angular-forms-400c43344d5c
// and
// https://github.com/DethAriel/ng-recaptcha
// Using the Orcid WINDOW injectable

import {
  Directive,
  Input,
  Inject,
  OnInit,
  NgZone,
  ElementRef,
} from '@angular/core'
import { WINDOW } from '../window'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

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
  key = '6LcH3woTAAAAACtvRjiHlFdBR-T7bTM4pZc1Q1TP'
  private onChange: (value: string) => void
  private onTouched: (value: string) => void
  private widgetId: number

  constructor(
    @Inject(WINDOW) private window: WindowWithCaptcha,
    private ngZone: NgZone,
    private element: ElementRef
  ) {}

  ngOnInit() {
    this.registerReCaptchaCallback()
    this.addScript()
  }

  registerReCaptchaCallback() {
    this.window.orcidReCaptchaOnLoad = () => {
      const config = {
        ...this.config,
        sitekey: this.key,
        callback: (response: string) => {
          this.ngZone.run(() => this.onSuccess(response))
        },

        'expired-callback': (response: string) => {
          this.ngZone.run(() => this.onExpired())
        },
      }
      this.widgetId = this.render(this.element.nativeElement, config)
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

  private render(element: HTMLElement, config): number {
    return this.window.grecaptcha.render(element, config)
  }

  addScript() {
    const script = this.window.document.createElement('script')
    const lang = 'en'
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
