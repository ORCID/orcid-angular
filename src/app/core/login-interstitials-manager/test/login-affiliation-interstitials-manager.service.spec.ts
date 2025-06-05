import { TestBed } from '@angular/core/testing'
import {
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog'
import { of, Subject } from 'rxjs'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'

import { UserRecord } from 'src/app/types/record.local'
import { InterstitialType } from 'src/app/cdk/interstitials/interstitial.type'
import { TogglzService } from '../../togglz/togglz.service'
import { QaFlagsService } from '../../qa-flag/qa-flag.service'
import { QaFlag } from '../../qa-flag/qa-flags.enum'
import { LoginAffiliationInterstitialManagerService } from '../implementations/login-affiliation-interstitials-manager.service'
import { AffiliationsInterstitialDialogComponent } from 'src/app/cdk/interstitials/affiliations-interstitial/interstitial-dialog-extend/affiliations-interstitial-dialog.component'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'

describe('LoginAffiliationInterstitialManagerService', () => {
  let service: LoginAffiliationInterstitialManagerService

  // Create mocks for each of the injected dependencies
  let mockMatDialog: jasmine.SpyObj<MatDialog>
  let mockInterstitialsService: jasmine.SpyObj<InterstitialsService>
  let mockTogglzService: jasmine.SpyObj<TogglzService>
  let mockQaFlagsService: jasmine.SpyObj<QaFlagsService>

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

    TestBed.configureTestingModule({
      providers: [
        LoginAffiliationInterstitialManagerService,
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: TogglzService, useValue: mockTogglzService },
        { provide: InterstitialsService, useValue: mockInterstitialsService },
        { provide: QaFlagsService, useValue: mockQaFlagsService },
        WINDOW_PROVIDERS,
      ],
    })

    service = TestBed.inject(LoginAffiliationInterstitialManagerService)
  })

  describe('Constants', () => {
    it('should have the correct InterstitialType', () => {
      expect(service.INTERSTITIAL_NAME).toEqual(
        'AFFILIATION_INTERSTITIAL' as InterstitialType
      )
    })

    it('should have the correct Interstitial Toggle name', () => {
      expect(service.INTERSTITIAL_TOGGLE).toEqual([
        'LOGIN_AFFILIATION_INTERSTITIAL',
        'OAUTH_AFFILIATION_INTERSTITIAL',
      ] as string[])
    })

    it('should have the correct QA_FLAG_FOR_FORCE_INTERSTITIAL_AS_NEVER_SEEN', () => {
      expect(service.QA_FLAG_FOR_FORCE_INTERSTITIAL_AS_NEVER_SEEN).toEqual(
        QaFlag.forceAffiliationInterstitialNotSeem
      )
    })
  })

  describe('userIsElegibleForInterstitial', () => {
    it('should return false if user has no emailDomains', (done) => {
      const userRecord = {
        emails: { emailDomains: [] },
      } as unknown as UserRecord

      service
        .userIsElegibleForInterstitial(userRecord)
        .subscribe((isEligible) => {
          expect(isEligible).toBeFalse()
          done()
        })
    })

    it('should return false if user has an employment affiliation', (done) => {
      // The presence of "type=EMPLOYMENT" & a nonempty "affiliationGroup" should force false
      const userRecord = {
        emails: { emailDomains: ['myuniversity.edu'] },
        affiliations: [
          {
            type: 'EMPLOYMENT',
            affiliationGroup: ['Some Employment Data'],
          },
        ],
      } as unknown as UserRecord

      service
        .userIsElegibleForInterstitial(userRecord)
        .subscribe((isEligible) => {
          expect(isEligible).toBeFalse()
          done()
        })
    })

    it('should return true if user has an email domain but no EMPLOYMENT affiliation', (done) => {
      const userRecord = {
        emails: { emailDomains: ['myuniversity.edu'] },
        affiliations: [],
      } as unknown as UserRecord

      service
        .userIsElegibleForInterstitial(userRecord)
        .subscribe((isEligible) => {
          expect(isEligible).toBeTrue()
          done()
        })
    })
  })

  describe('getDialogComponentToShow', () => {
    it('should return the AffiliationsInterstitialDialogComponent', () => {
      const component = service.getDialogComponentToShow()
      expect(component).toBe(AffiliationsInterstitialDialogComponent)
    })
  })

  describe('getDialogDataToShow', () => {
    it('should build the correct data object from the user record', () => {
      const userRecord = {
        emails: { emailDomains: ['myuniversity.edu'], verified: [] },
      } as unknown as UserRecord

      const result = service.getDialogDataToShow(userRecord)
      expect(result).toEqual({
        type: 'affiliation-interstitial',
      })
    })
  })

  describe('showInterstitial', () => {
    it("should mark interstitial as viewed, open dialog, and return the dialog's afterClosed observable", (done) => {
      // Arrange
      const userRecord = {
        emails: { emailDomains: ['myuniversity.edu'] },
      } as unknown as UserRecord

      // Pretend the setInterstitialsViewed call completes
      mockInterstitialsService.setInterstitialsViewed.and.returnValue(of(true))

      // Mock for matDialog.open(...).afterClosed()
      const afterClosed$ = new Subject<any>()
      const mockDialogRef = jasmine.createSpyObj<MatDialogRef<any>>(
        'MatDialogRef',
        ['afterClosed']
      )
      mockDialogRef.afterClosed.and.returnValue(afterClosed$.asObservable())

      // This is what matDialog.open should return
      mockMatDialog.open.and.returnValue(mockDialogRef)

      // Act
      service.showInterstitialAsDialog(userRecord).subscribe((dialogResult) => {
        // We expect to get the value we passed into afterClosed$.next(...) eventually.
        expect(dialogResult).toEqual({ type: 'affiliation-interstitial' })
        done()
      })

      // Assert
      expect(
        mockInterstitialsService.setInterstitialsViewed
      ).toHaveBeenCalledWith('AFFILIATION_INTERSTITIAL')
      expect(mockMatDialog.open).toHaveBeenCalled()

      // Simulate the dialog closing:
      afterClosed$.next({ type: 'affiliation-interstitial' })
      afterClosed$.complete()
    })
  })
})
