import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { AuthChallengeComponent } from './auth-challenge.component'
import { By } from '@angular/platform-browser'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import '@angular/localize/init'
import { Subject } from 'rxjs'
import {
  AuthChallengeRecoveryPhone,
  AuthChallengeRecoveryPhoneVerification,
} from './auth-challenge.types'

describe('AuthChallengeComponent', () => {
  let fixture: ComponentFixture<AuthChallengeComponent>
  let component: AuthChallengeComponent
  let form: FormGroup
  let mockDialogRef: any
  let mockDialogData: any

  beforeEach(async () => {
    form = new FormGroup({
      passwordControl: new FormControl(''),
      twoFactorCode: new FormControl(''),
      twoFactorRecoveryCode: new FormControl(''),
      twoFactorRecoveryPhoneCode: new FormControl(''),
    })

    mockDialogRef = {
      updateSize: jasmine.createSpy('updateSize'),
      close: jasmine.createSpy('close'),
    }

    mockDialogData = {
      parentForm: form,
      showPasswordField: true,
      showTwoFactorField: true,
      showHelpText: true,
      codeControlName: 'twoFactorCode',
      recoveryControlName: 'twoFactorRecoveryCode',
      passwordControlName: 'passwordControl',
      actionDescription: 'login',
    }

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, AuthChallengeComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(AuthChallengeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create and set default size', () => {
    expect(component).toBeTruthy()
    expect(mockDialogRef.updateSize).toHaveBeenCalledWith('580px')
  })

  describe('Initialization', () => {
    it('should set Validators.required on the 2FA Code by default and mark as untouched', () => {
      const codeControl = form.get('twoFactorCode')
      const recoveryControl = form.get('twoFactorRecoveryCode')

      codeControl?.setValue('')
      expect(codeControl?.hasError('required')).toBeTrue()
      expect(codeControl?.touched).toBeFalse()

      recoveryControl?.setValue('')
      expect(recoveryControl?.hasError('required')).toBeFalse()
    })
  })

  describe('Toggling Recovery Code Mode', () => {
    it('should switch to Recovery mode when toggle link is clicked', fakeAsync(() => {
      const toggleLink = fixture.debugElement.query(
        By.css('[data-testid="recovery-toggle"]')
      ).nativeElement

      toggleLink.click()
      fixture.detectChanges()
      tick()

      expect(component.showRecoveryCode).toBeTrue()

      const codeControl = form.get('twoFactorCode')
      const recoveryControl = form.get('twoFactorRecoveryCode')

      codeControl?.setValue('')
      expect(codeControl?.hasError('required')).toBeFalse()

      recoveryControl?.setValue('')
      expect(recoveryControl?.hasError('required')).toBeTrue()

      const recoveryInput = fixture.debugElement.query(
        By.css('#twoFactorRecoveryCode')
      )
      const codeInput = fixture.debugElement.query(By.css('#twoFactorCode'))

      expect(recoveryInput).toBeTruthy()
      expect(codeInput).toBeFalsy()
    }))

    it('should focus the input when switching modes', fakeAsync(() => {
      component.toggleRecoveryCode(new Event('click'))

      fixture.detectChanges()
      tick()

      const recoveryInputEl = fixture.debugElement.query(
        By.css('#twoFactorRecoveryCode')
      ).nativeElement

      expect(document.activeElement).toBe(recoveryInputEl)
    }))

    it('should clear values when switching modes', () => {
      form.get('twoFactorCode')?.setValue('123456')
      component.toggleRecoveryCode(new Event('click'))
      expect(form.get('twoFactorCode')?.value).toBeNull()
    })
  })

  describe('Backend Response Handling', () => {
    it('should apply backend error to password control', () => {
      component.processBackendResponse({ invalidPassword: true })

      const control = form.get('passwordControl')
      expect(control?.hasError('invalid')).toBeTrue()
    })

    it('should apply backend error to 2FA code', () => {
      component.processBackendResponse({ invalidTwoFactorCode: true })

      const control = form.get('twoFactorCode')
      expect(control?.hasError('invalid')).toBeTrue()
    })

    it('should apply backend error to Recovery code', () => {
      component.processBackendResponse({ invalidTwoFactorRecoveryCode: true })

      const control = form.get('twoFactorRecoveryCode')
      expect(control?.hasError('invalid')).toBeTrue()
    })
  })

  describe('Component properties (formerly Dialog Data @Input)', () => {
    it('should hide two-factor field if showTwoFactorField is false', () => {
      // Set on the component property directly — the template binds to this,
      // not to data, since ngOnInit already copied data into component fields
      component.showTwoFactorField = false
      fixture.detectChanges()

      const codeInput = fixture.debugElement.query(By.css('#twoFactorCode'))
      expect(codeInput).toBeFalsy()
    })

    it('should hide password field if showPasswordField is false', () => {
      component.showPasswordField = false
      fixture.detectChanges()

      const passwordInput = fixture.debugElement.query(By.css('#password'))
      expect(passwordInput).toBeFalsy()
    })
  })

  describe('Submission & Cleanup', () => {
    it('should emit submitAttempt and trigger loading state on submit', () => {
      spyOn(component.submitAttempt, 'emit')
      component.onSubmit()

      expect(component.loading).toBeTrue()
      expect(component.submitAttempt.emit).toHaveBeenCalled()
    })

    it('should clear forms and remove validators on destroy', () => {
      component.ngOnDestroy()

      const codeControl = form.get('twoFactorCode')
      const recoveryControl = form.get('twoFactorRecoveryCode')

      expect(codeControl?.value).toBeNull()
      expect(recoveryControl?.value).toBeNull()

      expect(codeControl?.hasValidator(Validators.required)).toBeFalse()
      expect(recoveryControl?.hasValidator(Validators.required)).toBeFalse()
    })
  })

  describe('Recovery phone number mode', () => {
    const SEND_TOGGLE = '#cy-challenge-send-recovery-phone-code'
    const PHONE_CODE_INPUT = '#twoFactorRecoveryPhoneCode'

    let verifyAnswer: Subject<AuthChallengeRecoveryPhoneVerification>
    let recoveryPhone: AuthChallengeRecoveryPhone

    beforeEach(() => {
      verifyAnswer = new Subject<AuthChallengeRecoveryPhoneVerification>()
      recoveryPhone = {
        available: true,
        maskedNumber: '***********1234',
        codeSent: false,
        resendSeconds: 0,
        sending: false,
        errorCode: undefined,
        used: false,
        sendCode: jasmine.createSpy('sendCode'),
        verify: jasmine
          .createSpy('verify')
          .and.returnValue(verifyAnswer.asObservable()),
        dispose: jasmine.createSpy('dispose'),
      }
    })

    /** Hands the component the option, the way a host's dialog data would. */
    function offer(available = true): void {
      recoveryPhone.available = available
      component.recoveryPhone = recoveryPhone
      fixture.detectChanges()
    }

    function enterPhoneMode(): void {
      offer()
      component.sendRecoveryPhoneCode(new Event('click'))
      fixture.detectChanges()
    }

    function text(): string {
      return fixture.nativeElement.textContent
    }

    it('says nothing about a recovery phone number when there is no option', () => {
      expect(fixture.debugElement.query(By.css(SEND_TOGGLE))).toBeFalsy()
      expect(text()).toContain('ORCID help centre')
    })

    it('stays silent when the account cannot use the option', () => {
      offer(false)

      expect(fixture.debugElement.query(By.css(SEND_TOGGLE))).toBeFalsy()
      expect(text()).toContain('ORCID help centre')
    })

    it('offers the option in place of the help centre link once it is available', () => {
      offer()

      expect(fixture.debugElement.query(By.css(SEND_TOGGLE))).toBeTruthy()
      expect(text()).toContain("Don't have your device or your recovery codes?")
      expect(text()).toContain(
        'Send a code to your recovery phone number and disable 2FA'
      )
      expect(text()).not.toContain('ORCID help centre')
    })

    it('asks for a text and swaps the authentication app field for the code field', fakeAsync(() => {
      offer()

      fixture.debugElement.query(By.css(SEND_TOGGLE)).nativeElement.click()
      fixture.detectChanges()
      tick()

      expect(recoveryPhone.sendCode).toHaveBeenCalled()
      expect(fixture.debugElement.query(By.css(PHONE_CODE_INPUT))).toBeTruthy()
      expect(fixture.debugElement.query(By.css('#twoFactorCode'))).toBeFalsy()
      expect(text()).toContain('Recovery phone number code')
      expect(text()).toContain('Enter the 6-digit code sent to your device')
      expect(form.get('twoFactorCode')?.hasError('required')).toBeFalse()
      expect(
        form.get('twoFactorRecoveryPhoneCode')?.hasError('required')
      ).toBeTrue()
    }))

    it('holds submitAttempt back until the registry has accepted the code', fakeAsync(() => {
      enterPhoneMode()
      tick()
      const emit = spyOn(component.submitAttempt, 'emit')
      form.get('passwordControl')?.setValue('a-password')
      form.get('twoFactorRecoveryPhoneCode')?.setValue('123456')

      component.onSubmit()

      // The guarded action must not run on a code that has not been checked
      expect(recoveryPhone.verify).toHaveBeenCalledWith('a-password', '123456')
      expect(emit).not.toHaveBeenCalled()

      verifyAnswer.next('passed')
      verifyAnswer.complete()

      // 2FA is off from here, which is the only reason the host may now
      // proceed on the password alone
      expect(recoveryPhone.used).toBeTrue()
      expect(emit).toHaveBeenCalled()
      expect(form.get('twoFactorRecoveryPhoneCode')?.value).toBeNull()
      expect(form.get('twoFactorCode')?.value).toBeNull()
    }))

    it('keeps the challenge open and marks the code invalid when it is refused', fakeAsync(() => {
      enterPhoneMode()
      tick()
      const emit = spyOn(component.submitAttempt, 'emit')
      form.get('passwordControl')?.setValue('a-password')
      form.get('twoFactorRecoveryPhoneCode')?.setValue('000000')

      component.onSubmit()
      verifyAnswer.next('invalidCode')
      fixture.detectChanges()

      expect(emit).not.toHaveBeenCalled()
      expect(recoveryPhone.used).toBeFalse()
      expect(component.loading).toBeFalse()
      expect(
        form.get('twoFactorRecoveryPhoneCode')?.hasError('invalid')
      ).toBeTrue()
      expect(text()).toContain('Invalid recovery phone number code')
    }))

    it('reports a send that never got through', fakeAsync(() => {
      enterPhoneMode()
      tick()
      recoveryPhone.errorCode = 'SMS_SEND_FAILED'
      fixture.detectChanges()

      const error = fixture.debugElement.query(
        By.css('#twoFactorRecoveryPhoneCode-send-error')
      )
      expect(error).toBeTruthy()
      expect(error.nativeElement.getAttribute('role')).toBe('alert')
    }))

    it('says when the account has asked for too many codes today', fakeAsync(() => {
      enterPhoneMode()
      tick()
      recoveryPhone.errorCode = 'SEND_LIMIT_REACHED'
      fixture.detectChanges()

      const error = fixture.debugElement.query(
        By.css('#twoFactorRecoveryPhoneCode-send-error')
      )
      expect(error).toBeTruthy()
      expect(error.nativeElement.getAttribute('role')).toBe('alert')
      // "try again" is the wrong advice for a cap that lifts tomorrow
      expect(error.nativeElement.textContent).toContain(
        'Too many codes have been sent to your recovery phone number today'
      )
      expect(error.nativeElement.textContent).not.toContain(
        'We could not send a code'
      )
    }))

    it('stops offering a resend once the daily cap is reached', fakeAsync(() => {
      enterPhoneMode()
      tick()
      recoveryPhone.codeSent = true
      recoveryPhone.resendSeconds = 0
      recoveryPhone.errorCode = 'SEND_LIMIT_REACHED'
      fixture.detectChanges()

      //the offer and the question above it both go: neither has an answer today
      expect(
        fixture.debugElement.query(
          By.css('[data-testid="recovery-phone-resend"]')
        )
      ).toBeNull()
      expect(text()).not.toContain("Didn't get the code?")
    }))

    it('still offers the way back to the authentication app at the cap', fakeAsync(() => {
      // Phone mode outranks every other input, and this button is the only
      // thing that leaves it. Hiding it along with the resend left a user who
      // reached the cap on a screen whose only field takes a code that can no
      // longer be sent, with no route to their app or their recovery codes.
      enterPhoneMode()
      tick()
      recoveryPhone.codeSent = true
      recoveryPhone.resendSeconds = 0
      recoveryPhone.errorCode = 'SEND_LIMIT_REACHED'
      fixture.detectChanges()

      const back = fixture.debugElement.query(
        By.css('[data-testid="recovery-phone-back-toggle"]')
      )
      expect(back).not.toBeNull()
      expect(back.nativeElement.textContent).toContain(
        'Use your authentication app instead'
      )

      back.nativeElement.click()
      fixture.detectChanges()

      expect(component.showRecoveryPhoneCode).toBeFalse()
    }))

    it('keeps the ordinary send failure message for every other code', fakeAsync(() => {
      enterPhoneMode()
      tick()
      recoveryPhone.errorCode = 'SMS_SEND_FAILED'
      fixture.detectChanges()

      expect(
        fixture.debugElement.query(
          By.css('#twoFactorRecoveryPhoneCode-send-error')
        ).nativeElement.textContent
      ).toContain('We could not send a code to your recovery phone number')
    }))

    it('counts the resend buffer down and offers a resend when it runs out', fakeAsync(() => {
      enterPhoneMode()
      tick()
      recoveryPhone.resendSeconds = 12
      fixture.detectChanges()

      expect(text()).toContain('You can resend in')
      expect(text()).toContain('12')
      expect(
        fixture.debugElement.query(
          By.css('[data-testid="recovery-phone-resend"]')
        )
      ).toBeFalsy()

      recoveryPhone.resendSeconds = 0
      fixture.detectChanges()

      const resend = fixture.debugElement.query(
        By.css('[data-testid="recovery-phone-resend"]')
      )
      expect(resend).toBeTruthy()
      resend.nativeElement.click()
      expect(recoveryPhone.sendCode).toHaveBeenCalledTimes(2)
    }))

    it('blames the password rather than the code when the password was wrong (R5.2)', fakeAsync(() => {
      enterPhoneMode()
      tick()
      const emit = spyOn(component.submitAttempt, 'emit')
      form.get('passwordControl')?.setValue('not-the-password')
      form.get('twoFactorRecoveryPhoneCode')?.setValue('123456')

      component.onSubmit()
      verifyAnswer.next('invalidPassword')
      fixture.detectChanges()

      // The registry checks the password first, so no attempt was spent and
      // the code the user typed is still the right one
      expect(form.get('passwordControl')?.hasError('invalid')).toBeTrue()
      expect(
        form.get('twoFactorRecoveryPhoneCode')?.hasError('invalid')
      ).toBeFalse()
      expect(form.get('twoFactorRecoveryPhoneCode')?.value).toBe('123456')
      expect(component.loading).toBeFalse()
      expect(emit).not.toHaveBeenCalled()
      expect(text()).toContain('The password does not match our records')
    }))

    it('holds the challenge shut while the registry is deciding (R5.4)', fakeAsync(() => {
      enterPhoneMode()
      tick()
      form.get('passwordControl')?.setValue('a-password')
      form.get('twoFactorRecoveryPhoneCode')?.setValue('123456')

      component.onSubmit()
      fixture.detectChanges()

      // A pass has already disabled 2FA and deleted the number by the time it
      // answers; walking away aborts the request and undoes none of it
      expect(component.verifying).toBeTrue()
      expect(
        fixture.debugElement.query(By.css('#cy-cancel-account-verification'))
          .nativeElement.disabled
      ).toBeTrue()
      expect(mockDialogRef.disableClose).toBeTrue()

      component.onCancel()
      expect(mockDialogRef.close).not.toHaveBeenCalled()

      verifyAnswer.next('passed')
      verifyAnswer.complete()
      fixture.detectChanges()

      expect(component.verifying).toBeFalse()
      expect(mockDialogRef.disableClose).toBeFalse()
    }))

    it('stops whatever the handle was running when the challenge closes', () => {
      offer()

      component.ngOnDestroy()

      expect(recoveryPhone.dispose).toHaveBeenCalled()
    })

    it('announces the send once and leaves the countdown out of the live region', fakeAsync(() => {
      enterPhoneMode()
      tick()
      recoveryPhone.codeSent = true
      // the announcement names the number the code went to, so the template
      // deliberately says nothing until it has one -- announcing "sent to"
      // with nothing after it would be worse than staying quiet
      recoveryPhone.maskedNumber = '***********0123'
      recoveryPhone.resendSeconds = 12
      fixture.detectChanges()

      // Scoped to OUR region on purpose: Angular Material's form-field renders
      // its own aria-live="polite" hint wrapper earlier in the DOM, so a bare
      // [aria-live] query returns that one, and every assertion below would
      // then pass or fail for reasons nothing to do with this component.
      const live = fixture.debugElement.query(
        By.css('p.visually-hidden[aria-live="polite"]')
      )
      expect(live.nativeElement.textContent).toContain(
        'Verification code sent to'
      )
      // the number changes every second: re-reading the sentence each tick
      // would talk over the user typing the code
      expect(live.nativeElement.textContent).not.toContain('You can resend in')
      expect(live.nativeElement.textContent).not.toContain('seconds')

      const counter = fixture.debugElement
        .queryAll(By.css('p'))
        .find((p) => p.nativeElement.textContent.includes('You can resend in'))
      expect(counter).toBeTruthy()
      expect(counter!.nativeElement.getAttribute('aria-hidden')).toBe('true')
    }))

    describe('which control holds the account password', () => {
      /**
       * The change-password form: `password` is the *new* password the user is
       * choosing, and the account password is `oldPassword`.
       */
      let changePasswordForm: FormGroup

      function rebuildWith(data: Record<string, unknown>): {
        fixture: ComponentFixture<AuthChallengeComponent>
        component: AuthChallengeComponent
      } {
        Object.assign(mockDialogData, data)
        const rebuilt = TestBed.createComponent(AuthChallengeComponent)
        rebuilt.componentInstance.recoveryPhone = recoveryPhone
        rebuilt.detectChanges()
        return { fixture: rebuilt, component: rebuilt.componentInstance }
      }

      beforeEach(() => {
        changePasswordForm = new FormGroup({
          oldPassword: new FormControl('the-account-password'),
          password: new FormControl('the-new-password'),
          twoFactorCode: new FormControl(''),
          twoFactorRecoveryCode: new FormControl(''),
          twoFactorRecoveryPhoneCode: new FormControl(''),
        })
      })

      it('does not offer the option when no host has said which one it is', () => {
        const rebuilt = rebuildWith({
          parentForm: changePasswordForm,
          showPasswordField: false,
          passwordControlName: undefined,
        })

        // `password` exists here, so the default would have been read happily
        expect(rebuilt.component.recoveryPhoneAvailable).toBeFalse()
        expect(
          rebuilt.fixture.debugElement.query(By.css(SEND_TOGGLE))
        ).toBeFalsy()
      })

      it('posts the account password once the host has named it', fakeAsync(() => {
        const rebuilt = rebuildWith({
          parentForm: changePasswordForm,
          showPasswordField: false,
          passwordControlName: 'oldPassword',
        })
        expect(rebuilt.component.recoveryPhoneAvailable).toBeTrue()

        rebuilt.component.sendRecoveryPhoneCode(new Event('click'))
        rebuilt.fixture.detectChanges()
        tick()
        changePasswordForm.get('twoFactorRecoveryPhoneCode')?.setValue('123456')

        rebuilt.component.onSubmit()

        expect(recoveryPhone.verify).toHaveBeenCalledWith(
          'the-account-password',
          '123456'
        )
      }))
    })

    it('goes back to the authentication app', fakeAsync(() => {
      enterPhoneMode()
      tick()

      fixture.debugElement
        .query(By.css('[data-testid="recovery-phone-back-toggle"]'))
        .nativeElement.click()
      fixture.detectChanges()
      tick()

      expect(component.showRecoveryPhoneCode).toBeFalse()
      expect(fixture.debugElement.query(By.css('#twoFactorCode'))).toBeTruthy()
      expect(fixture.debugElement.query(By.css(PHONE_CODE_INPUT))).toBeFalsy()
      expect(form.get('twoFactorRecoveryPhoneCode')?.value).toBeNull()
      expect(form.get('twoFactorCode')?.hasError('required')).toBeTrue()
    }))
  })
})
