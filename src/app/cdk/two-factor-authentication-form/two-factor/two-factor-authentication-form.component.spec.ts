import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing'
import { TwoFactorAuthenticationFormComponent } from './two-factor-authentication-form.component'
import { WINDOW_PROVIDERS } from '../../window'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

describe('TwoFactorAuthenticationFormComponent', () => {
  let component: TwoFactorAuthenticationFormComponent
  let fixture: ComponentFixture<TwoFactorAuthenticationFormComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        // `[errorStateMatcher]` is an input of MatInput: without the real
        // directives here the binding is an unknown property, and the error
        // state the frames turn on could not be exercised at all.
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      declarations: [TwoFactorAuthenticationFormComponent],
      providers: [WINDOW_PROVIDERS],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFactorAuthenticationFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  function element(id: string): HTMLElement | null {
    return fixture.nativeElement.querySelector(`#${id}`)
  }

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('the recovery number option', () => {
    it('is offered only when the flag says so (R3.1)', () => {
      expect(element('cy-send-recovery-phone-code')).toBeNull()

      component.recoveryPhoneOptionAvailable = true
      fixture.detectChanges()

      expect(element('cy-send-recovery-phone-code')).not.toBeNull()
    })

    it('asks the host for a code and switches to the third mode', () => {
      const requested = jasmine.createSpy('requestRecoveryPhoneCode')
      component.requestRecoveryPhoneCode.subscribe(requested)
      component.recoveryPhoneOptionAvailable = true
      fixture.detectChanges()

      element('cy-send-recovery-phone-code').click()

      expect(requested).toHaveBeenCalledTimes(1)
      expect(component.mode).toBe('phone')
      expect(component.recoveryPhoneMode).toBeTrue()
      // The two-state flag callers still use never claims this mode
      expect(component.recoveryCode).toBeFalse()
      expect(component.authenticationCodeMode).toBeFalse()
    })

    it('shows its field only once a code has actually been sent (R3.3)', () => {
      component.recoveryPhoneOptionAvailable = true
      component.showRecoveryPhoneCode()
      fixture.detectChanges()
      expect(element('recovery-phone-signin-code')).toBeNull()

      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 30,
        sending: false,
      }
      fixture.detectChanges()

      expect(element('recovery-phone-signin-code')).not.toBeNull()
      expect(component.recoveryPhoneCodeFormControl.enabled).toBeTrue()
    })

    it('spells the recovery code option out in full with the flag on (R3.1)', () => {
      component.recoveryPhoneOptionAvailable = true
      fixture.detectChanges()

      const text = fixture.nativeElement.textContent
      expect(text).toContain("Don't have your device?")
      expect(text).toContain('Use a recovery code instead')
      expect(text).not.toContain('Enter a recovery code')
      expect(text).toContain("Don't have your device or your recovery codes?")
      expect(text).toContain(
        'Send a code to your recovery number and disable 2FA'
      )
    })

    it('leaves the flag-off options word for word as they were (R3.1)', () => {
      fixture.detectChanges()

      const text = fixture.nativeElement.textContent
      expect(text).toContain("Don't have your device?")
      expect(text).toContain('Enter a recovery code')
      expect(text).not.toContain('Use a recovery code instead')
    })

    it('opens the recovery code field from the respelled control', () => {
      component.recoveryPhoneOptionAvailable = true
      fixture.detectChanges()

      element('cy-use-a-recovery-code').click()

      expect(component.mode).toBe('recovery')
    })

    it('takes focus to the code field the moment it renders', fakeAsync(() => {
      component.recoveryPhoneOptionAvailable = true
      component.showRecoveryPhoneCode()
      fixture.detectChanges()
      // Nothing to focus yet: the field is behind the *ngIf on codeSent, so
      // the choice itself cannot be what moves focus
      expect(element('recovery-phone-signin-code')).toBeNull()

      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 30,
        sending: false,
      }
      fixture.detectChanges()
      tick()

      expect(document.activeElement).toBe(element('recovery-phone-signin-code'))
    }))

    it('leaves focus where the user put it while the countdown runs', fakeAsync(() => {
      component.recoveryPhoneOptionAvailable = true
      component.showRecoveryPhoneCode()
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 30,
        sending: false,
      }
      fixture.detectChanges()
      tick()
      ;(document.activeElement as HTMLElement).blur()

      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 29,
        sending: false,
      }
      fixture.detectChanges()
      tick()

      expect(document.activeElement).not.toBe(
        element('recovery-phone-signin-code')
      )
    }))

    it('names the code field with the label beside it', () => {
      component.recoveryPhoneOptionAvailable = true
      component.showRecoveryPhoneCode()
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 0,
        sending: false,
      }
      fixture.detectChanges()

      // mat-label is a directive, not a <label>, so the input has to point at
      // it: nothing else gives this field an accessible name
      const labelledBy = element('recovery-phone-signin-code').getAttribute(
        'aria-labelledby'
      )
      expect(labelledBy).toBe('recovery-phone-signin-code-label')
      const label = fixture.nativeElement.querySelector('#' + labelledBy)
      expect(label).not.toBeNull()
      expect(label.textContent.trim()).toBe('Recovery number code')
    })

    it('toggles back to the authentication app', () => {
      component.showRecoveryPhoneCode()
      component.showAuthenticationCode()

      expect(component.mode).toBe('totp')
      // Out of phone mode the field must not hold the form back
      expect(component.recoveryPhoneCodeFormControl.disabled).toBeTrue()
    })
  })

  describe('the resend line', () => {
    beforeEach(() => {
      component.recoveryPhoneOptionAvailable = true
      component.showRecoveryPhoneCode()
    })

    it('counts down while the registry is still holding the buffer', () => {
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 12,
        sending: false,
      }
      fixture.detectChanges()

      expect(element('cy-resend-recovery-phone-code')).toBeNull()
      expect(fixture.nativeElement.textContent).toContain('12')
    })

    it('offers the resend control at zero', () => {
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 0,
        sending: false,
      }
      fixture.detectChanges()

      const resend = element('cy-resend-recovery-phone-code')
      expect(resend).not.toBeNull()

      const requested = jasmine.createSpy('requestRecoveryPhoneCode')
      component.requestRecoveryPhoneCode.subscribe(requested)
      resend.click()
      expect(requested).toHaveBeenCalledTimes(1)
    })

    /*
     * D6. Frame 988:11771 and the three error frames beside it head this row
     * with the question, and the screen dropped it. It belongs to the row, not
     * to the screen, so it goes when the row goes - which is what the second
     * case is for: once PD-13635's cap is reached the resend has no answer and
     * neither has the question above it.
     */
    it('heads the resend row with the question the frames put above it', () => {
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 12,
        sending: false,
      }
      fixture.detectChanges()

      expect(fixture.nativeElement.textContent).toContain(
        "Don't have your device or your recovery codes?"
      )
    })

    it('takes the question away with the resend it heads, at the cap', () => {
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 0,
        sending: false,
        errorCode: 'SEND_LIMIT_REACHED',
      }
      fixture.detectChanges()

      expect(fixture.nativeElement.textContent).not.toContain(
        "Don't have your device or your recovery codes?"
      )
    })
  })

  describe('error codes', () => {
    // A field-level verdict is rendered in the field's own row and a send-level
    // one in the alert row below it, so the mapping is read off whichever of
    // the two answers. R3.4 is that exactly one of them does.
    function messageFor(errorCode: string): string | null {
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 0,
        sending: false,
        errorCode,
      }
      const field = component.recoveryPhoneFieldErrorMessage
      const send = component.recoveryPhoneErrorMessage
      expect(field && send)
        .withContext(errorCode)
        .toBeFalsy()
      return field || send
    }

    it('maps each code the endpoints answer with (R3.4)', () => {
      expect(messageFor('INVALID_CODE')).toBe('Invalid recovery number code')
      expect(messageFor('NO_RECOVERY_PHONE')).toBe(
        'This account has no recovery phone number'
      )
      expect(messageFor('BAD_CREDENTIALS')).toBe('Invalid sign in details')
      expect(messageFor('CODE_EXPIRED')).toBe(
        'That code is no longer valid. Send a new code.'
      )
      expect(messageFor('TOO_MANY_ATTEMPTS')).toBe(
        'That code is no longer valid. Send a new code.'
      )
      expect(messageFor('SEND_LIMIT_REACHED')).toBe(
        'Too many codes have been sent to your recovery phone number today. ' +
          'Please try again tomorrow, or use your authentication app or a recovery code.'
      )
      expect(messageFor('SMS_SEND_FAILED')).toBe(
        'We could not send a verification code. Please try again.'
      )
      expect(messageFor('SMS_PROVIDER_NOT_CONFIGURED')).toBe(
        'We could not send a verification code. Please try again.'
      )
      expect(messageFor('FEATURE_DISABLED')).toBe(
        'Something went wrong. Please try again.'
      )
      expect(messageFor('HTTP')).toBe('Something went wrong. Please try again.')
    })

    it('offers a resend while a code has gone out and the cap is untouched', () => {
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 0,
        sending: false,
        errorCode: 'INVALID_CODE',
      }
      expect(component.recoveryPhoneResendIsWorthOffering).toBeTrue()
    })

    it('stops offering a resend once the daily cap is reached', () => {
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 0,
        sending: false,
        errorCode: 'SEND_LIMIT_REACHED',
      }
      expect(component.recoveryPhoneResendIsWorthOffering).toBeFalse()
    })

    it('keeps the resend hidden when a later code is rejected', () => {
      // One errorCode field carries the send's answer and the verify's, and
      // the container clears it on every attempt. Reading it directly put the
      // offer back on screen, live, for a send that cannot succeed until
      // tomorrow - which is the thing this suppression exists to prevent.
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 0,
        sending: false,
        errorCode: 'SEND_LIMIT_REACHED',
      }
      expect(component.recoveryPhoneResendIsWorthOffering).toBeFalse()

      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 0,
        sending: false,
        errorCode: 'INVALID_CODE',
      }

      expect(component.recoveryPhoneResendIsWorthOffering).toBeFalse()
    })

    it('says nothing when there is no error', () => {
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 0,
        sending: false,
      }
      expect(component.recoveryPhoneErrorMessage).toBeNull()
    })

    it('renders the mapped message in an alert region', () => {
      component.showRecoveryPhoneCode()
      component.recoveryPhoneState = {
        codeSent: false,
        resendSeconds: 0,
        sending: false,
        errorCode: 'NO_RECOVERY_PHONE',
      }
      fixture.detectChanges()

      const alert = fixture.nativeElement.querySelector('[role="alert"]')
      expect(alert.textContent).toContain(
        'This account has no recovery phone number'
      )
    })
  })

  describe('submitting', () => {
    it('emits the texted code, and nothing else', () => {
      const authenticate = jasmine.createSpy('authenticate')
      component.authenticate.subscribe(authenticate)
      component.showRecoveryPhoneCode()
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 0,
        sending: false,
      }
      component.recoveryPhoneCodeFormControl.setValue('123456')

      component.onSubmit()

      expect(authenticate).toHaveBeenCalledWith({
        recoveryPhoneCode: '123456',
      })
    })

    it('refuses a code that is not six characters long', () => {
      const authenticate = jasmine.createSpy('authenticate')
      component.authenticate.subscribe(authenticate)
      component.showRecoveryPhoneCode()
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 0,
        sending: false,
      }
      component.recoveryPhoneCodeFormControl.setValue('123')

      component.onSubmit()

      expect(authenticate).not.toHaveBeenCalled()
      expect(component.isRecoveryPhoneCodeInvalid).toBeTrue()
    })

    it('posts nothing before a code has been sent', () => {
      const authenticate = jasmine.createSpy('authenticate')
      component.authenticate.subscribe(authenticate)
      component.showRecoveryPhoneCode()

      component.onSubmit()

      expect(authenticate).not.toHaveBeenCalled()
    })

    it('still emits the authentication code in the original mode', () => {
      const authenticate = jasmine.createSpy('authenticate')
      component.authenticate.subscribe(authenticate)
      component.verificationFormControl.setValue('123456')

      component.onSubmit()

      const emitted = authenticate.calls.mostRecent().args[0]
      expect(emitted.verificationCode).toBe('123456')
      expect(emitted.recoveryPhoneCode).toBeUndefined()
    })
  })

  /*
   * PD-6042, the design round. Measured off the frame exports rather than read
   * off the screen: in `pd-6042-01` the four escape rows are ink-centred on
   * 289.5-290.0 px of a content column that runs 64..515 (centre 289.5), and
   * the build drew every one of them starting at the column's left edge with
   * the question and its link run together on one line. `pd-6042-02` and the
   * three error frames beside it say the same of the recovery-number mode.
   *
   * The centring itself is Tailwind's `text-center`, the same utility the
   * challenge screen's identical block uses. tailwind.css is in the app build's
   * style list but not in the unit suite's (angular.json, ng-orcid test
   * options), so what is asserted here is that the utility is on the block -
   * the rows' geometry is asserted directly, because that comes from this
   * component's own stylesheet.
   */
  describe('the escape rows against their frame', () => {
    function flagOn() {
      component.recoveryPhoneOptionAvailable = true
      fixture.detectChanges()
    }

    function phoneMode() {
      component.recoveryPhoneOptionAvailable = true
      component.showRecoveryPhoneCode()
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 30,
        sending: false,
      }
      fixture.detectChanges()
    }

    const blockOf = (element: HTMLElement): HTMLElement =>
      element.closest('.two-factor-escape') as HTMLElement

    it('centres every escape block the frames draw centred', () => {
      flagOn()
      const recoveryCode = element('cy-use-a-recovery-code')
      const recoveryPhone = element('cy-send-recovery-phone-code')

      expect(blockOf(recoveryCode)).toBeTruthy()
      expect(blockOf(recoveryCode).classList).toContain('text-center')
      expect(blockOf(recoveryPhone)).toBeTruthy()
      expect(blockOf(recoveryPhone).classList).toContain('text-center')
    })

    it('gives the recovery code link its own row under the question', () => {
      flagOn()
      const link = element('cy-use-a-recovery-code')
      const question = blockOf(link).querySelector('p')

      expect(question.textContent).toContain("Don't have your device?")
      expect(question.contains(link)).toBe(false)
      expect(link.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        question.getBoundingClientRect().bottom
      )
    })

    it('gives the recovery number link its own row under its question', () => {
      flagOn()
      const link = element('cy-send-recovery-phone-code')
      const question = blockOf(link).querySelector('p')

      expect(question.textContent).toContain(
        "Don't have your device or your recovery codes?"
      )
      expect(question.contains(link)).toBe(false)
      expect(link.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        question.getBoundingClientRect().bottom
      )
    })

    it('centres the recovery number mode rows too', () => {
      phoneMode()
      const back: HTMLElement = fixture.nativeElement.querySelector(
        '.two-factor-escape .link-button'
      )
      const resend: HTMLElement = fixture.nativeElement.querySelector(
        '.recovery-phone-resend'
      )

      expect(back).toBeTruthy()
      expect(back.textContent).toContain('Use your authentication app instead')
      expect(blockOf(back).classList).toContain('text-center')
      expect(blockOf(resend)).toBeTruthy()
      expect(blockOf(resend).classList).toContain('text-center')
    })

    it('gives the authentication app link its own row', () => {
      phoneMode()
      const back: HTMLElement = fixture.nativeElement.querySelector(
        '.two-factor-escape .link-button'
      )
      const question = blockOf(back).querySelector('p')

      expect(question.textContent).toContain("Don't have your recovery codes?")
      expect(question.contains(back)).toBe(false)
      expect(back.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        question.getBoundingClientRect().bottom
      )
    })
  })

  /*
   * PD-6042, the italic run. The five recovery-number-code frames -
   * `pd-6042-02`, `pd-6042-09` and the three error frames - draw
   * "Didn't get the code? You can resend in 27 seconds" in italic, with the
   * number bold inside it, and every other run on those screens upright. The
   * build drew the whole row upright: `p.recovery-phone-resend` reports
   * font-style normal in the DOM probe of all five states. It is the only
   * italic mismatch in the PD-6042 and PD-6046 frames.
   */
  describe('the resend countdown against its frame', () => {
    function counting() {
      component.recoveryPhoneOptionAvailable = true
      component.showRecoveryPhoneCode()
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 27,
        sending: false,
      }
      fixture.detectChanges()
    }

    it('sets the countdown row in italic', () => {
      counting()
      const resend: HTMLElement = fixture.nativeElement.querySelector(
        '.recovery-phone-resend'
      )

      expect(resend.textContent).toContain('You can resend in')
      expect(getComputedStyle(resend).fontStyle).toBe('italic')
    })

    it('leaves the question above it upright, as the frames draw it', () => {
      counting()
      const heading: HTMLElement = fixture.nativeElement.querySelector(
        '.recovery-phone-resend__heading'
      )

      expect(getComputedStyle(heading).fontStyle).toBe('normal')
    })

    /*
     * The countdown's zero state is not in any frame. Left to inherit, the
     * resend link came out slanted - the one italic link anywhere in this
     * design - so it is held upright like every link the frames do draw.
     */
    it('keeps the resend link upright once the countdown runs out', () => {
      component.recoveryPhoneOptionAvailable = true
      component.showRecoveryPhoneCode()
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 0,
        sending: false,
      }
      fixture.detectChanges()
      const link = element('cy-resend-recovery-phone-code')

      expect(link).not.toBeNull()
      expect(getComputedStyle(link).fontStyle).toBe('normal')
    })
  })

  /*
   * PD-6042, the helper row. Measured off the frame exports rather than read
   * off the screen. In `pd-6042-01` and `pd-6042-08` the authenticator field's
   * "Helper text" frame is a single 18 px row at y=74, under an input that
   * ends at y=66, holding "Microcopy" at x=0 w=424 and "Limit" at x=432 w=20:
   * one row, hint on the left, counter on the right. `pd-6042-13`, `-14` and
   * `-15` draw the recovery number code field's rejection in that SAME single
   * row, at that same y=74 and in a field instance that is still 92 px tall -
   * the hint is gone, the message stands where the hint stood, the counter is
   * still on the right, and label, outline, message and counter are all red.
   * No frame in the set adds a row for an error, and none draws an icon inside
   * the helper row. The only frame in the whole evidence set that draws an
   * error icon is `pd-6046-05`, a panel-level failure notice, where it is an
   * `Icon/24px/Warning` on a banner - which is what the send-level row is.
   *
   * The build drew the counter alone on a right-floated line, the hint on a
   * line below it, an empty Material subscript wrapper above both, and put a
   * rejected code's message on a further row with an icon while leaving the
   * label and the outline untouched.
   *
   * `.no-hint` and the error outline tokens are global styles (material.scss),
   * which the app build's style list carries and this suite's does not, so
   * what is asserted of those here is that the class and the error state are
   * on the element. The row's own geometry comes from this component's
   * stylesheet and is measured directly.
   */
  describe('the helper row against its frame', () => {
    const helperOf = (id: string): HTMLElement =>
      fixture.nativeElement.querySelector(`#${id}`)

    function phoneCodeMode(value = '123456') {
      component.recoveryPhoneOptionAvailable = true
      component.showRecoveryPhoneCode()
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 30,
        sending: false,
      }
      component.recoveryPhoneCodeFormControl.setValue(value)
      fixture.detectChanges()
    }

    function answers(errorCode: string) {
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 30,
        sending: false,
        errorCode,
      }
      fixture.detectChanges()
    }

    it('puts the authenticator hint and its counter on one row', () => {
      const row = helperOf('totp-helper')
      expect(row).not.toBeNull()
      const message: HTMLElement = row.querySelector('.code-helper__message')
      const count: HTMLElement = row.querySelector('.code-helper__count')

      expect(message.textContent).toContain(
        'Enter the 6-digit code from your authentication app'
      )
      expect(count.textContent.trim()).toBe('0/6')
      expect(getComputedStyle(row).display).toBe('flex')
      // The float is what put the counter on a line of its own
      expect(getComputedStyle(count).float).toBe('none')
      const left = message.getBoundingClientRect()
      const right = count.getBoundingClientRect()
      expect(right.top).toBeLessThan(left.bottom)
      expect(right.left).toBeGreaterThan(left.left)
    })

    it('reserves no empty subscript row above either helper', () => {
      const authenticator: HTMLElement =
        fixture.nativeElement.querySelector('mat-form-field')
      expect(authenticator.classList).toContain('no-hint')

      phoneCodeMode()
      const phone: HTMLElement = element('recovery-phone-signin-code').closest(
        'mat-form-field'
      )
      expect(phone.classList).toContain('no-hint')
    })

    it('replaces the authenticator hint with its error, in the same row', () => {
      component.verificationFormControl.setValue('123')
      component.onSubmit()
      fixture.detectChanges()
      const row = helperOf('totp-helper')

      expect(row.textContent).not.toContain(
        'Enter the 6-digit code from your authentication app'
      )
      expect(row.textContent).toContain('Invalid authentication code length')
      expect(row.textContent).toContain('3/6')
      expect(row.querySelector('.code-helper__count').classList).toContain(
        'error'
      )
    })

    it('marks the field when the registry rejects a well-formed code', () => {
      phoneCodeMode()
      // Six digits: required, minLength and maxLength are all satisfied, so
      // nothing but the registry's answer can make this field wrong
      expect(component.recoveryPhoneCodeFormControl.valid).toBeTrue()
      expect(component.isRecoveryPhoneCodeInvalid).toBeFalse()

      answers('INVALID_CODE')

      expect(
        component.recoveryPhoneCodeFormControl.hasError('invalid')
      ).toBeTrue()
      expect(component.isRecoveryPhoneCodeInvalid).toBeTrue()
      expect(
        element('recovery-phone-signin-code').getAttribute('aria-invalid')
      ).toBe('true')
      expect(helperOf('recovery-phone-signin-code-label').classList).toContain(
        'error'
      )
    })

    it('replaces the hint with the rejection, in the same row', () => {
      phoneCodeMode()
      answers('INVALID_CODE')
      const row = helperOf('recovery-phone-signin-code-helper')

      expect(row.textContent).toContain('Invalid recovery number code')
      expect(row.textContent).not.toContain(
        'Enter the 6-digit verification code sent to your device'
      )
      expect(row.textContent).toContain('6/6')
      // No frame draws an icon inside the helper row
      expect(row.querySelector('mat-icon')).toBeNull()
      expect(row.querySelector('.code-helper__count').classList).toContain(
        'error'
      )
    })

    it('paints the label the red the outline is bound to', () => {
      phoneCodeMode()
      answers('INVALID_CODE')

      // _form-field-theme.scss:58-71 binds every error outline token to
      // state-warning-darkest, #b71c1c. A label one step lighter than the
      // outline beside it is the mismatch this replaces.
      expect(
        getComputedStyle(helperOf('recovery-phone-signin-code-label')).color
      ).toBe('rgb(183, 28, 28)')
    })

    it('paints every field label that same red', () => {
      component.verificationFormControl.setValue('123')
      component.onSubmit()
      fixture.detectChanges()
      const label: HTMLElement =
        fixture.nativeElement.querySelector('mat-label.error')

      expect(label).not.toBeNull()
      expect(getComputedStyle(label).color).toBe('rgb(183, 28, 28)')
    })

    it('drives the outline off the same flag as the label', () => {
      phoneCodeMode()
      const control = component.recoveryPhoneCodeFormControl

      expect(component.errorMatcher.isErrorState(control)).toBe(
        component.isRecoveryPhoneCodeInvalid
      )

      answers('INVALID_CODE')

      expect(component.errorMatcher.isErrorState(control)).toBe(
        component.isRecoveryPhoneCodeInvalid
      )
      expect(component.errorMatcher.isErrorState(control)).toBeTrue()
    })

    it('takes the field-level codes out of the icon row', () => {
      for (const code of [
        'INVALID_CODE',
        'CODE_EXPIRED',
        'TOO_MANY_ATTEMPTS',
      ]) {
        phoneCodeMode()
        answers(code)

        expect(component.recoveryPhoneErrorMessage).withContext(code).toBeNull()
        expect(fixture.nativeElement.querySelector('.recovery-phone-error'))
          .withContext(code)
          .toBeNull()
        expect(component.recoveryPhoneFieldErrorMessage)
          .withContext(code)
          .not.toBeNull()
      }
    })

    it('keeps the send-level codes in their own row, icon and all', () => {
      for (const code of [
        'NO_RECOVERY_PHONE',
        'SEND_LIMIT_REACHED',
        'SMS_SEND_FAILED',
        'BAD_CREDENTIALS',
      ]) {
        phoneCodeMode()
        answers(code)
        const alert: HTMLElement = fixture.nativeElement.querySelector(
          '.recovery-phone-error'
        )

        expect(alert).withContext(code).not.toBeNull()
        expect(alert.querySelector('mat-icon')).withContext(code).not.toBeNull()
        // A send that failed says nothing about the code in the field
        expect(component.recoveryPhoneCodeFormControl.hasError('invalid'))
          .withContext(code)
          .toBeFalse()
        expect(helperOf('recovery-phone-signin-code-helper').textContent)
          .withContext(code)
          .toContain('Enter the 6-digit verification code sent to your device')
      }
    })

    /*
     * The resend countdown pushes a whole new state object every second and
     * spreads the old one into it, errorCode included (form-sign-in's
     * startRecoveryPhoneCountdown). A verdict is a verdict on one code at one
     * moment, so it is applied when it ARRIVES and not on every echo of it -
     * otherwise a user typing a fresh code has the field marked wrong again a
     * second later, and again, until the countdown runs out.
     */
    it('does not put the rejection back while the countdown ticks', () => {
      phoneCodeMode()
      answers('INVALID_CODE')
      expect(component.isRecoveryPhoneCodeInvalid).toBeTrue()

      component.recoveryPhoneCodeFormControl.setValue('654321')
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 29,
        sending: false,
        errorCode: 'INVALID_CODE',
      }
      fixture.detectChanges()

      expect(
        component.recoveryPhoneCodeFormControl.hasError('invalid')
      ).toBeFalse()
      expect(component.isRecoveryPhoneCodeInvalid).toBeFalse()
      expect(
        helperOf('recovery-phone-signin-code-helper').textContent
      ).toContain('Enter the 6-digit verification code sent to your device')
    })

    it('lets the rejection go the moment the code is edited', () => {
      phoneCodeMode()
      answers('INVALID_CODE')
      expect(component.isRecoveryPhoneCodeInvalid).toBeTrue()

      component.recoveryPhoneCodeFormControl.setValue('123457')
      fixture.detectChanges()

      expect(
        component.recoveryPhoneCodeFormControl.hasError('invalid')
      ).toBeFalse()
      expect(component.isRecoveryPhoneCodeInvalid).toBeFalse()
      expect(
        helperOf('recovery-phone-signin-code-helper').textContent
      ).toContain('Enter the 6-digit verification code sent to your device')
    })
  })
})
