import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { WINDOW } from '../window'

interface TurnstileWindow extends Window {
  turnstile?: {
    render: (element: HTMLElement, options: any) => string
    reset: (id: string) => void
    remove: (id: string) => void
  }
}

@Directive({
  selector: '[appTurnstile]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TurnstileDirective,
      multi: true,
    },
  ],
  standalone: false,
})
export class TurnstileDirective
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() siteKey: string
  @Output() captchaFail = new EventEmitter<boolean>()
  @Output() captchaLoaded = new EventEmitter<number>()
  private widgetId: string | null = null
  private script: HTMLScriptElement | null = null
  private onChange: (value: string | null) => void = () => {}
  private onTouched: () => void = () => {}
  private destroyed = false

  constructor(
    @Inject(WINDOW) private window: TurnstileWindow,
    private element: ElementRef,
    private zone: NgZone
  ) {}

  private load = () =>
    this.zone.run(() => {
      if (this.destroyed) return
      if (!this.siteKey || !this.window.turnstile) {
        this.captchaFail.emit(true)
        return
      }
      try {
        this.widgetId = this.window.turnstile.render(
          this.element.nativeElement,
          {
            sitekey: this.siteKey,
            callback: (token: string) =>
              this.zone.run(() => {
                this.captchaFail.emit(false)
                this.onChange(token)
                this.onTouched()
              }),
            'expired-callback': () => this.zone.run(() => this.reset()),
            'error-callback': () =>
              this.zone.run(() => {
                this.onChange(null)
                this.onTouched()
                this.captchaFail.emit(true)
                return true
              }),
          }
        )
        this.captchaLoaded.emit(0)
      } catch (_error) {
        this.captchaFail.emit(true)
      }
    })

  private fail = () => this.zone.run(() => this.captchaFail.emit(true))

  ngOnInit() {
    if (!this.siteKey) {
      this.fail()
    } else if (this.window.turnstile) {
      this.load()
    } else {
      this.script = this.window.document.createElement('script')
      this.script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      this.script.async = true
      this.script.addEventListener('load', this.load)
      this.script.addEventListener('error', this.fail)
      this.window.document.body.appendChild(this.script)
    }
  }

  reset() {
    this.onChange(null)
    this.onTouched()
    if (this.widgetId !== null) this.window.turnstile?.reset(this.widgetId)
  }

  ngOnDestroy() {
    this.destroyed = true
    this.script?.removeEventListener('load', this.load)
    this.script?.removeEventListener('error', this.fail)
    if (this.widgetId !== null) this.window.turnstile?.remove(this.widgetId)
  }

  writeValue(value: any) {}
  registerOnChange(fn: any) {
    this.onChange = fn
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn
  }
}
