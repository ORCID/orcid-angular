import { TestBed } from '@angular/core/testing'
import {
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog'
import { of, Subject } from 'rxjs'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'

import { InterstitialType } from 'src/app/cdk/interstitials/interstitial.type'
import { UserRecord } from 'src/app/types/record.local'
import { AssertionVisibilityString, EmailsEndpoint } from 'src/app/types'
import { QaFlagsService } from '../../qa-flag/qa-flag.service'
import { QaFlag } from '../../qa-flag/qa-flags.enum'
import { TogglzService } from '../../togglz/togglz.service'
import { LoginDomainInterstitialManagerService } from '../implementations/login-domain-interstitials-manager.service'
import { ShareEmailsDomainsDialogComponent } from 'src/app/cdk/interstitials/share-emails-domains/interstitial-dialog-extend/share-emails-domains-dialog.component'
import { inject } from '@angular/core'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'

describe('LoginDomainInterstitialManagerService', () => {
  let service: LoginDomainInterstitialManagerService

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
        LoginDomainInterstitialManagerService,
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: InterstitialsService, useValue: mockInterstitialsService },
        { provide: TogglzService, useValue: mockTogglzService },
        { provide: QaFlagsService, useValue: mockQaFlagsService },
        WINDOW_PROVIDERS,
      ],
    })

    service = TestBed.inject(LoginDomainInterstitialManagerService)
  })

  describe('Constants', () => {
    it('should have the correct INTERSTITIAL_NAME', () => {
      expect(service.INTERSTITIAL_NAME).toBe(
        'DOMAIN_INTERSTITIAL' as InterstitialType
      )
    })

    it('should have the correct INTERSTITIAL_TOGGLE', () => {
      expect(service.INTERSTITIAL_TOGGLE).toEqual([
        'LOGIN_DOMAINS_INTERSTITIAL',
        'OAUTH_DOMAINS_INTERSTITIAL',
      ])
    })

    it('should have the correct QA_FLAG_FOR_FORCE_INTERSTITIAL_AS_NEVER_SEEN', () => {
      expect(service.QA_FLAG_FOR_FORCE_INTERSTITIAL_AS_NEVER_SEEN).toBe(
        QaFlag.forceDomainInterstitialAsNeverSeem
      )
    })
  })

  describe('userIsElegibleForInterstitial', () => {
    it('should return false if user has no emailDomains', (done) => {
      const userRecord = {
        emails: { emailDomains: [] } as EmailsEndpoint,
      } as UserRecord

      service
        .userIsElegibleForInterstitial(userRecord)
        .subscribe((eligible) => {
          expect(eligible).toBeFalse()
          done()
        })
    })

    it('should return false if user has public domains', (done) => {
      const userRecord = {
        emails: {
          emailDomains: [
            {
              email: 'test@public-university.edu',
              visibility: 'PUBLIC',
            } as AssertionVisibilityString,
            {
              email: 'test@another.edu',
              visibility: 'PRIVATE',
            } as AssertionVisibilityString,
          ],
        } as EmailsEndpoint,
      } as UserRecord

      service
        .userIsElegibleForInterstitial(userRecord)
        .subscribe((eligible) => {
          expect(eligible).toBeFalse()
          done()
        })
    })

    it('should return false if user has no private domains', (done) => {
      const userRecord = {
        emails: {
          emailDomains: [
            {
              email: 'test@only-public.edu',
              visibility: 'PUBLIC',
            } as AssertionVisibilityString,
          ],
        } as EmailsEndpoint,
      } as UserRecord

      // userHasPublicDomains = true => hasNoPublicDomains = false
      // userHasPrivateDomains = false
      // final => false
      service
        .userIsElegibleForInterstitial(userRecord)
        .subscribe((eligible) => {
          expect(eligible).toBeFalse()
          done()
        })
    })

    it('should return true if all user domains are non-PUBLIC (private) and at least one domain is private', (done) => {
      const userRecord = {
        emails: {
          emailDomains: [
            {
              email: 'test@private.org',
              visibility: 'LIMITED',
            } as AssertionVisibilityString,
            {
              email: 'test2@private.edu',
              visibility: 'PRIVATE',
            } as AssertionVisibilityString,
          ],
        } as EmailsEndpoint,
      } as UserRecord

      service
        .userIsElegibleForInterstitial(userRecord)
        .subscribe((eligible) => {
          expect(eligible).toBeTrue()
          done()
        })
    })
  })

  describe('getDialogComponentToShow', () => {
    it('should return ShareEmailsDomainsDialogComponent', () => {
      const component = service.getDialogComponentToShow()
      expect(component).toBe(ShareEmailsDomainsDialogComponent)
    })
  })

  describe('getDialogDataToShow', () => {
    it('should build the correct data object from the user record', () => {
      const userRecord = {
        emails: {
          emailDomains: [{ email: 'test@private.org', visibility: 'PRIVATE' }],
        },
      } as unknown as UserRecord

      const result = service.getDialogDataToShow(userRecord)
      expect(result).toEqual({
        userEmailsJson: userRecord.emails,
        type: 'domains-interstitial',
      })
    })
  })

  describe('showInterstitial', () => {
    it("should mark interstitial as viewed, open dialog, and return the dialog's afterClosed observable", (done) => {
      // Arrange
      const userRecord = {
        emails: {
          emailDomains: [{ email: 'test@private.org', visibility: 'PRIVATE' }],
        },
      } as unknown as UserRecord

      mockInterstitialsService.setInterstitialsViewed.and.returnValue(of(null))

      const afterClosed$ = new Subject<any>()
      const mockDialogRef = jasmine.createSpyObj<MatDialogRef<any>>(
        'MatDialogRef',
        ['afterClosed']
      )
      mockDialogRef.afterClosed.and.returnValue(afterClosed$.asObservable())
      mockMatDialog.open.and.returnValue(mockDialogRef)

      // Act
      service.showInterstitialAsDialog(userRecord).subscribe((dialogResult) => {
        expect(dialogResult).toEqual({ type: 'domains-interstitial' })
        done()
      })

      // Assert
      expect(
        mockInterstitialsService.setInterstitialsViewed
      ).toHaveBeenCalledWith('DOMAIN_INTERSTITIAL')
      expect(mockMatDialog.open).toHaveBeenCalled()

      // Simulate dialog closing
      afterClosed$.next({ type: 'domains-interstitial' })
      afterClosed$.complete()
    })
  })
})
