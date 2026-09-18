import { fakeAsync, TestBed, tick } from '@angular/core/testing'
import { of, EMPTY, throwError } from 'rxjs'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { UserRecord } from 'src/app/types/record.local'
import { EmailsEndpoint, UserInfo } from 'src/app/types'
import { AffiliationUIGroup } from 'src/app/types/record-affiliation.endpoint'
import { LoginAffiliationInterstitialManagerService } from '../implementations/login-affiliation-interstitials-manager.service'
import { LoginDomainInterstitialManagerService } from '../implementations/login-domain-interstitials-manager.service'
import { LoginBackupEmailInterstitialManagerService } from '../implementations/login-backup-email-interstitials-manager.service'
import { LoginMainInterstitialsManagerService } from '../login-main-interstitials-manager.service'
import { ShareEmailsDomainsComponentDialogOutput } from 'src/app/cdk/interstitials/share-emails-domains/interstitial-dialog-extend/share-emails-domains-dialog.component'
import { AffilationsComponentDialogOutput } from 'src/app/cdk/interstitials/affiliations-interstitial/interstitial-dialog-extend/affiliations-interstitial-dialog.component'
import { BackupEmailComponentDialogOutput } from 'src/app/cdk/interstitials/backup-email/interstitial-dialog-extend/backup-email-dialog.component'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { OauthURLSessionManagerService } from '../../oauth-urlsession-manager/oauth-urlsession-manager.service'
import { PlatformInfo } from 'src/app/cdk/platform-info/platform-info.type'

// Mock runtime environment for debugging logs if needed
// (Remove or adapt if your environment differs)
declare const runtimeEnvironment: any
runtimeEnvironment.debugger = true

