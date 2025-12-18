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
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { ConfigMessageKey } from 'src/app/types/config.endpoint'
import { take } from 'rxjs/operators'

export interface ReCaptchaConfig {
  sitekey: string
  theme?: 'dark' | 'light'
  type?: 'audio' | 'image'
  size?: 'compact' | 'normal'
  tabindex?: number
}

interface WindowWithCaptcha extends Window {
  grecaptcha: {
    render: (ElementRef, ReCaptchaConfig) => number
    reset: (opt_widget_id?: number) => void
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
  standalone: false,
})
export class RecaptchaDirective implements OnInit, ControlValueAccessor {
  @Output() captchaFail = new EventEmitter<boolean>()
  @Output() captchaLoaded = new EventEmitter<number>()
  private onChange: (value: string | null) => void
  private onTouched: (value: string | null) => void
  private renderId: number | null = null
  private lastConfig: ReCaptchaConfig | null = null
  private renderRetried = false

  constructor(
    @Inject(WINDOW) private window: WindowWithCaptcha,
    @Inject(LOCALE_ID) public locale: string,
    private ngZone: NgZone,
    private element: ElementRef,
    private _errorHandler: ErrorHandlerService,
    private _togglzService: TogglzService
  ) {}

  ngOnInit() {
    this.registerReCaptchaCallback()
    this.addScript()
  }

  registerReCaptchaCallback() {
    this.window.orcidReCaptchaOnLoad = () => {
      this._togglzService
        .getConfigurationOf(ConfigMessageKey.RECAPTCHA_WEB_KEY)
        .pipe(take(1))
        .subscribe({
          next: (siteKey: string) => {
            if (!siteKey) {
              this.ngZone.run(() => this.onCaptchaFail('missing_sitekey'))
              return
            }
            if (!this.window.grecaptcha || !this.window.grecaptcha.render) {
              this.ngZone.run(() => this.onCaptchaFail('grecaptcha_not_ready'))
              return
            }

            if (this.renderId !== null) {
              this.window.grecaptcha.reset(this.renderId)
              this.captchaLoaded.emit(this.renderId)
              return
            }

            const config: ReCaptchaConfig & {
              callback: (response: string) => void
              'expired-callback': (response: string) => void
              'error-callback': () => void
            } = {
              sitekey: siteKey,
              callback: (response: string) => {
                this.ngZone.run(() => this.onSuccess(response))
              },
              'expired-callback': (response: string) => {
                this.ngZone.run(() => this.onExpired())
              },
              'error-callback': () => {
                this.handleRenderError('recaptcha_error_callback')
              },
            }

            this.lastConfig = config
            this.renderRetried = false
            this.renderCaptcha(config)
          },
          error: () => {
            this.ngZone.run(() => this.onCaptchaFail('config_fetch_error'))
          },
        })
    }
  }

  private renderCaptcha(config: ReCaptchaConfig) {
    try {
      const id = this.render(this.element.nativeElement, config)
      this.renderId = id
      this.captchaLoaded.emit(id)
    } catch (err) {
      this.handleRenderError('render_exception')
    }
  }

  private handleRenderError(reason: string) {
    if (!this.renderRetried && this.window.grecaptcha && this.lastConfig) {
      this.renderRetried = true
      try {
        const id = this.render(this.element.nativeElement, this.lastConfig)
        this.renderId = id
        this.captchaLoaded.emit(id)
        return
      } catch (_) {
        // fall through
      }
    }
    this.ngZone.run(() => this.onCaptchaFail(reason))
  }

  onExpired() {
    this.ngZone.run(() => {
      this.onChange(null)
      this.onTouched(null)
      if (this.renderId !== null && this.window.grecaptcha) {
        this.window.grecaptcha.reset(this.renderId)
      }
    })
  }

  onSuccess(token: string) {
    this.onChange(token)
    this.onTouched(token)
  }

  onCaptchaFail(reason: string = 'captchaFail') {
    this.captchaFail.emit(true)
    this._errorHandler.handleError(new Error(reason)).subscribe()
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
