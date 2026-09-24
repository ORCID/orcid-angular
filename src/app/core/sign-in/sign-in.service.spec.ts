import { TestBed } from '@angular/core/testing'

import { SignInService } from './sign-in.service'
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