describe('LoginMainInterstitialsManagerService', () => {
  let service: LoginMainInterstitialsManagerService

  // Mocks for dependencies
  let mockInterstitialsService: jasmine.SpyObj<InterstitialsService>
  let mockLoginDomainInterstitialManagerService: jasmine.SpyObj<LoginDomainInterstitialManagerService>
  let mockLoginAffiliationInterstitialManagerService: jasmine.SpyObj<LoginAffiliationInterstitialManagerService>
  let mockLoginBackupEmailInterstitialManagerService: jasmine.SpyObj<LoginBackupEmailInterstitialManagerService>
  let mockPlatformInfoService: jasmine.SpyObj<PlatformInfoService>
  let oauthUrlSession: OauthURLSessionManagerService

  // Example valid user
  const validUserRecord: UserRecord = {
    userInfo: {
      EFFECTIVE_USER_ORCID: '0000-0001-2345-6789',
      REAL_USER_ORCID: '0000-0001-2345-6789',
    } as UserInfo,
    emails: {
      emails: [{ value: 'test@example.com' }],
      emailDomains: [],
      errors: [],
    },
    affiliations: [
      { type: 'EMPLOYMENT', affiliationGroup: [] },
    ] as AffiliationUIGroup[],
  } as UserRecord

  // Example invalid user (missing affiliations)
  const invalidUserRecord: UserRecord = {
    userInfo: {
      EFFECTIVE_USER_ORCID: '0000-0001-2345-6789',
      REAL_USER_ORCID: '0000-0001-2345-6789',
    } as UserInfo,
    emails: {
      emails: [{ value: 'test@example.com' }],
      emailDomains: [],
      errors: [],
    },
    affiliations: undefined, // No affiliations,
  } as UserRecord

  beforeEach(() => {
    localStorage.removeItem('oauthJustRegistered')
    // Create spy objects for each dependency
    mockInterstitialsService = jasmine.createSpyObj<InterstitialsService>(
      'InterstitialsService',
      [
        'checkIfSessionAlreadyCheckedInterstitialsLogic',
        'markCurrentSessionToNoCheckInterstitialsLogic',
      ]
    )

    mockLoginDomainInterstitialManagerService =
      jasmine.createSpyObj<LoginDomainInterstitialManagerService>(
        'LoginDomainInterstitialManagerService',
        [
          'userIsElegibleForInterstitial',
          'getInterstitialTogglz',
          'getInterstitialViewed',
          'showInterstitialAsDialog',
        ],
        {
          // if needed, you can define read-only property stubs here
          INTERSTITIAL_NAME: 'DOMAIN_INTERSTITIAL',
        }
      )

    mockLoginAffiliationInterstitialManagerService =
      jasmine.createSpyObj<LoginAffiliationInterstitialManagerService>(
        'LoginAffiliationInterstitialManagerService',
        [
          'userIsElegibleForInterstitial',
          'getInterstitialTogglz',
          'getInterstitialViewed',
          'showInterstitialAsDialog',
        ],
        {
          INTERSTITIAL_NAME: 'AFFILIATION_INTERSTITIAL',
        }
      )

    mockLoginBackupEmailInterstitialManagerService =
      jasmine.createSpyObj<LoginBackupEmailInterstitialManagerService>(
        'LoginBackupEmailInterstitialManagerService',
        [
          'userIsElegibleForInterstitial',
          'getInterstitialTogglz',
          'getInterstitialViewed',
          'showInterstitialAsDialog',
          'showInterstitialAsComponent',
        ],
        {
          INTERSTITIAL_NAME: 'BACKUP_EMAIL_INTERSTITIAL',
        }
      )
    // The backup email interstitial runs first, tests that assert on the other
    // two opt it out unless they are exercising the ordering itself
    mockLoginBackupEmailInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
      of(false)
    )

    mockPlatformInfoService = jasmine.createSpyObj<PlatformInfoService>(
      'PlatformInfoService',
      ['get']
    )
    // No `justRegistered` parameter unless a test says otherwise
    mockPlatformInfoService.get.and.returnValue(
      of({ queryParameters: {} } as unknown as PlatformInfo)
    )

    // Provide the service along with its mocked dependencies
    TestBed.configureTestingModule({
      providers: [
        LoginMainInterstitialsManagerService,
        { provide: InterstitialsService, useValue: mockInterstitialsService },
        { provide: PlatformInfoService, useValue: mockPlatformInfoService },
        // Real service on purpose: it has no constructor dependencies, so the
        // OAuth just-registered flag is exercised through actual localStorage
        // rather than a spy that could drift from the real read.
        OauthURLSessionManagerService,
        {
          provide: LoginDomainInterstitialManagerService,
          useValue: mockLoginDomainInterstitialManagerService,
        },
        {
          provide: LoginAffiliationInterstitialManagerService,
          useValue: mockLoginAffiliationInterstitialManagerService,
        },
        {
          provide: LoginBackupEmailInterstitialManagerService,
          useValue: mockLoginBackupEmailInterstitialManagerService,
        },
      ],
    })

    oauthUrlSession = TestBed.inject(OauthURLSessionManagerService)
    service = TestBed.inject(LoginMainInterstitialsManagerService)
  })

  afterEach(() => {
    localStorage.removeItem('oauthJustRegistered')
    // Reset calls so each test starts fresh
    jasmine.clock().uninstall()
    mockInterstitialsService.checkIfSessionAlreadyCheckedInterstitialsLogic.calls.reset()
    mockInterstitialsService.markCurrentSessionToNoCheckInterstitialsLogic.calls.reset()
    mockLoginDomainInterstitialManagerService.userIsElegibleForInterstitial.calls.reset()
    mockLoginDomainInterstitialManagerService.getInterstitialTogglz.calls.reset()
    mockLoginDomainInterstitialManagerService.getInterstitialViewed.calls.reset()
    mockLoginDomainInterstitialManagerService.showInterstitialAsDialog.calls.reset()
    mockLoginAffiliationInterstitialManagerService.userIsElegibleForInterstitial.calls.reset()
    mockLoginAffiliationInterstitialManagerService.getInterstitialTogglz.calls.reset()
    mockLoginAffiliationInterstitialManagerService.getInterstitialViewed.calls.reset()
    mockLoginAffiliationInterstitialManagerService.showInterstitialAsDialog.calls.reset()
    mockLoginBackupEmailInterstitialManagerService.userIsElegibleForInterstitial.calls.reset()
    mockLoginBackupEmailInterstitialManagerService.getInterstitialTogglz.calls.reset()
    mockLoginBackupEmailInterstitialManagerService.getInterstitialViewed.calls.reset()
    mockLoginBackupEmailInterstitialManagerService.showInterstitialAsDialog.calls.reset()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should return EMPTY immediately if userRecord is invalid', (done) => {
    // This user is invalid because there are no affiliations
    service
      .checkLoginInterstitials(invalidUserRecord, {
        returnType: 'dialog',
        togglzPrefix: 'LOGIN',
      })
      .subscribe({
        next: () => fail('Should not emit any value'),
        complete: () => {
          // No calls should be made
          expect(
            mockLoginDomainInterstitialManagerService.userIsElegibleForInterstitial
          ).not.toHaveBeenCalled()
          expect(
            mockLoginAffiliationInterstitialManagerService.userIsElegibleForInterstitial
          ).not.toHaveBeenCalled()

          done()
        },
      })
  })

  it('should return EMPTY immediately if session is already checked', (done) => {
    // Mark session as already checked
    mockInterstitialsService.checkIfSessionAlreadyCheckedInterstitialsLogic.and.returnValue(
      true
    )

    service
      .checkLoginInterstitials(validUserRecord, {
        returnType: 'dialog',
        togglzPrefix: 'LOGIN',
      })
      .subscribe({
        next: () => fail('Should not emit any value'),
        complete: () => {
          // No calls to the interstitial services if session is already checked
          expect(
            mockLoginDomainInterstitialManagerService.userIsElegibleForInterstitial
          ).not.toHaveBeenCalled()
          expect(
            mockLoginAffiliationInterstitialManagerService.userIsElegibleForInterstitial
          ).not.toHaveBeenCalled()

          done()
        },
      })
  })

  it('should call only the first service that is eligible, togglz on, and not previously viewed', fakeAsync(() => {
    // Session not checked previously
    mockInterstitialsService.checkIfSessionAlreadyCheckedInterstitialsLogic.and.returnValue(
      false
    )

    // First service (DomainInterstitial) is eligible
    mockLoginDomainInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
      of(true)
    )
    mockLoginDomainInterstitialManagerService.getInterstitialTogglz.and.returnValue(
      of(true)
    )
    mockLoginDomainInterstitialManagerService.getInterstitialViewed.and.returnValue(
      of(false)
    )
    mockLoginDomainInterstitialManagerService.showInterstitialAsDialog.and.returnValue(
      of({
        type: 'domains-interstitial',
      } as ShareEmailsDomainsComponentDialogOutput)
    )

    // We won't even get to LoginAffiliationInterstitialManagerService in this scenario
    mockLoginAffiliationInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
      of(true)
    ) // Irrelevant, won't be called
    mockLoginAffiliationInterstitialManagerService.getInterstitialTogglz.and.returnValue(
      of(true)
    )
    mockLoginAffiliationInterstitialManagerService.getInterstitialViewed.and.returnValue(
      of(false)
    )
    mockLoginAffiliationInterstitialManagerService.showInterstitialAsDialog.and.returnValue(
      of({} as AffilationsComponentDialogOutput)
    )

    service
      .checkLoginInterstitials(validUserRecord, {
        returnType: 'dialog',
        togglzPrefix: 'LOGIN',
      })
      .subscribe({
        next: (result) => {
          // Expect it to be the domain result
          expect(result).toEqual({
            type: 'domains-interstitial',
          } as ShareEmailsDomainsComponentDialogOutput)
        },
        complete: () => {
          // LoginDomainInterstitialManagerService should have been fully called
          expect(
            mockLoginDomainInterstitialManagerService.userIsElegibleForInterstitial
          ).toHaveBeenCalled()
          expect(
            mockLoginDomainInterstitialManagerService.getInterstitialTogglz
          ).toHaveBeenCalled()
          expect(
            mockLoginDomainInterstitialManagerService.getInterstitialViewed
          ).toHaveBeenCalled()
          expect(
            mockLoginDomainInterstitialManagerService.showInterstitialAsDialog
          ).toHaveBeenCalled()

          // Affiliation service should NOT have been used
          expect(
            mockLoginAffiliationInterstitialManagerService.userIsElegibleForInterstitial
          ).not.toHaveBeenCalled()
        },
      })
    tick(1)

    // Finalize block
    expect(
      mockInterstitialsService.markCurrentSessionToNoCheckInterstitialsLogic
    ).toHaveBeenCalled()
  }))

  it('should show the backup email interstitial first when every interstitial is available', fakeAsync(() => {
    mockInterstitialsService.checkIfSessionAlreadyCheckedInterstitialsLogic.and.returnValue(
      false
    )

    mockLoginBackupEmailInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
      of(true)
    )
    mockLoginBackupEmailInterstitialManagerService.getInterstitialTogglz.and.returnValue(
      of(true)
    )
    mockLoginBackupEmailInterstitialManagerService.getInterstitialViewed.and.returnValue(
      of(false)
    )
    mockLoginBackupEmailInterstitialManagerService.showInterstitialAsDialog.and.returnValue(
      of({
        type: 'backup-email-interstitial',
      } as BackupEmailComponentDialogOutput)
    )

    // Both of these would also qualify, the ordering must keep them out
    mockLoginDomainInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
      of(true)
    )
    mockLoginAffiliationInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
      of(true)
    )

    service
      .checkLoginInterstitials(validUserRecord, {
        returnType: 'dialog',
        togglzPrefix: 'LOGIN',
      })
      .subscribe({
        next: (result) => {
          expect(result).toEqual({
            type: 'backup-email-interstitial',
          } as BackupEmailComponentDialogOutput)
        },
        complete: () => {
          expect(
            mockLoginBackupEmailInterstitialManagerService.showInterstitialAsDialog
          ).toHaveBeenCalled()
          expect(
            mockLoginDomainInterstitialManagerService.userIsElegibleForInterstitial
          ).not.toHaveBeenCalled()
          expect(
            mockLoginAffiliationInterstitialManagerService.userIsElegibleForInterstitial
          ).not.toHaveBeenCalled()
        },
      })
    tick(1)

    expect(
      mockInterstitialsService.markCurrentSessionToNoCheckInterstitialsLogic
    ).toHaveBeenCalled()
  }))

  it('should fall through to the domains interstitial when the backup email togglz is off', fakeAsync(() => {
    mockInterstitialsService.checkIfSessionAlreadyCheckedInterstitialsLogic.and.returnValue(
      false
    )

    mockLoginBackupEmailInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
      of(true)
    )
    mockLoginBackupEmailInterstitialManagerService.getInterstitialTogglz.and.returnValue(
      of(false)
    )

    mockLoginDomainInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
      of(true)
    )
    mockLoginDomainInterstitialManagerService.getInterstitialTogglz.and.returnValue(
      of(true)
    )
    mockLoginDomainInterstitialManagerService.getInterstitialViewed.and.returnValue(
      of(false)
    )
    mockLoginDomainInterstitialManagerService.showInterstitialAsDialog.and.returnValue(
      of({
        type: 'domains-interstitial',
      } as ShareEmailsDomainsComponentDialogOutput)
    )

    service
      .checkLoginInterstitials(validUserRecord, {
        returnType: 'dialog',
        togglzPrefix: 'LOGIN',
      })
      .subscribe({
        next: (result) => {
          expect(result).toEqual({ type: 'domains-interstitial' })
        },
        complete: () => {
          expect(
            mockLoginBackupEmailInterstitialManagerService.showInterstitialAsDialog
          ).not.toHaveBeenCalled()
          expect(
            mockLoginDomainInterstitialManagerService.showInterstitialAsDialog
          ).toHaveBeenCalled()
        },
      })
    tick(1)
  }))

  it('should proceed to second service if first service is not eligible or togglz is off or was viewed already', fakeAsync(() => {
    mockInterstitialsService.checkIfSessionAlreadyCheckedInterstitialsLogic.and.returnValue(
      false
    )

    // First service: user is eligible but togglz is FALSE -> skip
    mockLoginDomainInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
      of(true)
    )
    mockLoginDomainInterstitialManagerService.getInterstitialTogglz.and.returnValue(
      of(false)
    ) // togglz is off
    // Since togglz is off, it won't call getInterstitialViewed or showInterstitial for the domain service
    mockLoginDomainInterstitialManagerService.getInterstitialViewed.and.returnValue(
      of(false)
    )
    mockLoginDomainInterstitialManagerService.showInterstitialAsDialog.and.returnValue(
      of({
        type: 'domains-interstitial',
      } as ShareEmailsDomainsComponentDialogOutput)
    )

    // Second service: user is eligible, togglz on, not viewed
    mockLoginAffiliationInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
      of(true)
    )
    mockLoginAffiliationInterstitialManagerService.getInterstitialTogglz.and.returnValue(
      of(true)
    )
    mockLoginAffiliationInterstitialManagerService.getInterstitialViewed.and.returnValue(
      of(false)
    )
    mockLoginAffiliationInterstitialManagerService.showInterstitialAsDialog.and.returnValue(
      of({
        type: 'affiliation-interstitial',
      } as AffilationsComponentDialogOutput)
    )

    service
      .checkLoginInterstitials(validUserRecord, {
        returnType: 'dialog',
        togglzPrefix: 'LOGIN',
      })
      .subscribe({
        next: (result) => {
          // Expect it to come from the affiliation service
          expect(result).toEqual({ type: 'affiliation-interstitial' })
        },
        complete: () => {
          // LoginDomainInterstitialManagerService should have been called partially
          expect(
            mockLoginDomainInterstitialManagerService.userIsElegibleForInterstitial
          ).toHaveBeenCalled()
          expect(
            mockLoginDomainInterstitialManagerService.getInterstitialTogglz
          ).toHaveBeenCalled()
          // But not getInterstitialViewed or showInterstitial because togglz returned false
          expect(
            mockLoginDomainInterstitialManagerService.getInterstitialViewed
          ).not.toHaveBeenCalled()
          expect(
            mockLoginDomainInterstitialManagerService.showInterstitialAsDialog
          ).not.toHaveBeenCalled()

          // Then second service steps in
          expect(
            mockLoginAffiliationInterstitialManagerService.userIsElegibleForInterstitial
          ).toHaveBeenCalled()
          expect(
            mockLoginAffiliationInterstitialManagerService.getInterstitialTogglz
          ).toHaveBeenCalled()
          expect(
            mockLoginAffiliationInterstitialManagerService.getInterstitialViewed
          ).toHaveBeenCalled()
          expect(
            mockLoginAffiliationInterstitialManagerService.showInterstitialAsDialog
          ).toHaveBeenCalled()
        },
      })
    tick(0)
    // Finalize block
    expect(
      mockInterstitialsService.markCurrentSessionToNoCheckInterstitialsLogic
    ).toHaveBeenCalled()
  }))

  it('should handle a case where no services are eligible / togglz on / not viewed, returning EMPTY', fakeAsync(() => {
    mockInterstitialsService.checkIfSessionAlreadyCheckedInterstitialsLogic.and.returnValue(
      false
    )

    // Make both services ineligible
    mockLoginDomainInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
      of(false)
    )
    mockLoginAffiliationInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
      of(false)
    )

    service
      .checkLoginInterstitials(validUserRecord, {
        returnType: 'dialog',
        togglzPrefix: 'LOGIN',
      })
      .subscribe({
        next: () => fail('No interstitial should be shown'),
        complete: () => {
          // We checked both services but neither was eligible
          expect(
            mockLoginDomainInterstitialManagerService.getInterstitialTogglz
          ).not.toHaveBeenCalled()
          expect(
            mockLoginDomainInterstitialManagerService.getInterstitialViewed
          ).not.toHaveBeenCalled()
          expect(
            mockLoginDomainInterstitialManagerService.showInterstitialAsDialog
          ).not.toHaveBeenCalled()

          expect(
            mockLoginAffiliationInterstitialManagerService.getInterstitialTogglz
          ).not.toHaveBeenCalled()
          expect(
            mockLoginAffiliationInterstitialManagerService.getInterstitialViewed
          ).not.toHaveBeenCalled()
          expect(
            mockLoginAffiliationInterstitialManagerService.showInterstitialAsDialog
          ).not.toHaveBeenCalled()
        },
      })
    tick(1)

    // Finalize block still runs
    expect(
      mockInterstitialsService.markCurrentSessionToNoCheckInterstitialsLogic
    ).toHaveBeenCalled()
  }))

  it('should still call finalize block if an error occurs in an interstitial service', (done) => {
    mockInterstitialsService.checkIfSessionAlreadyCheckedInterstitialsLogic.and.returnValue(
      false
    )

    // First service errors out
    mockLoginDomainInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
      throwError(() => new Error('Service error'))
    )

    // We do not expect the second service to be called since the pipeline errors out
    mockLoginAffiliationInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
      of(true)
    )

    service
      .checkLoginInterstitials(validUserRecord, {
        returnType: 'dialog',
        togglzPrefix: 'LOGIN',
      })
      .subscribe({
        next: () => fail('Should not emit a valid result due to error'),
        error: (err) => {
          expect(err).toBeTruthy()
        },
        complete: () => {
          fail('Should not complete if there was an error thrown')
        },
      })

    // Wait a tick for finalize to trigger
    setTimeout(() => {
      expect(
        mockLoginDomainInterstitialManagerService.userIsElegibleForInterstitial
      ).toHaveBeenCalled()
      // Even on error, finalize block is called:
      expect(
        mockInterstitialsService.markCurrentSessionToNoCheckInterstitialsLogic
      ).toHaveBeenCalled()
      done()
    }, 0)
  })

  describe('a user who just registered', () => {
    it('shows no interstitial when the justRegistered query parameter is present', (done) => {
      mockInterstitialsService.checkIfSessionAlreadyCheckedInterstitialsLogic.and.returnValue(
        false
      )
      mockPlatformInfoService.get.and.returnValue(
        of({
          queryParameters: { justRegistered: 'true' },
        } as unknown as PlatformInfo)
      )
      // Would otherwise qualify
      mockLoginBackupEmailInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
        of(true)
      )

      service
        .checkLoginInterstitials(validUserRecord, {
          returnType: 'dialog',
          togglzPrefix: 'LOGIN',
        })
        .subscribe({
          next: () => fail('Should not emit any value'),
          complete: () => {
            expect(
              mockLoginBackupEmailInterstitialManagerService.userIsElegibleForInterstitial
            ).not.toHaveBeenCalled()
            expect(
              mockLoginDomainInterstitialManagerService.userIsElegibleForInterstitial
            ).not.toHaveBeenCalled()
            expect(
              mockLoginAffiliationInterstitialManagerService.userIsElegibleForInterstitial
            ).not.toHaveBeenCalled()
            // Suppressed for this session, but never marked as viewed, so it
            // still shows on the next sign in
            expect(
              mockInterstitialsService.markCurrentSessionToNoCheckInterstitialsLogic
            ).toHaveBeenCalled()
            done()
          },
        })
    })

    it('shows no interstitial in the OAuth flow, where a localStorage flag replaces the query parameter', (done) => {
      // Registering inside an OAuth request never reaches my-orcid, so the
      // backend never appends `justRegistered`; register.component sets this
      // flag instead and the user lands on the authorize page. PD-12904.
      mockInterstitialsService.checkIfSessionAlreadyCheckedInterstitialsLogic.and.returnValue(
        false
      )
      oauthUrlSession.setJustRegistered(true)
      // Would otherwise qualify
      mockLoginBackupEmailInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
        of(true)
      )

      service
        .checkLoginInterstitials(validUserRecord, {
          returnType: 'component',
          togglzPrefix: 'OAUTH',
        })
        .subscribe({
          next: () => fail('Should not emit any value'),
          complete: () => {
            expect(
              mockLoginBackupEmailInterstitialManagerService.userIsElegibleForInterstitial
            ).not.toHaveBeenCalled()
            expect(
              mockLoginDomainInterstitialManagerService.userIsElegibleForInterstitial
            ).not.toHaveBeenCalled()
            expect(
              mockLoginAffiliationInterstitialManagerService.userIsElegibleForInterstitial
            ).not.toHaveBeenCalled()
            expect(
              mockInterstitialsService.markCurrentSessionToNoCheckInterstitialsLogic
            ).toHaveBeenCalled()
            done()
          },
        })
    })

    it('still suppresses after the flag was consumed destructively by another reader', (done) => {
      // form-authorize and oauth-error consume this flag for RUM context. The
      // authorize page renders those only after the interstitial check, but the
      // gate must not depend on that ordering.
      mockInterstitialsService.checkIfSessionAlreadyCheckedInterstitialsLogic.and.returnValue(
        false
      )
      oauthUrlSession.setJustRegistered(true)
      expect(oauthUrlSession.consumeJustRegistered()).toBeTrue()
      expect(localStorage.getItem('oauthJustRegistered')).toBeNull()

      mockLoginBackupEmailInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
        of(true)
      )

      service
        .checkLoginInterstitials(validUserRecord, {
          returnType: 'component',
          togglzPrefix: 'OAUTH',
        })
        .subscribe({
          next: () => fail('Should not emit any value'),
          complete: () => {
            expect(
              mockLoginBackupEmailInterstitialManagerService.userIsElegibleForInterstitial
            ).not.toHaveBeenCalled()
            done()
          },
        })
    })

    it('does not suppress when the OAuth flag has expired', fakeAsync(() => {
      mockInterstitialsService.checkIfSessionAlreadyCheckedInterstitialsLogic.and.returnValue(
        false
      )
      localStorage.setItem(
        'oauthJustRegistered',
        JSON.stringify({ value: true, expiresAt: Date.now() - 1000 })
      )

      mockLoginBackupEmailInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
        of(true)
      )
      mockLoginBackupEmailInterstitialManagerService.getInterstitialTogglz.and.returnValue(
        of(true)
      )
      mockLoginBackupEmailInterstitialManagerService.getInterstitialViewed.and.returnValue(
        of(false)
      )
      mockLoginBackupEmailInterstitialManagerService.showInterstitialAsComponent.and.returnValue(
        of({} as any)
      )

      service
        .checkLoginInterstitials(validUserRecord, {
          returnType: 'component',
          togglzPrefix: 'OAUTH',
        })
        .subscribe()
      tick(1)

      expect(
        mockLoginBackupEmailInterstitialManagerService.showInterstitialAsComponent
      ).toHaveBeenCalled()
    }))

    it('ignores a stale OAuth flag on the my-orcid surface', fakeAsync(() => {
      // The my-orcid branch never sets this flag — it carries `justRegistered`
      // on the URL instead. A flag seen here can only be left over from an
      // unrelated OAuth flow, so it must not suppress anything.
      mockInterstitialsService.checkIfSessionAlreadyCheckedInterstitialsLogic.and.returnValue(
        false
      )
      oauthUrlSession.setJustRegistered(true)

      mockLoginBackupEmailInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
        of(true)
      )
      mockLoginBackupEmailInterstitialManagerService.getInterstitialTogglz.and.returnValue(
        of(true)
      )
      mockLoginBackupEmailInterstitialManagerService.getInterstitialViewed.and.returnValue(
        of(false)
      )
      mockLoginBackupEmailInterstitialManagerService.showInterstitialAsDialog.and.returnValue(
        of({
          type: 'backup-email-interstitial',
        } as BackupEmailComponentDialogOutput)
      )

      service
        .checkLoginInterstitials(validUserRecord, {
          returnType: 'dialog',
          togglzPrefix: 'LOGIN',
        })
        .subscribe()
      tick(1)

      expect(
        mockLoginBackupEmailInterstitialManagerService.showInterstitialAsDialog
      ).toHaveBeenCalled()
    }))

    it('still shows the interstitial without the query parameter', fakeAsync(() => {
      mockInterstitialsService.checkIfSessionAlreadyCheckedInterstitialsLogic.and.returnValue(
        false
      )

      mockLoginBackupEmailInterstitialManagerService.userIsElegibleForInterstitial.and.returnValue(
        of(true)
      )
      mockLoginBackupEmailInterstitialManagerService.getInterstitialTogglz.and.returnValue(
        of(true)
      )
      mockLoginBackupEmailInterstitialManagerService.getInterstitialViewed.and.returnValue(
        of(false)
      )
      mockLoginBackupEmailInterstitialManagerService.showInterstitialAsDialog.and.returnValue(
        of({
          type: 'backup-email-interstitial',
        } as BackupEmailComponentDialogOutput)
      )

      service
        .checkLoginInterstitials(validUserRecord, {
          returnType: 'dialog',
          togglzPrefix: 'LOGIN',
        })
        .subscribe()
      tick(1)

      expect(
        mockLoginBackupEmailInterstitialManagerService.showInterstitialAsDialog
      ).toHaveBeenCalled()
    }))
  })
})
