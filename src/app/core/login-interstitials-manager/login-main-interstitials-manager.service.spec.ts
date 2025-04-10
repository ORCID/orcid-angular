import { fakeAsync, TestBed, tick } from '@angular/core/testing'
import { of, EMPTY, throwError } from 'rxjs'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { LoginDomainInterstitialManagerService } from './login-domain-interstitials-manager.service'
import { LoginAffiliationInterstitialManagerService } from './login-affiliation-interstitials-manager.service'
import { UserRecord } from 'src/app/types/record.local'
import { ShareEmailsDomainsComponentDialogOutput } from 'src/app/cdk/interstitials/share-emails-domains/share-emails-domains-dialog.component'
import { AffilationsComponentDialogOutput } from 'src/app/cdk/interstitials/affiliations-interstitial/affiliations-interstitial-dialog.component'
import { LoginMainInterstitialsManagerService } from './login-main-interstitials-manager.service'
import { EmailsEndpoint, UserInfo } from 'src/app/types'
import { AffiliationUIGroup } from 'src/app/types/record-affiliation.endpoint'

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
          'showInterstitial',
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
          'showInterstitial',
        ],
        {
          INTERSTITIAL_NAME: 'AFFILIATION_INTERSTITIAL',
        }
      )

    // Provide the service along with its mocked dependencies
    TestBed.configureTestingModule({
      providers: [
        LoginMainInterstitialsManagerService,
        { provide: InterstitialsService, useValue: mockInterstitialsService },
        {
          provide: LoginDomainInterstitialManagerService,
          useValue: mockLoginDomainInterstitialManagerService,
        },
        {
          provide: LoginAffiliationInterstitialManagerService,
          useValue: mockLoginAffiliationInterstitialManagerService,
        },
      ],
    })

    service = TestBed.inject(LoginMainInterstitialsManagerService)
  })

  afterEach(() => {
    // Reset calls so each test starts fresh
    jasmine.clock().uninstall()
    mockInterstitialsService.checkIfSessionAlreadyCheckedInterstitialsLogic.calls.reset()
    mockInterstitialsService.markCurrentSessionToNoCheckInterstitialsLogic.calls.reset()
    mockLoginDomainInterstitialManagerService.userIsElegibleForInterstitial.calls.reset()
    mockLoginDomainInterstitialManagerService.getInterstitialTogglz.calls.reset()
    mockLoginDomainInterstitialManagerService.getInterstitialViewed.calls.reset()
    mockLoginDomainInterstitialManagerService.showInterstitial.calls.reset()
    mockLoginAffiliationInterstitialManagerService.userIsElegibleForInterstitial.calls.reset()
    mockLoginAffiliationInterstitialManagerService.getInterstitialTogglz.calls.reset()
    mockLoginAffiliationInterstitialManagerService.getInterstitialViewed.calls.reset()
    mockLoginAffiliationInterstitialManagerService.showInterstitial.calls.reset()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should return EMPTY immediately if userRecord is invalid', (done) => {
    // This user is invalid because there are no affiliations
    service.checkLoginInterstitials(invalidUserRecord).subscribe({
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

    service.checkLoginInterstitials(validUserRecord).subscribe({
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
    mockLoginDomainInterstitialManagerService.showInterstitial.and.returnValue(
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
    mockLoginAffiliationInterstitialManagerService.showInterstitial.and.returnValue(
      of({} as AffilationsComponentDialogOutput)
    )

    service.checkLoginInterstitials(validUserRecord).subscribe({
      next: (result) => {
        // Expect it to be the domain result
        expect(result).toEqual({
          type: 'domains-interstitial',
        } as ShareEmailsDomainsComponentDialogOutput)
      },
      complete: () => {
        console.log('complete')
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
          mockLoginDomainInterstitialManagerService.showInterstitial
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
    mockLoginDomainInterstitialManagerService.showInterstitial.and.returnValue(
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
    mockLoginAffiliationInterstitialManagerService.showInterstitial.and.returnValue(
      of({
        type: 'affiliation-interstitial',
      } as AffilationsComponentDialogOutput)
    )

    service.checkLoginInterstitials(validUserRecord).subscribe({
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
          mockLoginDomainInterstitialManagerService.showInterstitial
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
          mockLoginAffiliationInterstitialManagerService.showInterstitial
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

    service.checkLoginInterstitials(validUserRecord).subscribe({
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
          mockLoginDomainInterstitialManagerService.showInterstitial
        ).not.toHaveBeenCalled()

        expect(
          mockLoginAffiliationInterstitialManagerService.getInterstitialTogglz
        ).not.toHaveBeenCalled()
        expect(
          mockLoginAffiliationInterstitialManagerService.getInterstitialViewed
        ).not.toHaveBeenCalled()
        expect(
          mockLoginAffiliationInterstitialManagerService.showInterstitial
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

    service.checkLoginInterstitials(validUserRecord).subscribe({
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
})
