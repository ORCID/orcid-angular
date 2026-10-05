import { TestBed } from '@angular/core/testing'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'

import { TwoFactorAuthenticationService } from './two-factor-authentication.service'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { RecoveryPhoneNumberResponse } from '../../types/two-factor.endpoint'

describe('TwoFactorAuthenticationService', () => {
  const BASE_URL = 'https://test.orcid.org/'
  // window.runtimeEnvironment is the one environment object the whole app
  // reads; put it back so no later spec sees this one's
  let originalRuntimeEnvironment: unknown
  let service: TwoFactorAuthenticationService
  let httpController: HttpTestingController

  beforeEach(() => {
    originalRuntimeEnvironment = (window as any).runtimeEnvironment
    ;(window as any).runtimeEnvironment = { BASE_URL }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ErrorHandlerService, useValue: jasmine.createSpyObj('ErrorHandlerService', ['handleError']) },
      ],
    })
    service = TestBed.inject(TwoFactorAuthenticationService)
    httpController = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpController.verify()
    ;(window as any).runtimeEnvironment = originalRuntimeEnvironment
  })

  it('asks for the number on file with a POST that carries nothing (F4.2)', () => {
    let answer: RecoveryPhoneNumberResponse | undefined
    service.getRecoveryPhoneNumber().subscribe((value) => (answer = value))

    const request = httpController.expectOne(
      BASE_URL + '2FA/recoveryPhone/number.json'
    )
    // A POST, not a GET: nothing along the way may cache the answer
    expect(request.request.method).toBe('POST')
    expect(request.request.body).toEqual({})

    request.flush({ success: true, phoneNumber: '+441234567890' })
    expect(answer).toEqual({ success: true, phoneNumber: '+441234567890' })
  })
})
