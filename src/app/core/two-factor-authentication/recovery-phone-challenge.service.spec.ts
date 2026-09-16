import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import {
  AuthChallengeRecoveryPhone,
  AuthChallengeRecoveryPhoneVerification,
} from '@orcid/registry-ui'
import { Subject, of, throwError } from 'rxjs'

import { AppEventName } from '../../rum/app-event-names'
import { RumJourneyEventService } from '../../rum/service/customEvent.service'
import { AuthChallenge } from '../../types/common.endpoint'
import { TogglzFlag } from '../../types/config.endpoint'
import { Status } from '../../types/two-factor.endpoint'
import { TogglzService } from '../togglz/togglz.service'
import { UserService } from '../user/user.service'
import { RecoveryPhoneChallengeService } from './recovery-phone-challenge.service'
import { RecoveryPhoneNoticeService } from './recovery-phone-notice.service'
import {
  RecoveryPhoneChallengeSendResponse,
  TwoFactorAuthenticationService,
} from './two-factor-authentication.service'

describe('RecoveryPhoneChallengeService', () => {
  const ORCID = '0000-0001-0002-0003'

  let twoFactor: jasmine.SpyObj<TwoFactorAuthenticationService>
  let togglz: jasmine.SpyObj<TogglzService>
  let notice: jasmine.SpyObj<RecoveryPhoneNoticeService>
  let user: jasmine.SpyObj<UserService>
  let observability: jasmine.SpyObj<RumJourneyEventService>

  const status = (overrides: Partial<Status> = {}): Status =>
    ({
      enabled: true,
      maskedRecoveryPhoneNumber: '***********1234',
      ...overrides,
    } as Status)

  const sendResponse = (
    overrides: Partial<RecoveryPhoneChallengeSendResponse> = {}
  ): RecoveryPhoneChallengeSendResponse => ({
    success: true,
    resendAfterSeconds: 30,
    ...overrides,
  })

  function build(): RecoveryPhoneChallengeService {
    return TestBed.inject(RecoveryPhoneChallengeService)
  }

  beforeEach(() => {
    twoFactor = jasmine.createSpyObj('TwoFactorAuthenticationService', [
      'checkState',
      'sendRecoveryPhoneChallengeCode',
      'verifyRecoveryPhoneChallengeCode',
    ])
    twoFactor.checkState.and.returnValue(of(status()))
    twoFactor.sendRecoveryPhoneChallengeCode.and.returnValue(of(sendResponse()))
    twoFactor.verifyRecoveryPhoneChallengeCode.and.returnValue(
      of({ success: true } as AuthChallenge)
    )

    togglz = jasmine.createSpyObj('TogglzService', ['getStateOf'])
    togglz.getStateOf.and.returnValue(of(true))

    notice = jasmine.createSpyObj('RecoveryPhoneNoticeService', [
      'markTwoFactorDisabled',
      'consumeTwoFactorDisabled',
    ])

    user = jasmine.createSpyObj('UserService', ['getUserSession'])
    user.getUserSession.and.returnValue(
      of({ userInfo: { EFFECTIVE_USER_ORCID: ORCID } }) as any
    )

    observability = jasmine.createSpyObj('RumJourneyEventService', [
      'recordSimpleEvent',
    ])

    TestBed.configureTestingModule({
      providers: [
        RecoveryPhoneChallengeService,
        { provide: TwoFactorAuthenticationService, useValue: twoFactor },
        { provide: TogglzService, useValue: togglz },
        { provide: RecoveryPhoneNoticeService, useValue: notice },
        { provide: UserService, useValue: user },
        { provide: RumJourneyEventService, useValue: observability },
      ],
    })
  })

  describe('whether the option is offered at all (R5.1)', () => {
    it('offers it when the flag is on, 2FA is on and a number is stored', () => {
      const handle = build().create()

      expect(togglz.getStateOf).toHaveBeenCalledWith(
        TogglzFlag.TWO_FACTOR_RECOVERY_PHONE
      )
      expect(handle.available).toBeTrue()
      expect(handle.maskedNumber).toBe('***********1234')
    })

    it('does not offer it with the flag off', () => {
      togglz.getStateOf.and.returnValue(of(false))

      expect(build().create().available).toBeFalse()
    })

    it('does not offer it when 2FA is not active', () => {
      twoFactor.checkState.and.returnValue(of(status({ enabled: false })))

      expect(build().create().available).toBeFalse()
    })

    it('does not offer it when no number is stored', () => {
      twoFactor.checkState.and.returnValue(
        of(status({ maskedRecoveryPhoneNumber: undefined }))
      )

      expect(build().create().available).toBeFalse()
    })

    it('leaves the challenge as it was when the registry cannot say', () => {
      twoFactor.checkState.and.returnValue(
        throwError(() => new Error('status is down'))
      )

      expect(build().create().available).toBeFalse()
    })
  })

  describe('sending a code', () => {
    it('reports the send and counts the resend buffer down', fakeAsync(() => {
      const handle = build().create()

      handle.sendCode()

      expect(handle.codeSent).toBeTrue()
      expect(handle.sending).toBeFalse()
      expect(handle.resendSeconds).toBe(30)

      tick(1000)
      expect(handle.resendSeconds).toBe(29)

      tick(29000)
      expect(handle.resendSeconds).toBe(0)
    }))

    it('refuses a second send while the buffer is still running', fakeAsync(() => {
      const handle = build().create()

      handle.sendCode()
      handle.sendCode()

      expect(twoFactor.sendRecoveryPhoneChallengeCode).toHaveBeenCalledTimes(1)

      tick(30000)
      handle.sendCode()
      expect(twoFactor.sendRecoveryPhoneChallengeCode).toHaveBeenCalledTimes(2)
      tick(30000)
    }))

    it('keeps the code alive and just waits when the registry says too soon', fakeAsync(() => {
      twoFactor.sendRecoveryPhoneChallengeCode.and.returnValue(
        of(
          sendResponse({
            success: false,
            errorCode: 'RESEND_TOO_SOON',
            resendAfterSeconds: 5,
          })
        )
      )
      const handle = build().create()

      handle.sendCode()

      expect(handle.codeSent).toBeTrue()
      expect(handle.errorCode).toBeUndefined()
      expect(handle.resendSeconds).toBe(5)
      tick(5000)
    }))

    it('carries the registry error code back to the challenge', () => {
      twoFactor.sendRecoveryPhoneChallengeCode.and.returnValue(
        of(
          sendResponse({
            success: false,
            errorCode: 'NO_RECOVERY_PHONE',
            resendAfterSeconds: 0,
          })
        )
      )
      const handle = build().create()

      handle.sendCode()

      expect(handle.codeSent).toBeFalse()
      expect(handle.errorCode).toBe('NO_RECOVERY_PHONE')
    })

    it('says so when the registry never answered', () => {
      twoFactor.sendRecoveryPhoneChallengeCode.and.returnValue(
        throwError(() => new Error('network'))
      )
      const handle = build().create()

      handle.sendCode()

      expect(handle.sending).toBeFalse()
      expect(handle.errorCode).toBe('HTTP')
    })
  })

  describe('verifying a code', () => {
    function verify(
      handle: AuthChallengeRecoveryPhone
    ): AuthChallengeRecoveryPhoneVerification | undefined {
      let answer: AuthChallengeRecoveryPhoneVerification | undefined
      handle.verify('a-password', '123456').subscribe((value) => {
        answer = value
      })
      return answer
    }

    it('posts the password and the code', () => {
      const handle = build().create()

      verify(handle)

      expect(twoFactor.verifyRecoveryPhoneChallengeCode).toHaveBeenCalledWith({
        password: 'a-password',
        verificationCode: '123456',
      })
    })

    it('queues the record notice and tells the host once the code is accepted (R5.4)', () => {
      const onUsed = jasmine.createSpy('onUsed')
      const handle = build().create({ onUsed })

      expect(verify(handle)).toBe('passed')
      expect(handle.used).toBeTrue()
      expect(notice.markTwoFactorDisabled).toHaveBeenCalledWith(ORCID)
      expect(observability.recordSimpleEvent).toHaveBeenCalledWith(
        AppEventName.AuthChallengeRecoveryPhoneUsed
      )
      expect(onUsed).toHaveBeenCalled()
    })

    it('queues nothing when the code is refused', () => {
      twoFactor.verifyRecoveryPhoneChallengeCode.and.returnValue(
        of({ success: false, invalidTwoFactorCode: true } as AuthChallenge)
      )
      const onUsed = jasmine.createSpy('onUsed')
      const handle = build().create({ onUsed })

      expect(verify(handle)).toBe('invalidCode')
      expect(handle.used).toBeFalse()
      expect(notice.markTwoFactorDisabled).not.toHaveBeenCalled()
      expect(onUsed).not.toHaveBeenCalled()
    })

    it('says so when the password, not the code, is what was rejected (R5.2)', () => {
      // The registry checks the password first, so nothing was spent on the
      // code and reporting this as a bad code would be untrue
      twoFactor.verifyRecoveryPhoneChallengeCode.and.returnValue(
        of({ success: false, invalidPassword: true } as AuthChallenge)
      )
      const handle = build().create()

      expect(verify(handle)).toBe('invalidPassword')
      expect(handle.used).toBeFalse()
      expect(notice.markTwoFactorDisabled).not.toHaveBeenCalled()
    })

    it('finishes what the registry started even when nobody is listening (R5.4)', () => {
      const response = new Subject<AuthChallenge>()
      twoFactor.verifyRecoveryPhoneChallengeCode.and.returnValue(
        response.asObservable()
      )
      const onUsed = jasmine.createSpy('onUsed')
      const handle = build().create({ onUsed })

      // the challenge closed while the request was in flight
      handle.verify('a-password', '123456').subscribe().unsubscribe()
      // ... and the registry disabled 2FA and deleted the number anyway
      response.next({ success: true } as AuthChallenge)

      expect(handle.used).toBeTrue()
      expect(notice.markTwoFactorDisabled).toHaveBeenCalledWith(ORCID)
      expect(observability.recordSimpleEvent).toHaveBeenCalledWith(
        AppEventName.AuthChallengeRecoveryPhoneUsed
      )
      expect(onUsed).toHaveBeenCalled()
    })

    it('treats a failed request as a refusal rather than a pass', () => {
      twoFactor.verifyRecoveryPhoneChallengeCode.and.returnValue(
        throwError(() => new Error('network'))
      )
      const handle = build().create()

      expect(verify(handle)).toBe('invalidCode')
      expect(notice.markTwoFactorDisabled).not.toHaveBeenCalled()
    })
  })

  it('still answers the challenge when the notice and the telemetry are not there', () => {
    // Only the two services the challenge genuinely depends on are provided
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      providers: [
        RecoveryPhoneChallengeService,
        { provide: TwoFactorAuthenticationService, useValue: twoFactor },
        { provide: TogglzService, useValue: togglz },
      ],
    })
    const handle = TestBed.inject(RecoveryPhoneChallengeService).create()

    expect(handle.available).toBeTrue()

    let answer: AuthChallengeRecoveryPhoneVerification | undefined
    expect(() =>
      handle.verify('a-password', '123456').subscribe((value) => {
        answer = value
      })
    ).not.toThrow()
    expect(answer).toBe('passed')
  })

  it('stops the countdown with the challenge that started it', fakeAsync(() => {
    const handle = build().create()
    handle.sendCode()
    expect(handle.resendSeconds).toBe(30)

    handle.dispose()
    tick(5000)

    // nothing of this challenge's is left ticking, and what a host reads
    // after the challenge has closed is still there to read
    expect(handle.resendSeconds).toBe(30)
    expect(handle.used).toBeFalse()
  }))

  it('drops everything it subscribed to when the application goes away', fakeAsync(() => {
    const service = build()
    const handle = service.create()
    handle.sendCode()
    expect(handle.resendSeconds).toBe(30)

    service.ngOnDestroy()
    tick(5000)

    // the countdown stopped with the service rather than ticking on alone
    expect(handle.resendSeconds).toBe(30)
  }))
})
