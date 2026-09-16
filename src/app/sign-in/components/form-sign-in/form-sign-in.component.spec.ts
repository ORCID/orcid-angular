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
import { of } from 'rxjs'
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
})
