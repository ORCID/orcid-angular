import { TestBed } from '@angular/core/testing'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { of, Subject, throwError } from 'rxjs'

import { InterstitialType } from 'src/app/cdk/interstitials/interstitial.type'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { RecoveryPhoneInterstitialComponent } from 'src/app/cdk/interstitials/recovery-phone/interstitial-component/recovery-phone-interstitial.component'
import { RecoveryPhoneInterstitialDialogComponent } from 'src/app/cdk/interstitials/recovery-phone/interstitial-dialog-extend/recovery-phone-interstitial-dialog.component'
import { WINDOW, WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { EmailsEndpoint, UserInfo } from 'src/app/types'
import { TogglzFlag } from 'src/app/types/config.endpoint'
import { UserRecord } from 'src/app/types/record.local'
import { Status } from 'src/app/types/two-factor.endpoint'

import { QaFlag } from '../../qa-flag/qa-flags.enum'
import { QaFlagsService } from '../../qa-flag/qa-flag.service'
import { TogglzService } from '../../togglz/togglz.service'
import { TwoFactorAuthenticationService } from '../../two-factor-authentication/two-factor-authentication.service'
import { LoginRecoveryPhoneInterstitialManagerService } from '../implementations/login-recovery-phone-interstitials-manager.service'
import { InterstitialObservabilityService } from '../interstitial-observability.service'

describe('LoginRecoveryPhoneInterstitialManagerService', () => {
  let service: LoginRecoveryPhoneInterstitialManagerService

  let mockMatDialog: jasmine.SpyObj<MatDialog>
  let mockInterstitialsService: jasmine.SpyObj<InterstitialsService>
  let mockTogglzService: jasmine.SpyObj<TogglzService>
  let mockQaFlagsService: jasmine.SpyObj<QaFlagsService>
  let mockObservability: jasmine.SpyObj<InterstitialObservabilityService>
  let mockTwoFactorService: jasmine.SpyObj<TwoFactorAuthenticationService>

  /** Which of the earlier interstitials the record has already been shown. */
  let interstitialsSeen: Record<string, boolean>

  const ownerUserInfo = {
    EFFECTIVE_USER_ORCID: '0000-0001-2345-6789',
    REAL_USER_ORCID: '0000-0001-2345-6789',
  } as UserInfo

  /** 2FA on, no number stored: the state the interstitial exists for. */
  const eligibleStatus = {
    enabled: true,
  } as Status

  function userRecord(
    userInfo: UserInfo = ownerUserInfo,
    emailDomains: any[] = [{ value: 'example.edu', visibility: 'PUBLIC' }]
  ): UserRecord {
    return {
      userInfo,
      emails: {
        emails: [{ value: 'test@example.edu' }],
        emailDomains,
        errors: [],
      } as unknown as EmailsEndpoint,
    } as UserRecord
  }

  function providers() {
    return [
      LoginRecoveryPhoneInterstitialManagerService,
      { provide: MatDialog, useValue: mockMatDialog },
      { provide: InterstitialsService, useValue: mockInterstitialsService },
      { provide: TogglzService, useValue: mockTogglzService },
      { provide: QaFlagsService, useValue: mockQaFlagsService },
      {
        provide: InterstitialObservabilityService,
        useValue: mockObservability,
      },
      {
        provide: TwoFactorAuthenticationService,
        useValue: mockTwoFactorService,
      },
    ]
  }

  beforeEach(() => {
    mockMatDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open'])
    mockInterstitialsService = jasmine.createSpyObj<InterstitialsService>(
      'InterstitialsService',
      ['getInterstitialsViewed', 'setInterstitialsViewed']
    )
    mockTogglzService = jasmine.createSpyObj<TogglzService>('TogglzService', [
      'getStateOf',
    ])
    mockQaFlagsService = jasmine.createSpyObj<QaFlagsService>(
      'QaFlagsService',
      ['isFlagEnabled']
    )
    mockObservability = jasmine.createSpyObj<InterstitialObservabilityService>(
      'InterstitialObservabilityService',
      ['shown', 'outcome', 'closed']
    )
    mockTwoFactorService = jasmine.createSpyObj<TwoFactorAuthenticationService>(
      'TwoFactorAuthenticationService',
      ['checkState']
    )

    // Everything qualifying by default; each test breaks exactly one gate
    interstitialsSeen = {
      DOMAIN_INTERSTITIAL: true,
      AFFILIATION_INTERSTITIAL: true,
    }
    mockInterstitialsService.getInterstitialsViewed.and.callFake(
      (name: InterstitialType) => of(!!interstitialsSeen[name])
    )
    mockTogglzService.getStateOf.and.returnValue(of(true))
    mockTwoFactorService.checkState.and.returnValue(of(eligibleStatus))

    TestBed.configureTestingModule({
      providers: [...providers(), WINDOW_PROVIDERS],
    })

    service = TestBed.inject(LoginRecoveryPhoneInterstitialManagerService)
  })

  describe('Constants', () => {
    it('should have the correct INTERSTITIAL_NAME', () => {
      expect(service.INTERSTITIAL_NAME).toBe(
        'RECOVERY_PHONE_INTERSTITIAL' as InterstitialType
      )
    })

    it('should declare only the LOGIN togglz, which is what scopes it to sign in', () => {
      expect(service.INTERSTITIAL_TOGGLE).toEqual([
        TogglzFlag.LOGIN_RECOVERY_PHONE_INTERSTITIAL,
      ])
    })

    it('should have the correct QA_FLAG_FOR_FORCE_INTERSTITIAL_AS_NEVER_SEEN', () => {
      expect(service.QA_FLAG_FOR_FORCE_INTERSTITIAL_AS_NEVER_SEEN).toBe(
        QaFlag.forceRecoveryPhoneInterstitialNotSeem
      )
    })
  })

  describe('getInterstitialTogglz', () => {
    it('should resolve the LOGIN togglz', (done) => {
      service.getInterstitialTogglz('LOGIN').subscribe((state) => {
        expect(mockTogglzService.getStateOf).toHaveBeenCalledWith(
          TogglzFlag.LOGIN_RECOVERY_PHONE_INTERSTITIAL
        )
        expect(state).toBeTrue()
        done()
      })
    })

    it('should find no flag at all on the OAuth flow', (done) => {
      // There is no OAUTH_ entry, so the prefix lookup misses and the real
      // TogglzService answers false for an undefined flag. That miss is what
      // keeps this interstitial off the OAuth chain (R6.1).
      service.getInterstitialTogglz('OAUTH').subscribe(() => {
        expect(mockTogglzService.getStateOf).toHaveBeenCalledWith(
          undefined as any
        )
        done()
      })
    })
  })

  describe('userIsElegibleForInterstitial', () => {
    it('should return true when every gate passes', (done) => {
      service.userIsElegibleForInterstitial(userRecord()).subscribe((ok) => {
        expect(ok).toBeTrue()
        done()
      })
    })

    it('should return false on impersonation', (done) => {
      service
        .userIsElegibleForInterstitial(
          userRecord({
            EFFECTIVE_USER_ORCID: '0000-0001-2345-6789',
            REAL_USER_ORCID: '0000-0002-0000-0000',
          } as UserInfo)
        )
        .subscribe((ok) => {
          expect(ok).toBeFalse()
          expect(mockTwoFactorService.checkState).not.toHaveBeenCalled()
          done()
        })
    })

    it('should return false inside a popup window', (done) => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        providers: [
          ...providers(),
          { provide: WINDOW, useValue: { opener: {} } },
        ],
      })

      TestBed.inject(LoginRecoveryPhoneInterstitialManagerService)
        .userIsElegibleForInterstitial(userRecord())
        .subscribe((ok) => {
          expect(ok).toBeFalse()
          done()
        })
    })

    it('should return false, without asking the backend anything, when the record has no email domain', (done) => {
      service
        .userIsElegibleForInterstitial(userRecord(ownerUserInfo, []))
        .subscribe((ok) => {
          expect(ok).toBeFalse()
          // The cheap gate short circuits before any request is made
          expect(
            mockInterstitialsService.getInterstitialsViewed
          ).not.toHaveBeenCalled()
          expect(mockTogglzService.getStateOf).not.toHaveBeenCalled()
          expect(mockTwoFactorService.checkState).not.toHaveBeenCalled()
          done()
        })
    })

    it('should return false when the public domains interstitial has not been seen', (done) => {
      interstitialsSeen['DOMAIN_INTERSTITIAL'] = false

      service.userIsElegibleForInterstitial(userRecord()).subscribe((ok) => {
        expect(ok).toBeFalse()
        done()
      })
    })

    it('should return false when the affiliation interstitial has not been seen', (done) => {
      interstitialsSeen['AFFILIATION_INTERSTITIAL'] = false

      service.userIsElegibleForInterstitial(userRecord()).subscribe((ok) => {
        expect(ok).toBeFalse()
        done()
      })
    })

    it('should return false when the recovery phone feature is off', (done) => {
      mockTogglzService.getStateOf.and.callFake((flag: TogglzFlag) =>
        of(flag !== TogglzFlag.TWO_FACTOR_RECOVERY_PHONE)
      )

      service.userIsElegibleForInterstitial(userRecord()).subscribe((ok) => {
        expect(mockTogglzService.getStateOf).toHaveBeenCalledWith(
          TogglzFlag.TWO_FACTOR_RECOVERY_PHONE
        )
        expect(ok).toBeFalse()
        done()
      })
    })

    it('should return false when 2FA is not active on the account', (done) => {
      // There is nothing to back up when 2FA is off
      mockTwoFactorService.checkState.and.returnValue(
        of({ enabled: false } as Status)
      )

      service.userIsElegibleForInterstitial(userRecord()).subscribe((ok) => {
        expect(ok).toBeFalse()
        done()
      })
    })

    it('should return false when a recovery number is already stored', (done) => {
      mockTwoFactorService.checkState.and.returnValue(
        of({
          enabled: true,
          maskedRecoveryPhoneNumber: '***********6789',
        } as Status)
      )

      service.userIsElegibleForInterstitial(userRecord()).subscribe((ok) => {
        expect(ok).toBeFalse()
        done()
      })
    })

    it('should fail closed when the 2FA status request fails', (done) => {
      // Being shown is what marks the interstitial seen, so an eligibility
      // lookup that throws must decline rather than propagate: the user would
      // otherwise be charged for a view they never got
      mockTwoFactorService.checkState.and.returnValue(
        throwError(() => new Error('500 Server Error'))
      )

      service.userIsElegibleForInterstitial(userRecord()).subscribe({
        next: (ok) => expect(ok).toBeFalse(),
        error: () => fail('eligibility must not propagate the error'),
        complete: () => done(),
      })
    })

    it('should fail closed when the already-seen lookup fails', (done) => {
      mockInterstitialsService.getInterstitialsViewed.and.returnValue(
        throwError(() => new Error('403 Forbidden'))
      )

      service.userIsElegibleForInterstitial(userRecord()).subscribe({
        next: (ok) => expect(ok).toBeFalse(),
        error: () => fail('eligibility must not propagate the error'),
        complete: () => done(),
      })
    })
  })

  describe('getDialogComponentToShow', () => {
    it('should return RecoveryPhoneInterstitialDialogComponent', () => {
      expect(service.getDialogComponentToShow()).toBe(
        RecoveryPhoneInterstitialDialogComponent
      )
    })
  })

  describe('getComponentToShow', () => {
    it('should return the base component for an inline host', () => {
      expect(service.getComponentToShow()).toBe(
        RecoveryPhoneInterstitialComponent
      )
    })
  })

  describe('getDialogDataToShow', () => {
    it('should carry only the discriminator', () => {
      expect(service.getDialogDataToShow(userRecord())).toEqual({
        type: 'recovery-phone-interstitial',
      })
    })
  })

  describe('getDefaultDialogConfig', () => {
    it('should give the dialog an accessible name and hide the record behind it', () => {
      const config = (service as any).getDefaultDialogConfig({
        type: 'recovery-phone-interstitial',
      })

      expect(config.ariaLabel).toBeTruthy()
      expect(config.ariaModal).toBeTrue()
      // Inherited from the shared config: 580px and undismissable (R6.2)
      expect(config.width).toBe('580px')
      expect(config.disableClose).toBeTrue()
    })
  })

  describe('showInterstitialAsDialog', () => {
    it('should record the visit, open the dialog and hand back its result', (done) => {
      mockInterstitialsService.setInterstitialsViewed.and.returnValue(of(null))
      const afterClosed$ = new Subject<any>()
      const mockDialogRef = jasmine.createSpyObj<MatDialogRef<any>>(
        'MatDialogRef',
        ['afterClosed']
      )
      mockDialogRef.afterClosed.and.returnValue(afterClosed$.asObservable())
      mockMatDialog.open.and.returnValue(mockDialogRef)

      service.showInterstitialAsDialog(userRecord()).subscribe((result) => {
        expect(result).toEqual({
          type: 'recovery-phone-interstitial',
          addedRecoveryPhone: '***********6789',
        })
        done()
      })

      expect(
        mockInterstitialsService.setInterstitialsViewed
      ).toHaveBeenCalledWith('RECOVERY_PHONE_INTERSTITIAL')
      expect(mockObservability.shown).toHaveBeenCalledWith(
        'RECOVERY_PHONE_INTERSTITIAL'
      )

      afterClosed$.next({
        type: 'recovery-phone-interstitial',
        addedRecoveryPhone: '***********6789',
      })
      afterClosed$.complete()
    })
  })
})
