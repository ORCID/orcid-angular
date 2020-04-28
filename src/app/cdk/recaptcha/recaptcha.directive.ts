import {
  Directive,
  Input,
  Inject,
  OnInit,
  NgZone,
  ElementRef,
} from '@angular/core'
import { WINDOW } from '../window'
import { ControlValueAccessor } from '@angular/forms'

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
  reCaptchaLoad: () => void
}

@Directive({
  selector: '[appRecaptcha]',
})
export class RecaptchaDirective implements OnInit, ControlValueAccessor {
  key = '6LcH3woTAAAAACtvRjiHlFdBR-T7bTM4pZc1Q1TP'
  @Input() config: ReCaptchaConfig = {}
  @Input() lang: string
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
    this.window.reCaptchaLoad = () => {
      const config = {
        ...this.config,
        sitekey: this.key,
        callback: this.onSuccess.bind(this),
        'expired-callback': this.onExpired.bind(this),
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
    this.ngZone.run(() => {
      this.onChange(token)
      this.onTouched(token)
    })
  }

  private render(element: HTMLElement, config): number {
    return this.window.grecaptcha.render(element, config)
  }

  addScript() {
    const script = this.window.document.createElement('script')
    const lang = this.lang ? '&hl=' + this.lang : ''
    script.src = `https://www.google.com/recaptcha/api.js?onload=reCaptchaLoad&render=explicit${lang}`
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
