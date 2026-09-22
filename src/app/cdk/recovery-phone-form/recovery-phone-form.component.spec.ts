import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  tick,
} from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { Subject, of, throwError } from 'rxjs'

import { RecoveryPhoneFormComponent } from './recovery-phone-form.component'
import { TwoFactorAuthenticationService } from '../../core/two-factor-authentication/two-factor-authentication.service'
import { RecoveryPhoneSaveResponse } from '../../types/two-factor.endpoint'

describe('RecoveryPhoneFormComponent', () => {
  let component: RecoveryPhoneFormComponent
  let fixture: ComponentFixture<RecoveryPhoneFormComponent>
  let twoFactorService: jasmine.SpyObj<TwoFactorAuthenticationService>

  /** Puts the form in the state a user reaches after a successful send. */
  function sendCodeSuccessfully(seconds = 30) {
    twoFactorService.sendRecoveryPhoneCode.and.returnValue(
      of({ success: true, resendAfterSeconds: seconds })
    )
    component.form.get('phoneNumber')?.setValue('+441234567890')
    component.sendCode()
  }

  beforeEach(async () => {
    twoFactorService = jasmine.createSpyObj('TwoFactorAuthenticationService', [
      'sendRecoveryPhoneCode',
      'saveRecoveryPhone',
    ])

    await TestBed.configureTestingModule({
      imports: [RecoveryPhoneFormComponent],
      providers: [
        { provide: TwoFactorAuthenticationService, useValue: twoFactorService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(RecoveryPhoneFormComponent)
    // The phone field fetches intl-tel-input's utils as a lazy webpack chunk the first
    // time it renders. Under fakeAsync the clock is frozen, so that fetch can never
    // resolve and surfaces as a ChunkLoadError from whichever test happens to be
    // fakeAsync -- nothing to do with what that test is checking. None of these tests
    // exercise the library's formatting, so the loader is stubbed for all of them.
    component = fixture.componentInstance
    component.loadUtils = () => Promise.resolve({} as never)
  })

  afterEach(() => {
    // the resend countdown is a live interval; it dies with the component
    component?.ngOnDestroy()
  })

  it('announces itself once the phone field translations are in', () => {
    const ready = jasmine.createSpy('ready')
    component.ready.subscribe(ready)

    fixture.detectChanges()

    expect(component.translationsReady).toBeTrue()
    expect(ready).toHaveBeenCalled()
  })

  it('keeps the element ids the rest of the suite targets', () => {
    fixture.detectChanges()

    expect(
      fixture.debugElement.query(By.css('#cy-send-verification-code'))
    ).toBeTruthy()
    expect(
      fixture.debugElement.query(By.css('#recovery-phone-code'))
    ).toBeTruthy()
    expect(
      fixture.nativeElement.querySelector('#recovery-phone-number')
    ).toBeTruthy()
  })

  it('drops the heading and the help line when the host prints its own', () => {
    component.showHeading = false
    fixture.detectChanges()

    const text = fixture.nativeElement.textContent
    expect(text).not.toContain('Your recovery phone number')
    expect(text).not.toContain('Select a country or location')
    // the field itself is still there
    expect(
      fixture.nativeElement.querySelector('#recovery-phone-number')
    ).toBeTruthy()
  })

  it('tells the registry which flow asked for the number', () => {
    fixture.detectChanges()
    component.context = 'INTERSTITIAL'
    sendCodeSuccessfully()

    expect(twoFactorService.sendRecoveryPhoneCode).toHaveBeenCalledWith(
      jasmine.objectContaining({ context: 'INTERSTITIAL' })
    )
  })

  it('defaults to the account settings flow', () => {
    fixture.detectChanges()
    sendCodeSuccessfully()

    expect(twoFactorService.sendRecoveryPhoneCode).toHaveBeenCalledWith(
      jasmine.objectContaining({ context: 'SETTINGS' })
    )
  })

  it('enables the code field, starts the countdown and says a code is out', () => {
    fixture.detectChanges()
    const codeSentChange = jasmine.createSpy('codeSentChange')
    component.codeSentChange.subscribe(codeSentChange)

    sendCodeSuccessfully()

    expect(component.codeSent).toBeTrue()
    expect(codeSentChange).toHaveBeenCalledWith(true)
    expect(component.verificationCodeControl?.enabled).toBeTrue()
    expect(component.resendCountdown).toBe(30)
    // the number is locked while a code is outstanding
    expect(component.phoneNumberControl?.disabled).toBeTrue()
  })

  /*
   * PD-6044. `pd-6044-02` draws the send control washed out while the resend
   * countdown runs, and `pd-6044-01`/`pd-6044-07` draw it at full strength.
   * The control was already disabled -- the probe carries
   * `mat-mdc-button-disabled` in all three -- but the component's own
   * `.send-code__button` rule ties Material's
   * `.mat-mdc-unelevated-button.mat-mdc-button-disabled` on specificity and
   * wins on source order, so every state came out the same teal.
   *
   * Measured off the frame with Pillow: the container is #b5ced6, which is
   * brand-secondary-dark #085c77 at 30% over white, and the label stays #fff.
   */
  describe('the send control while the resend countdown runs', () => {
    function sendButton(): HTMLButtonElement {
      return fixture.nativeElement.querySelector('#cy-send-verification-code')
    }

    /** Chrome reports a mixed colour as `color(srgb ...)`, a plain one as `rgb()`. */
    function rgb255(value: string): string {
      const srgb = value.match(/^color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)/)
      if (!srgb) {
        return value
      }
      const [r, g, b] = srgb.slice(1).map((n) => Math.round(Number(n) * 255))
      return `rgb(${r}, ${g}, ${b})`
    }

    it('stops drawing itself as though it were still pressable', () => {
      fixture.detectChanges()
      const enabled = rgb255(getComputedStyle(sendButton()).backgroundColor)
      expect(enabled).toBe('rgb(8, 92, 119)')

      sendCodeSuccessfully()
      fixture.detectChanges()

      expect(sendButton().disabled).toBeTrue()
      expect(rgb255(getComputedStyle(sendButton()).backgroundColor)).not.toBe(
        enabled
      )
    })

    it('draws the washed container and white label the frame measures', () => {
      fixture.detectChanges()
      sendCodeSuccessfully()
      fixture.detectChanges()

      const style = getComputedStyle(sendButton())
      expect(rgb255(style.backgroundColor)).toBe('rgb(181, 206, 214)')
      expect(rgb255(style.color)).toBe('rgb(255, 255, 255)')
    })
  })

  it('counts the resend buffer down and frees the number again', fakeAsync(() => {
    fixture.detectChanges()
    sendCodeSuccessfully(2)

    tick(2000)

    expect(component.resendCountdown).toBe(0)
    expect(component.phoneNumberControl?.enabled).toBeTrue()
    component.ngOnDestroy()
  }))

  it('restarts the countdown cleanly on a second send', fakeAsync(() => {
    fixture.detectChanges()
    sendCodeSuccessfully(3)
    tick(3000)

    component.sendCode()
    tick(1000)

    // one tick, one second gone: a leftover countdown would double the rate
    expect(component.resendCountdown).toBe(2)
    component.ngOnDestroy()
  }))

  it('names the problem the phone field already found, rather than calling it required', () => {
    fixture.detectChanges()
    const control = component.form.get('phoneNumber')
    control?.setValue('+441234')
    control?.setErrors({ invalidPhone: 'IS_POSSIBLE_LOCAL_ONLY' })

    component.sendCode()

    expect(component.phoneErrorMessage).toBe('Phone number is too short')
    expect(twoFactorService.sendRecoveryPhoneCode).not.toHaveBeenCalled()
  })

  it('still asks for a number when the field is empty', () => {
    fixture.detectChanges()

    component.sendCode()

    expect(component.phoneErrorMessage).toBe('Phone number is required')
  })

  it('shows the length problem the server reports for the number', () => {
    fixture.detectChanges()
    twoFactorService.sendRecoveryPhoneCode.and.returnValue(
      of({
        success: false,
        errorCode: 'PHONE_TOO_SHORT',
        resendAfterSeconds: 0,
      })
    )
    component.form.get('phoneNumber')?.setValue('+441234')

    component.sendCode()

    expect(component.phoneErrorMessage).toBe('Phone number is too short')
    expect(component.codeSent).toBeFalse()
  })

  it('explains a refused resend when there is no code on screen to explain it', fakeAsync(() => {
    fixture.detectChanges()
    twoFactorService.sendRecoveryPhoneCode.and.returnValue(
      of({
        success: false,
        errorCode: 'RESEND_TOO_SOON',
        resendAfterSeconds: 2,
      })
    )
    component.form.get('phoneNumber')?.setValue('+441234567890')

    component.sendCode()

    // no code was sent in this session, so the countdown beside one is not
    // rendered and the disabled send button would be the only signal
    expect(component.codeSent).toBeFalse()
    expect(component.generalErrorMessage).toBe(
      'A code was sent to this number a moment ago. Please wait before requesting another.'
    )

    tick(2000)
    expect(component.resendCountdown).toBe(0)
    expect(component.generalErrorMessage).toBeNull()
    discardPeriodicTasks()
  }))

  it('leaves the countdown to speak for itself when a code is on screen', fakeAsync(() => {
    fixture.detectChanges()
    sendCodeSuccessfully(30)
    twoFactorService.sendRecoveryPhoneCode.and.returnValue(
      of({
        success: false,
        errorCode: 'RESEND_TOO_SOON',
        resendAfterSeconds: 12,
      })
    )

    component.sendCode()

    expect(component.codeSent).toBeTrue()
    expect(component.generalErrorMessage).toBeNull()
    expect(component.resendCountdown).toBe(12)
    discardPeriodicTasks()
  }))

  it('says the account has asked for too many codes today', () => {
    fixture.detectChanges()
    const failed = jasmine.createSpy('failed')
    component.failed.subscribe(failed)
    twoFactorService.sendRecoveryPhoneCode.and.returnValue(
      of({
        success: false,
        errorCode: 'SEND_LIMIT_REACHED',
        resendAfterSeconds: 0,
      })
    )
    component.form.get('phoneNumber')?.setValue('+441234567890')

    component.sendCode()

    expect(component.generalErrorMessage).toBe(
      'Too many verification codes have been requested for this account today. Please try again tomorrow.'
    )
    // it belongs to neither field, and it is not a reason to leave the form
    expect(component.phoneErrorMessage).toBeNull()
    expect(component.codeErrorMessage).toBeNull()
    expect(component.codeSent).toBeFalse()
    expect(failed).not.toHaveBeenCalled()
  })

  it('keeps the user on the form when the text never goes out', () => {
    fixture.detectChanges()
    const failed = jasmine.createSpy('failed')
    component.failed.subscribe(failed)
    twoFactorService.sendRecoveryPhoneCode.and.returnValue(
      throwError(() => new Error('boom'))
    )
    component.form.get('phoneNumber')?.setValue('+441234567890')

    component.sendCode()

    expect(component.generalErrorMessage).toBe(
      'We could not send a verification code. Please try again.'
    )
    expect(failed).not.toHaveBeenCalled()
  })

  it('asks for a code before saving', () => {
    fixture.detectChanges()

    component.save()

    expect(component.codeErrorMessage).toBe('A verification code is required')
    expect(twoFactorService.saveRecoveryPhone).not.toHaveBeenCalled()
  })

  it('rejects a code that is not six digits', () => {
    fixture.detectChanges()
    component.verificationCodeControl?.enable()
    component.verificationCodeControl?.setValue('12345')

    component.save()

    expect(component.codeErrorMessage).toBe('Invalid verification code length')
    expect(twoFactorService.saveRecoveryPhone).not.toHaveBeenCalled()
  })

  it('hands the whole saved response to its host', () => {
    fixture.detectChanges()
    const response: RecoveryPhoneSaveResponse = {
      success: true,
      maskedRecoveryPhoneNumber: '***********1234',
    }
    const saved = jasmine.createSpy('saved')
    component.saved.subscribe(saved)
    component.context = 'ONBOARDING'
    component.verificationCodeControl?.enable()
    component.verificationCodeControl?.setValue('123456')
    twoFactorService.saveRecoveryPhone.and.returnValue(of(response))

    component.save()

    expect(twoFactorService.saveRecoveryPhone).toHaveBeenCalledWith(
      jasmine.objectContaining({
        verificationCode: '123456',
        context: 'ONBOARDING',
      })
    )
    expect(saved).toHaveBeenCalledWith(response)
  })

  it('posts once, however often the host presses its button', () => {
    fixture.detectChanges()
    const pending = new Subject<RecoveryPhoneSaveResponse>()
    twoFactorService.saveRecoveryPhone.and.returnValue(pending.asObservable())
    component.verificationCodeControl?.enable()
    component.verificationCodeControl?.setValue('123456')

    component.save()
    component.save()

    expect(twoFactorService.saveRecoveryPhone).toHaveBeenCalledTimes(1)
  })

  it('reports a rejected code without telling the host anything failed', () => {
    fixture.detectChanges()
    const failed = jasmine.createSpy('failed')
    const saved = jasmine.createSpy('saved')
    component.failed.subscribe(failed)
    component.saved.subscribe(saved)
    component.verificationCodeControl?.enable()
    component.verificationCodeControl?.setValue('000000')
    twoFactorService.saveRecoveryPhone.and.returnValue(
      of({ success: false, errorCode: 'INVALID_CODE' })
    )

    component.save()

    expect(component.codeErrorMessage).toBe('Invalid verification code')
    expect(failed).not.toHaveBeenCalled()
    expect(saved).not.toHaveBeenCalled()
  })

  it('clears the code entry when it has expired', () => {
    fixture.detectChanges()
    const codeSentChange = jasmine.createSpy('codeSentChange')
    // no resend buffer: this test is about the code, not the countdown
    sendCodeSuccessfully(0)
    component.codeSentChange.subscribe(codeSentChange)
    component.verificationCodeControl?.setValue('123456')
    twoFactorService.saveRecoveryPhone.and.returnValue(
      of({ success: false, errorCode: 'CODE_EXPIRED' })
    )

    component.save()

    expect(component.codeSent).toBeFalse()
    expect(codeSentChange).toHaveBeenCalledWith(false)
    expect(component.verificationCodeControl?.disabled).toBeTrue()
    expect(component.codeErrorMessage).toBe(
      'That code is no longer valid. Send a new code.'
    )
  })

  it('asks the host for a challenge instead of opening one itself', () => {
    fixture.detectChanges()
    const challengeRequired = jasmine.createSpy('challengeRequired')
    component.challengeRequired.subscribe(challengeRequired)
    component.verificationCodeControl?.enable()
    component.verificationCodeControl?.setValue('123456')
    twoFactorService.saveRecoveryPhone.and.returnValue(
      of({ success: false, errorCode: 'CHALLENGE_REQUIRED' })
    )

    component.save()

    expect(challengeRequired).toHaveBeenCalled()
    // what they typed is still there
    expect(component.verificationCodeControl?.value).toBe('123456')
  })

  it('hands a dead feature or a disabled 2FA back to the host', () => {
    fixture.detectChanges()
    const failed = jasmine.createSpy('failed')
    component.failed.subscribe(failed)
    component.verificationCodeControl?.enable()
    component.verificationCodeControl?.setValue('123456')
    twoFactorService.saveRecoveryPhone.and.returnValue(
      of({ success: false, errorCode: '2FA_DISABLED' })
    )

    component.save()

    expect(failed).toHaveBeenCalledWith('2FA_DISABLED')
  })

  it('reports a broken save as an HTTP failure', () => {
    fixture.detectChanges()
    const failed = jasmine.createSpy('failed')
    component.failed.subscribe(failed)
    component.verificationCodeControl?.enable()
    component.verificationCodeControl?.setValue('123456')
    twoFactorService.saveRecoveryPhone.and.returnValue(
      throwError(() => new Error('boom'))
    )

    component.save()

    expect(failed).toHaveBeenCalledWith('HTTP')
    expect(component.saving).toBeFalse()
  })
})
