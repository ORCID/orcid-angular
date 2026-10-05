import { fakeAsync, TestBed, tick } from '@angular/core/testing'

import {
  RECOVERY_PHONE_STATUS_TIMEOUT_MS,
  SignInService,
} from './sign-in.service'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { AffiliationsSortService, UserService } from '..'
import { RecordAffiliationsGroupingService } from '../record-affiliations-affiliations-grouping/record-affiliations-grouping.service'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { of } from 'rxjs'
import { LOCAL_SESSION_UID } from '../../constants'
import { SignInLocal } from '../../types/sign-in.local'
import { TogglzService } from '../togglz/togglz.service'

declare const runtimeEnvironment: { API_WEB: string }

describe('SignInService', () => {
  const API_WEB = 'https://test.orcid.org/'
  // window.runtimeEnvironment is the one real environment object the whole
  // app reads, not a per-spec shadow. Put it back, or every spec that happens
  // to run after this file sees an environment carrying only API_WEB.
  let originalRuntimeEnvironment: unknown

  beforeEach(() => {
    originalRuntimeEnvironment = (window as any).runtimeEnvironment
    ;(window as any).runtimeEnvironment = { API_WEB }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        UserService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    })
  })

  afterEach(() => {
    ;(window as any).runtimeEnvironment = originalRuntimeEnvironment
  })

  it('should be created', () => {
    const service: SignInService = TestBed.inject(SignInService)
    expect(service).toBeTruthy()
  })

  describe('starting the sign in in this tab (F2.7)', () => {
    const AUTH_SERVER = 'https://auth.test.orcid.org/'
    let service: SignInService
    let httpController: HttpTestingController
    let userService: UserService
    let previousUid: string | null

    beforeEach(() => {
      ;(window as any).runtimeEnvironment = { API_WEB, AUTH_SERVER }
      previousUid = window.sessionStorage.getItem(LOCAL_SESSION_UID)
      window.sessionStorage.removeItem(LOCAL_SESSION_UID)
      spyOn(TestBed.inject(TogglzService), 'getStateOf').and.returnValue(
        of(true)
      )
      service = TestBed.inject(SignInService)
      httpController = TestBed.inject(HttpTestingController)
      userService = TestBed.inject(UserService)
      spyOn(userService, 'createLocalUserSessionUid').and.callThrough()
      spyOn(userService, 'refreshUserSession').and.callThrough()
    })

    afterEach(() => {
      httpController.verify()
      if (previousUid === null) {
        window.sessionStorage.removeItem(LOCAL_SESSION_UID)
      } else {
        window.sessionStorage.setItem(LOCAL_SESSION_UID, previousUid)
      }
    })

    /** The OAuth sign in that hands the browser to the authorization server. */
    function signInWithoutRefreshing() {
      service
        .signIn(
          {
            data: { username: '0000-0001-2345-6789', password: 'p' },
            isOauth: true,
          } as SignInLocal,
          false
        )
        .subscribe()
      return httpController.expectOne(AUTH_SERVER + 'login')
    }

    it('starts one even when the session is not refreshed here', () => {
      signInWithoutRefreshing().flush({
        success: true,
        url: AUTH_SERVER + 'oauth2/authorize',
      })

      expect(userService.createLocalUserSessionUid).toHaveBeenCalledTimes(1)
      expect(userService.refreshUserSession).not.toHaveBeenCalled()
      expect(window.sessionStorage.getItem(LOCAL_SESSION_UID)).toBeTruthy()
    })

    it('starts none for an attempt the server has not accepted yet', () => {
      signInWithoutRefreshing().flush({
        success: false,
        verificationCodeRequired: true,
      })

      expect(userService.createLocalUserSessionUid).not.toHaveBeenCalled()
      expect(window.sessionStorage.getItem(LOCAL_SESSION_UID)).toBeNull()
    })
  })

  describe('recovery phone sign in', () => {
    let service: SignInService
    let httpController: HttpTestingController

    beforeEach(() => {
      service = TestBed.inject(SignInService)
      httpController = TestBed.inject(HttpTestingController)
    })

    afterEach(() => {
      httpController.verify()
    })

    it('sends the code through the registry, with the username as an iD', () => {
      let response: { success: boolean; resendAfterSeconds: number }
      service
        .sendRecoveryPhoneCode({
          username: '0000000123456789',
          password: 'a-password',
        })
        .subscribe((value) => (response = value))

      const request = httpController.expectOne(
        API_WEB + 'signin/recoveryPhone/sendCode.json'
      )
      expect(request.request.method).toBe('POST')
      expect(request.request.withCredentials).toBeTrue()
      expect(request.request.body).toEqual({
        username: '0000-0001-2345-6789',
        password: 'a-password',
      })

      request.flush({
        success: true,
        resendAfterSeconds: 30,
        maskedRecoveryPhoneNumber: '***********6789',
      })
      expect(response.success).toBeTrue()
      expect(response.resendAfterSeconds).toBe(30)
    })

    it('asks the registry whether the account has a number (F1.2)', () => {
      const answers: Array<boolean | undefined> = []
      service
        .recoveryPhoneStatus({
          username: 'user@example.org',
          password: 'a-password',
        })
        .subscribe((value) => answers.push(value))

      const request = httpController.expectOne(
        API_WEB + 'signin/recoveryPhone/status.json'
      )
      expect(request.request.method).toBe('POST')
      expect(request.request.withCredentials).toBeTrue()
      expect(request.request.body).toEqual({
        username: 'user@example.org',
        password: 'a-password',
      })

      request.flush({ success: true, hasRecoveryPhone: false })
      expect(answers).toEqual([false])
    })

    it('says yes when the registry does', () => {
      let answer: boolean | undefined
      service
        .recoveryPhoneStatus({ username: 'u', password: 'p' })
        .subscribe((value) => (answer = value))

      httpController
        .expectOne(API_WEB + 'signin/recoveryPhone/status.json')
        .flush({ success: true, hasRecoveryPhone: true })
      expect(answer).toBeTrue()
    })

    it('reads a refusal as not known (F1.4)', () => {
      let answer: boolean | undefined = true
      service
        .recoveryPhoneStatus({ username: 'u', password: 'p' })
        .subscribe((value) => (answer = value))

      httpController
        .expectOne(API_WEB + 'signin/recoveryPhone/status.json')
        .flush({ success: false, errorCode: 'BAD_CREDENTIALS' })
      expect(answer).toBeUndefined()
    })

    it('reads a failed request as not known, and never errors (F1.4)', () => {
      let answer: boolean | undefined = true
      let failed = false
      service.recoveryPhoneStatus({ username: 'u', password: 'p' }).subscribe({
        next: (value) => (answer = value),
        error: () => (failed = true),
      })

      httpController
        .expectOne(API_WEB + 'signin/recoveryPhone/status.json')
        .flush('boom', { status: 500, statusText: 'Server Error' })
      expect(answer).toBeUndefined()
      expect(failed).toBeFalse()
    })

    it('stops waiting after five seconds (F1.4)', fakeAsync(() => {
      let answer: boolean | undefined = true
      let done = false
      service.recoveryPhoneStatus({ username: 'u', password: 'p' }).subscribe({
        next: (value) => (answer = value),
        complete: () => (done = true),
      })
      const request = httpController.expectOne(
        API_WEB + 'signin/recoveryPhone/status.json'
      )

      tick(RECOVERY_PHONE_STATUS_TIMEOUT_MS - 1)
      expect(done).toBeFalse()
      tick(1)

      expect(answer).toBeUndefined()
      expect(done).toBeTrue()
      expect(request.cancelled).toBeTrue()
    }))

    it('stops waiting after five seconds in all, retries included (F1.4)', fakeAsync(() => {
      // The cap is for the whole question, not for each attempt: a first
      // attempt that fails after a second leaves the retry four seconds
      let answer: boolean | undefined = true
      let done = false
      service.recoveryPhoneStatus({ username: 'u', password: 'p' }).subscribe({
        next: (value) => (answer = value),
        complete: () => (done = true),
      })

      tick(1000)
      httpController
        .expectOne(API_WEB + 'signin/recoveryPhone/status.json')
        .flush(null, { status: 503, statusText: 'Service Unavailable' })
      tick(0)
      const retried = httpController.expectOne(
        API_WEB + 'signin/recoveryPhone/status.json'
      )

      tick(RECOVERY_PHONE_STATUS_TIMEOUT_MS - 1000 - 1)
      expect(done).toBeFalse()
      tick(1)

      expect(answer).toBeUndefined()
      expect(done).toBeTrue()
      expect(retried.cancelled).toBeTrue()
    }))

    it('verifies the code through the registry, with the code in the body', () => {
      let response: { success: boolean; orcid?: string }
      service
        .verifyRecoveryPhoneCode({
          username: 'user@example.org',
          password: 'a-password',
          verificationCode: '123456',
        })
        .subscribe((value) => (response = value))

      const request = httpController.expectOne(
        API_WEB + 'signin/recoveryPhone/verify.json'
      )
      expect(request.request.method).toBe('POST')
      expect(request.request.withCredentials).toBeTrue()
      expect(request.request.body).toEqual({
        username: 'user@example.org',
        password: 'a-password',
        verificationCode: '123456',
      })

      request.flush({ success: true, orcid: '0000-0001-2345-6789' })
      expect(response.orcid).toBe('0000-0001-2345-6789')
    })
  })
})
