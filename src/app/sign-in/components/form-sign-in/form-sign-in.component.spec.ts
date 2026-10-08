import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing'

import { FormSignInComponent } from './form-sign-in.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { UserService } from '../../../core'
import { SignInService } from '../../../core/sign-in/sign-in.service'
import { OauthService } from '../../../core/oauth/oauth.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { of, Subject, throwError } from 'rxjs'
import { OauthURLSessionManagerService } from '../../../core/oauth-urlsession-manager/oauth-urlsession-manager.service'

describe('FormSignInComponent', () => {
  let component: FormSignInComponent
  let fixture: ComponentFixture<FormSignInComponent>
  let router: Router
  let oauthUrlSessionManager: jasmine.SpyObj<OauthURLSessionManagerService>

  beforeEach(() => {
    // Providing this one keeps the specs off window.localStorage, which the
    // real service reads and which another spec may have written to
    oauthUrlSessionManager =
      jasmine.createSpyObj<OauthURLSessionManagerService>(
        'OauthURLSessionManagerService',
        ['get', 'clear']
      )
    oauthUrlSessionManager.get.and.returnValue(null)

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [FormSignInComponent],
      providers: [
        WINDOW_PROVIDERS,
        UserService,
        SignInService,
        OauthService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
        {
          provide: OauthURLSessionManagerService,
          useValue: oauthUrlSessionManager,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSignInComponent)
    component = fixture.componentInstance
    router = TestBed.inject(Router)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('only triggers oauth redirect once per successful flow', () => {
    component.isOauthAuthorizationTogglzEnable = false
    component.platform = { social: false, institutional: false } as any
    component.signInLocal = { params: {} } as any
    const routerNavigateSpy = spyOn(router, 'navigate').and.returnValue(
      Promise.resolve(true)
    )

    component.oauthAuthorize('https://qa.orcid.org/oauth/authorize')
    component.oauthAuthorize('https://qa.orcid.org/oauth/authorize')

    expect(routerNavigateSpy).toHaveBeenCalledTimes(1)
  })

  it('skips post-login session refresh in oauth2 signin flow', () => {
    component.isOauthAuthorizationTogglzEnable = true
    component.signInLocal = { isOauth: true, type: 'regular' as any } as any
    component.authorizationForm.patchValue({
      username: 'test@example.org',
      password: 'secret',
    })
    spyOn(component as any, 'handleOauthLogin').and.stub()

    const signInSpy = spyOn(
      (component as any)._signIn,
      'signIn'
    ).and.returnValue(
      of({
        success: true,
        url: 'https://qa.orcid.org/oauth/authorize',
      } as any)
    )

    component.onSubmit()

    expect(signInSpy).toHaveBeenCalledWith(jasmine.anything(), false, true)
  })

  describe('entering the 2FA step (F1.2)', () => {
    let status: Subject<boolean | undefined>
    let statusSpy: jasmine.Spy

    beforeEach(() => {
      component.authorizationForm.patchValue({
        username: 'test@example.org',
        password: 'secret',
      })
      component.signInLocal = { isOauth: false, type: 'regular' as any } as any
      spyOn((component as any)._signIn, 'signIn').and.returnValue(
        of({ success: false, verificationCodeRequired: true } as any)
      )
      status = new Subject<boolean | undefined>()
      statusSpy = spyOn(
        (component as any)._signIn,
        'recoveryPhoneStatus'
      ).and.returnValue(status)
    })

    it('asks whether the account has a number before showing the step', () => {
      component.recoveryPhoneOptionAvailable = true
      const shown = jasmine.createSpy('show2FA')
      component.show2FAEmitter.subscribe(shown)

      component.onSubmit()

      expect(statusSpy).toHaveBeenCalledOnceWith({
        username: 'test@example.org',
        password: 'secret',
      })
      // Nothing is shown until the answer is in, so the way out never
      // changes in front of the user
      expect(component.show2FA).toBeFalse()
      expect(shown).not.toHaveBeenCalled()

      status.next(false)

      expect(component.show2FA).toBeTrue()
      expect(component.hasRecoveryPhone).toBeFalse()
      expect(shown).toHaveBeenCalledTimes(1)
    })

    it('asks with the credentials the sign in posted, not the fields as they are now', () => {
      // The fields stay editable while the sign in request runs; a password
      // typed meanwhile would be refused and counted towards the lockout
      component.recoveryPhoneOptionAvailable = true
      const response = new Subject<any>()
      ;(component as any)._signIn.signIn.and.returnValue(response)

      component.onSubmit()
      component.authorizationForm.patchValue({ password: 'edited meanwhile' })
      response.next({ success: false, verificationCodeRequired: true })

      expect(statusSpy).toHaveBeenCalledOnceWith({
        username: 'test@example.org',
        password: 'secret',
      })
    })

    it('shows the step with the number offered when the answer never comes (F1.4)', () => {
      component.recoveryPhoneOptionAvailable = true

      component.onSubmit()
      status.next(undefined)

      expect(component.show2FA).toBeTrue()
      expect(component.hasRecoveryPhone).toBeUndefined()
    })

    it('asks nothing with the flag off', () => {
      component.recoveryPhoneOptionAvailable = false

      component.onSubmit()

      expect(statusSpy).not.toHaveBeenCalled()
      expect(component.show2FA).toBeTrue()
    })

    it('asks once, not again while the step is already showing', () => {
      component.recoveryPhoneOptionAvailable = true
      component.onSubmit()
      status.next(true)

      component.onSubmit()

      expect(statusSpy).toHaveBeenCalledTimes(1)
      expect(component.hasRecoveryPhone).toBeTrue()
    })
  })

  describe('signing in with the recovery phone number', () => {
    beforeEach(() => {
      component.authorizationForm.patchValue({
        username: 'test@example.org',
        password: 'secret',
        verificationCode: '111111',
        recoveryCode: 'aaaaaaaaaa',
      })
      component.signInLocal = { isOauth: false, type: 'regular' as any } as any
    })

    it('counts the resend buffer down a second at a time', fakeAsync(() => {
      spyOn(
        (component as any)._signIn,
        'sendRecoveryPhoneCode'
      ).and.returnValue(
        of({
          success: true,
          resendAfterSeconds: 2,
          maskedRecoveryPhoneNumber: '***********6789',
        } as any)
      )

      component.onRequestRecoveryPhoneCode()

      expect(component.recoveryPhoneState.codeSent).toBeTrue()
      expect(component.recoveryPhoneState.maskedNumber).toBe('***********6789')
      expect(component.recoveryPhoneState.resendSeconds).toBe(2)

      tick(1000)
      expect(component.recoveryPhoneState.resendSeconds).toBe(1)
      tick(1000)
      expect(component.recoveryPhoneState.resendSeconds).toBe(0)

      // Nothing keeps ticking once the registry would accept another send
      tick(2000)
      expect(component.recoveryPhoneState.resendSeconds).toBe(0)
      discardPeriodicTasks()
    }))

    it('keeps the error code the registry answered with', () => {
      spyOn(
        (component as any)._signIn,
        'sendRecoveryPhoneCode'
      ).and.returnValue(
        of({ success: false, errorCode: 'NO_RECOVERY_PHONE' } as any)
      )

      component.onRequestRecoveryPhoneCode()

      expect(component.recoveryPhoneState.errorCode).toBe('NO_RECOVERY_PHONE')
      expect(component.recoveryPhoneState.codeSent).toBeFalse()
      expect(component.recoveryPhoneState.sending).toBeFalse()
    })

    it('verifies the code and only then submits the sign-in again (R3.5)', () => {
      const order: string[] = []
      spyOn((component as any)._signIn, 'verifyRecoveryPhoneCode').and.callFake(
        () => {
          order.push('verify')
          return of({ success: true, orcid: '0000-0001-2345-6789' } as any)
        }
      )
      const signInSpy = spyOn(
        (component as any)._signIn,
        'signIn'
      ).and.callFake(() => {
        order.push('signIn')
        return of({
          success: true,
          url: 'https://qa.orcid.org/my-orcid',
        } as any)
      })
      const noticeSpy = spyOn(
        (component as any)._recoveryPhoneNotice,
        'markTwoFactorDisabled'
      )
      spyOn(component, 'navigateTo')

      component.authenticate({ recoveryPhoneCode: '123456' })

      expect(order).toEqual(['verify', 'signIn'])
      // The record page shows the notice once, under the iD it happened to
      expect(noticeSpy).toHaveBeenCalledWith('0000-0001-2345-6789')
      // 2FA is off now, so the sign-in that follows carries no code at all
      const submitted = signInSpy.calls.mostRecent().args[0] as any
      expect(submitted.data.verificationCode).toBeFalsy()
      expect(submitted.data.recoveryCode).toBeFalsy()
    })

    it('stays put when the registry rejects the code', () => {
      spyOn(
        (component as any)._signIn,
        'verifyRecoveryPhoneCode'
      ).and.returnValue(
        of({ success: false, errorCode: 'INVALID_CODE' } as any)
      )
      const signInSpy = spyOn((component as any)._signIn, 'signIn')

      component.authenticate({ recoveryPhoneCode: '123456' })

      expect(signInSpy).not.toHaveBeenCalled()
      expect(component.recoveryPhoneState.errorCode).toBe('INVALID_CODE')
    })

    it('shows the panel instead of redirecting in the oauth flow (R4.2)', () => {
      component.signInLocal = { isOauth: true, type: 'regular' as any } as any
      spyOn(
        (component as any)._signIn,
        'verifyRecoveryPhoneCode'
      ).and.returnValue(of({ success: true, orcid: '0000-0001-2345-6789' }))
      spyOn((component as any)._signIn, 'signIn').and.returnValue(
        of({
          success: true,
          url: 'https://qa.orcid.org/oauth/authorize',
        } as any)
      )
      const noticeSpy = spyOn(
        (component as any)._recoveryPhoneNotice,
        'markTwoFactorDisabled'
      )
      const handleOauthLoginSpy = spyOn(
        component as any,
        'handleOauthLogin'
      ).and.stub()
      const navigateToSpy = spyOn(component, 'navigateTo')
      let emitted: { url: string }
      component.twoFactorDisabledByRecoveryPhone.subscribe(
        (value) => (emitted = value)
      )

      component.authenticate({ recoveryPhoneCode: '123456' })

      expect(emitted).toEqual({ url: 'https://qa.orcid.org/oauth/authorize' })
      expect(handleOauthLoginSpy).not.toHaveBeenCalled()
      expect(navigateToSpy).not.toHaveBeenCalled()
      // This flow queues no record notice: the user is on their way back to
      // the client and may never see the record (R4.3)
      expect(noticeSpy).not.toHaveBeenCalled()
    })

    it('still redirects when the host does not listen for the panel', () => {
      // link-account hosts this form too and binds no such output. Holding
      // the redirect back for a panel nobody renders would strand the user.
      component.signInLocal = { isOauth: true, type: 'regular' as any } as any
      spyOn(
        (component as any)._signIn,
        'verifyRecoveryPhoneCode'
      ).and.returnValue(of({ success: true, orcid: '0000-0001-2345-6789' }))
      spyOn((component as any)._signIn, 'signIn').and.returnValue(
        of({
          success: true,
          url: 'https://qa.orcid.org/oauth/authorize',
        } as any)
      )
      const handleOauthLoginSpy = spyOn(
        component as any,
        'handleOauthLogin'
      ).and.stub()
      expect(component.twoFactorDisabledByRecoveryPhone.observed).toBeFalse()

      component.authenticate({ recoveryPhoneCode: '123456' })

      expect(handleOauthLoginSpy).toHaveBeenCalledWith(
        'https://qa.orcid.org/oauth/authorize'
      )
    })
  })

  describe('mandatory password reset (PD-5692)', () => {
    let statusSpy: jasmine.Spy

    const notice = () =>
      fixture.nativeElement.querySelector(
        '[id="cy-password-reset-required-notice"]'
      )

    beforeEach(() => {
      component.signInLocal = { isOauth: false, type: 'regular' as any } as any
      statusSpy = spyOn(
        (component as any)._signIn,
        'getPasswordResetStatus'
      ).and.returnValue(of({ passwordResetRequired: true }))
    })

    it('shows the notice once a flagged username is left', () => {
      component.authorizationForm.patchValue({ username: ' Test@Example.org ' })

      component.checkPasswordResetStatus()
      fixture.detectChanges()

      expect(statusSpy).toHaveBeenCalledWith('test@example.org')
      expect(component.showPasswordResetRequired).toBeTrue()
      expect(notice()).toBeTruthy()
      expect(
        notice().querySelector('#cy-send-password-reset-email')
      ).toBeTruthy()
    })

    it('asks about an ORCID iD in its canonical form', () => {
      component.authorizationForm.patchValue({
        username: 'https://orcid.org/0000-0001-2345-6789',
      })

      component.checkPasswordResetStatus()

      expect(statusSpy).toHaveBeenCalledWith('0000-0001-2345-6789')
    })

    it('does not ask about something that is neither an address nor an iD', () => {
      component.authorizationForm.patchValue({ username: 'not an identifier' })

      component.checkPasswordResetStatus()

      expect(statusSpy).not.toHaveBeenCalled()
      expect(component.showPasswordResetRequired).toBeFalse()
    })

    it('shows nothing when the registry says no reset is owed', () => {
      statusSpy.and.returnValue(of({ passwordResetRequired: false }))
      component.authorizationForm.patchValue({ username: 'test@example.org' })

      component.checkPasswordResetStatus()
      fixture.detectChanges()

      expect(component.showPasswordResetRequired).toBeFalse()
      expect(notice()).toBeNull()
    })

    it('hides the notice as soon as the username changes', () => {
      component.authorizationForm.patchValue({ username: 'test@example.org' })
      component.checkPasswordResetStatus()

      component.authorizationForm.patchValue({ username: 'other@example.org' })

      expect(component.showPasswordResetRequired).toBeFalse()
    })

    it('fails silently while the notice is shown', () => {
      component.authorizationForm.patchValue({
        username: 'test@example.org',
        password: 'the-old-one',
      })
      component.checkPasswordResetStatus()
      spyOn((component as any)._signIn, 'signIn').and.returnValue(
        of({ success: false } as any)
      )
      const navigateToSpy = spyOn(component, 'navigateTo')
      const eventSpy = spyOn(
        (component as any)._observability,
        'recordSimpleEvent'
      )

      component.onSubmit()
      fixture.detectChanges()

      expect(component.badCredentials).toBeFalse()
      expect(component.printError).toBeFalse()
      expect(component.show2FA).toBeFalse()
      expect(navigateToSpy).not.toHaveBeenCalled()
      expect(notice()).toBeTruthy()
      // Kept silent on the notice's word, so the status is asked again, and
      // this time an error is not taken for "no reset owed"
      expect(statusSpy).toHaveBeenCalledTimes(2)
      expect(statusSpy.calls.mostRecent().args).toEqual([
        'test@example.org',
        false,
      ])
      expect(eventSpy).toHaveBeenCalledWith(
        'sign_in_failure',
        jasmine.objectContaining({
          passwordResetRequired: false,
          suppressedByNotice: true,
          badCredentials: false,
        })
      )
    })

    it('tells a record reset since the lookup about its wrong password', () => {
      statusSpy.and.returnValues(
        of({ passwordResetRequired: true }),
        of({ passwordResetRequired: false })
      )
      component.authorizationForm.patchValue({
        username: 'test@example.org',
        password: 'not-the-new-one',
      })
      component.checkPasswordResetStatus()
      spyOn((component as any)._signIn, 'signIn').and.returnValue(
        of({ success: false } as any)
      )

      const eventSpy = spyOn(
        (component as any)._observability,
        'recordSimpleEvent'
      )

      component.onSubmit()
      fixture.detectChanges()

      expect(component.showPasswordResetRequired).toBeFalse()
      expect(notice()).toBeNull()
      expect(component.badCredentials).toBeTrue()
      expect(component.printError).toBeTrue()
      expect(eventSpy).toHaveBeenCalledWith(
        'sign_in_failure',
        jasmine.objectContaining({
          badCredentials: true,
          recheckedAfterNotice: true,
        })
      )
    })

    it('does not second-guess a notice the sign in itself confirmed', () => {
      const signIn = spyOn(
        (component as any)._signIn,
        'signIn'
      ).and.returnValues(
        of({ success: false, passwordResetRequired: true } as any),
        of({ success: false } as any)
      )
      component.authorizationForm.patchValue({
        username: 'test@example.org',
        password: 'the-old-one',
      })

      component.onSubmit()
      component.authorizationForm.patchValue({ password: 'a-typo' })
      component.onSubmit()

      expect(signIn).toHaveBeenCalledTimes(2)
      expect(statusSpy).not.toHaveBeenCalled()
      expect(component.showPasswordResetRequired).toBeTrue()
      expect(component.badCredentials).toBeFalse()
    })

    it('stays silent when the re-check cannot ask', () => {
      statusSpy.and.returnValues(
        of({ passwordResetRequired: true }),
        throwError(() => new Error('offline'))
      )
      component.authorizationForm.patchValue({
        username: 'test@example.org',
        password: 'the-old-one',
      })
      component.checkPasswordResetStatus()
      spyOn((component as any)._signIn, 'signIn').and.returnValue(
        of({ success: false } as any)
      )

      component.onSubmit()

      expect(component.showPasswordResetRequired).toBeTrue()
      expect(component.badCredentials).toBeFalse()
      expect(component.printError).toBeFalse()
    })

    it('drops a re-check that a newer sign in overtook', () => {
      const late = new Subject<{ passwordResetRequired: boolean }>()
      statusSpy.and.returnValues(
        of({ passwordResetRequired: true }),
        late,
        of({ passwordResetRequired: true })
      )
      component.authorizationForm.patchValue({
        username: 'test@example.org',
        password: 'the-old-one',
      })
      component.checkPasswordResetStatus()
      spyOn((component as any)._signIn, 'signIn').and.returnValue(
        of({ success: false } as any)
      )

      component.onSubmit()
      component.onSubmit()
      late.next({ passwordResetRequired: false })

      expect(component.showPasswordResetRequired).toBeTrue()
      expect(component.badCredentials).toBeFalse()
    })

    it('shows a deprecated answer instead of keeping it quiet', () => {
      component.authorizationForm.patchValue({
        username: 'test@example.org',
        password: 'secret',
      })
      component.checkPasswordResetStatus()
      spyOn((component as any)._signIn, 'signIn').and.returnValue(
        of({
          success: false,
          deprecated: true,
          primary: '0000-0001-2345-6789',
        } as any)
      )

      component.onSubmit()

      expect(component.showDeprecatedError).toBeTrue()
      expect(component.printError).toBeTrue()
      expect(component.showPasswordResetRequired).toBeFalse()
    })

    it("does not keep a failure at the 2FA step quiet on a lookup's word", () => {
      component.authorizationForm.patchValue({
        username: 'test@example.org',
        password: 'secret',
      })
      component.show2FA = true
      ;(component as any).passwordResetRequiredFor = 'test@example.org'
      spyOn((component as any)._signIn, 'signIn').and.returnValue(
        of({ success: false } as any)
      )

      component.onSubmit()

      expect(component.badCredentials).toBeTrue()
      expect(component.printError).toBeTrue()
    })

    it('shows the notice when the registry refuses at the 2FA step', () => {
      component.authorizationForm.patchValue({
        username: 'test@example.org',
        password: 'secret',
      })
      component.show2FA = true
      spyOn((component as any)._signIn, 'signIn').and.returnValue(
        of({ success: false, passwordResetRequired: true } as any)
      )

      component.onSubmit()
      fixture.detectChanges()

      expect(component.showPasswordResetNotice).toBeTrue()
      expect(notice()).toBeTruthy()
    })

    it('ignores a lookup answer that arrives during the 2FA step', () => {
      component.authorizationForm.patchValue({ username: 'test@example.org' })
      component.show2FA = true

      component.checkPasswordResetStatus()

      expect(statusSpy).toHaveBeenCalled()
      expect(component.showPasswordResetRequired).toBeFalse()
      expect(component.checkingPasswordResetStatus).toBeFalse()
    })

    it('marks the notice region busy while it asks', () => {
      const late = new Subject<{ passwordResetRequired: boolean }>()
      statusSpy.and.returnValue(late)
      component.authorizationForm.patchValue({ username: 'test@example.org' })

      component.checkPasswordResetStatus()
      fixture.detectChanges()
      const region: HTMLElement = fixture.nativeElement.querySelector(
        '#cy-password-reset-status'
      )
      expect(region.getAttribute('aria-busy')).toBe('true')

      late.next({ passwordResetRequired: false })
      fixture.detectChanges()
      expect(region.getAttribute('aria-busy')).toBe('false')
    })

    it('still proceeds when the sign in succeeds while the notice is shown', () => {
      component.authorizationForm.patchValue({
        username: 'test@example.org',
        password: 'the-new-one',
      })
      component.checkPasswordResetStatus()
      spyOn((component as any)._signIn, 'signIn').and.returnValue(
        of({ success: true, url: 'https://orcid.org/my-orcid' } as any)
      )
      const navigateToSpy = spyOn(component, 'navigateTo')

      component.onSubmit()

      expect(navigateToSpy).toHaveBeenCalledWith('https://orcid.org/my-orcid')
      expect(component.showPasswordResetRequired).toBeFalse()
    })

    it('keeps the notice the sign in confirmed when a late lookup says otherwise', () => {
      const late = new Subject<{ passwordResetRequired: boolean }>()
      statusSpy.and.returnValue(late)
      component.authorizationForm.patchValue({
        username: 'test@example.org',
        password: 'the-old-one',
      })
      component.checkPasswordResetStatus()
      spyOn((component as any)._signIn, 'signIn').and.returnValue(
        of({ success: false, passwordResetRequired: true } as any)
      )

      component.onSubmit()
      // The lookup was read from a replica that had not caught up yet
      late.next({ passwordResetRequired: false })

      expect(component.showPasswordResetRequired).toBeTrue()
    })

    it('decides for the username that was submitted, not the one typed since', () => {
      const answer = new Subject<any>()
      spyOn((component as any)._signIn, 'signIn').and.returnValue(answer)
      component.authorizationForm.patchValue({
        username: 'test@example.org',
        password: 'the-old-one',
      })

      component.onSubmit()
      component.authorizationForm.patchValue({ username: 'other@example.org' })
      answer.next({ success: false, passwordResetRequired: true })

      expect(component.showPasswordResetRequired).toBeFalse()
      component.authorizationForm.patchValue({ username: 'test@example.org' })
      expect(component.showPasswordResetRequired).toBeTrue()
    })

    it('shows the notice from the sign in answer when the lookup never ran', () => {
      component.authorizationForm.patchValue({
        username: 'test@example.org',
        password: 'secret',
      })
      spyOn((component as any)._signIn, 'signIn').and.returnValue(
        of({ success: false, passwordResetRequired: true } as any)
      )

      const eventSpy = spyOn(
        (component as any)._observability,
        'recordSimpleEvent'
      )

      component.onSubmit()

      expect(component.showPasswordResetRequired).toBeTrue()
      expect(component.badCredentials).toBeFalse()
      expect(component.printError).toBeFalse()
      expect(eventSpy).toHaveBeenCalledWith(
        'sign_in_failure',
        jasmine.objectContaining({
          passwordResetRequired: true,
          suppressedByNotice: false,
        })
      )
    })

    it('lets a 2FA prompt replace a notice that is no longer owed', () => {
      component.authorizationForm.patchValue({
        username: 'test@example.org',
        password: 'secret',
      })
      component.checkPasswordResetStatus()
      spyOn((component as any)._signIn, 'signIn').and.returnValue(
        of({ success: false, verificationCodeRequired: true } as any)
      )

      component.onSubmit()

      expect(component.show2FA).toBeTrue()
      expect(component.showPasswordResetRequired).toBeFalse()
    })

    it('sends one reset email to the typed address', () => {
      component.authorizationForm.patchValue({ username: 'Test@Example.org' })
      component.checkPasswordResetStatus()
      const resetSpy = spyOn(
        (component as any)._passwordRecovery,
        'resetPassword'
      ).and.returnValue(of({ errors: [], successMessage: 'sent' } as any))

      component.sendPasswordResetEmail()
      component.sendPasswordResetEmail()
      fixture.detectChanges()

      expect(resetSpy).toHaveBeenCalledTimes(1)
      expect(resetSpy).toHaveBeenCalledWith({ email: 'test@example.org' })
      expect(component.passwordResetEmailSent).toBeTrue()
      expect(component.passwordResetEmailSentTo).toBe('test@example.org')
      expect(notice().querySelector('#cy-send-password-reset-email')).toBeNull()
      expect(
        notice().querySelector('#cy-password-reset-email-sent')
      ).toBeTruthy()
    })

    it('sends an iD without ever naming the address it went to', () => {
      component.authorizationForm.patchValue({
        username: '0000-0001-2345-6789',
      })
      component.checkPasswordResetStatus()
      const resetSpy = spyOn(
        (component as any)._passwordRecovery,
        'resetPassword'
      ).and.returnValue(of({ errors: [], successMessage: 'sent' } as any))

      component.sendPasswordResetEmail()
      fixture.detectChanges()

      expect(resetSpy).toHaveBeenCalledWith({ email: '0000-0001-2345-6789' })
      expect(component.passwordResetEmailSentTo).toBe('')
      expect(notice().textContent).not.toContain('@')
    })

    it('does not offer the email again for a username it was sent for', () => {
      const resetSpy = spyOn(
        (component as any)._passwordRecovery,
        'resetPassword'
      ).and.returnValue(of({ errors: [], successMessage: 'sent' } as any))
      component.authorizationForm.patchValue({ username: 'test@example.org' })
      component.checkPasswordResetStatus()
      component.sendPasswordResetEmail()

      // Another flagged username, and its own email
      component.authorizationForm.patchValue({ username: 'other@example.org' })
      component.checkPasswordResetStatus()
      expect(component.passwordResetEmailSent).toBeFalse()
      component.sendPasswordResetEmail()

      // Back to the first: a second send would cancel the link it already has
      component.authorizationForm.patchValue({ username: 'test@example.org' })
      component.checkPasswordResetStatus()
      component.sendPasswordResetEmail()
      fixture.detectChanges()

      expect(resetSpy).toHaveBeenCalledTimes(2)
      expect(component.passwordResetEmailSent).toBeTrue()
      expect(notice().querySelector('#cy-send-password-reset-email')).toBeNull()
    })

    it('keeps the link when the registry refuses the send', () => {
      component.authorizationForm.patchValue({ username: 'test@example.org' })
      component.checkPasswordResetStatus()
      spyOn(
        (component as any)._passwordRecovery,
        'resetPassword'
      ).and.returnValue(
        of({ errors: ['Email.resetPasswordForm.error'] } as any)
      )

      component.sendPasswordResetEmail()

      expect(component.passwordResetEmailSent).toBeFalse()
      expect(component.sendingPasswordResetEmail).toBeFalse()
    })

    it('asks about a username that arrives filled in', () => {
      // The service is the root singleton, so the spy above covers this one too
      statusSpy.calls.reset()
      const prefilled = TestBed.createComponent(FormSignInComponent)
      prefilled.componentInstance.email = 'test@example.org'

      prefilled.detectChanges()

      expect(statusSpy).toHaveBeenCalledWith('test@example.org')
      expect(prefilled.componentInstance.showPasswordResetRequired).toBeTrue()
    })
  })
})
