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

describe('TwoFactorAuthenticationFormComponent', () => {
  let component: TwoFactorAuthenticationFormComponent
  let fixture: ComponentFixture<TwoFactorAuthenticationFormComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
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
  })

  describe('error codes', () => {
    function messageFor(errorCode: string): string | null {
      component.recoveryPhoneState = {
        codeSent: true,
        resendSeconds: 0,
        sending: false,
        errorCode,
      }
      return component.recoveryPhoneErrorMessage
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

    it('stops offering a resend once the daily cap is reached', () => {
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
      expect(component.recoveryPhoneResendIsWorthOffering).toBeTrue()
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
})
