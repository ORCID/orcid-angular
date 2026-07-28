import { TestBed } from '@angular/core/testing'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { of, Subject, throwError } from 'rxjs'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'

import { InterstitialType } from 'src/app/cdk/interstitials/interstitial.type'
import { UserRecord } from 'src/app/types/record.local'
import {
  AssertionVisibilityString,
  EmailsEndpoint,
  UserInfo,
} from 'src/app/types'
import { QaFlagsService } from '../../qa-flag/qa-flag.service'
import { QaFlag } from '../../qa-flag/qa-flags.enum'
import { TogglzService } from '../../togglz/togglz.service'
import { LoginBackupEmailInterstitialManagerService } from '../implementations/login-backup-email-interstitials-manager.service'
import { BackupEmailDialogComponent } from 'src/app/cdk/interstitials/backup-email/interstitial-dialog-extend/backup-email-dialog.component'
import { WINDOW, WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { InterstitialObservabilityService } from '../interstitial-observability.service'
import { TogglzFlag } from 'src/app/types/config.endpoint'

describe('LoginBackupEmailInterstitialManagerService', () => {
  let service: LoginBackupEmailInterstitialManagerService

  let mockMatDialog: jasmine.SpyObj<MatDialog>
  let mockInterstitialsService: jasmine.SpyObj<InterstitialsService>
  let mockTogglzService: jasmine.SpyObj<TogglzService>
  let mockQaFlagsService: jasmine.SpyObj<QaFlagsService>
  let mockObservability: jasmine.SpyObj<InterstitialObservabilityService>

  const ownerUserInfo = {
    EFFECTIVE_USER_ORCID: '0000-0001-2345-6789',
    REAL_USER_ORCID: '0000-0001-2345-6789',
  } as UserInfo

  function userRecordWithEmails(
    emails: AssertionVisibilityString[],
    userInfo: UserInfo = ownerUserInfo
  ): UserRecord {
    return {
      userInfo,
      emails: { emails, emailDomains: [], errors: [] } as EmailsEndpoint,
    } as UserRecord
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
      [
        'shown',
        'backupEmailAdded',
        'dismissed',
        'validationError',
        'saveError',
        'closed',
      ]
    )

    TestBed.configureTestingModule({
      providers: [
        LoginBackupEmailInterstitialManagerService,
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: InterstitialsService, useValue: mockInterstitialsService },
        { provide: TogglzService, useValue: mockTogglzService },
        { provide: QaFlagsService, useValue: mockQaFlagsService },
        {
          provide: InterstitialObservabilityService,
          useValue: mockObservability,
        },
        WINDOW_PROVIDERS,
      ],
    })

    service = TestBed.inject(LoginBackupEmailInterstitialManagerService)
  })

  describe('Constants', () => {
    it('should have the correct INTERSTITIAL_NAME', () => {
      expect(service.INTERSTITIAL_NAME).toBe(
        'BACKUP_EMAIL_INTERSTITIAL' as InterstitialType
      )
    })

    it('should only declare the LOGIN togglz, this interstitial does not run on the OAuth flow', () => {
      expect(service.INTERSTITIAL_TOGGLE).toEqual([
        TogglzFlag.LOGIN_BACKUP_EMAIL_INTERSTITIAL,
      ])
    })

    it('should have the correct QA_FLAG_FOR_FORCE_INTERSTITIAL_AS_NEVER_SEEN', () => {
      expect(service.QA_FLAG_FOR_FORCE_INTERSTITIAL_AS_NEVER_SEEN).toBe(
        QaFlag.forceBackupEmailInterstitialNotSeem
      )
    })
  })

  describe('userIsElegibleForInterstitial', () => {
    it('should return true if the user has exactly one email address', (done) => {
      service
        .userIsElegibleForInterstitial(
          userRecordWithEmails([
            { value: 'test@example.com', verified: true },
          ] as AssertionVisibilityString[])
        )
        .subscribe((eligible) => {
          expect(eligible).toBeTrue()
          done()
        })
    })

    it('should return true if the only email address is unverified', (done) => {
      service
        .userIsElegibleForInterstitial(
          userRecordWithEmails([
            { value: 'test@example.com', verified: false },
          ] as AssertionVisibilityString[])
        )
        .subscribe((eligible) => {
          expect(eligible).toBeTrue()
          done()
        })
    })

    it('should return false if the user has more than one email address', (done) => {
      service
        .userIsElegibleForInterstitial(
          userRecordWithEmails([
            { value: 'test@example.com', verified: true },
            { value: 'backup@example.com', verified: false },
          ] as AssertionVisibilityString[])
        )
        .subscribe((eligible) => {
          expect(eligible).toBeFalse()
          done()
        })
    })

    it('should return false if the user has no email addresses', (done) => {
      service
        .userIsElegibleForInterstitial(userRecordWithEmails([]))
        .subscribe((eligible) => {
          expect(eligible).toBeFalse()
          done()
        })
    })

    it('should return false if the emails are not loaded', (done) => {
      service
        .userIsElegibleForInterstitial({} as UserRecord)
        .subscribe((eligible) => {
          expect(eligible).toBeFalse()
          done()
        })
    })

    it('should return false on impersonation', (done) => {
      service
        .userIsElegibleForInterstitial(
          userRecordWithEmails(
            [{ value: 'test@example.com' }] as AssertionVisibilityString[],
            {
              EFFECTIVE_USER_ORCID: '0000-0001-2345-6789',
              REAL_USER_ORCID: '0000-0002-0000-0000',
            } as UserInfo
          )
        )
        .subscribe((eligible) => {
          expect(eligible).toBeFalse()
          done()
        })
    })

    it('should return false inside a popup window', (done) => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        providers: [
          LoginBackupEmailInterstitialManagerService,
          { provide: MatDialog, useValue: mockMatDialog },
          { provide: InterstitialsService, useValue: mockInterstitialsService },
          { provide: TogglzService, useValue: mockTogglzService },
          { provide: QaFlagsService, useValue: mockQaFlagsService },
          {
            provide: InterstitialObservabilityService,
            useValue: mockObservability,
          },
          { provide: WINDOW, useValue: { opener: {} } },
        ],
      })

      TestBed.inject(LoginBackupEmailInterstitialManagerService)
        .userIsElegibleForInterstitial(
          userRecordWithEmails([
            { value: 'test@example.com' },
          ] as AssertionVisibilityString[])
        )
        .subscribe((eligible) => {
          expect(eligible).toBeFalse()
          done()
        })
    })
  })

  describe('getDialogComponentToShow', () => {
    it('should return BackupEmailDialogComponent', () => {
      expect(service.getDialogComponentToShow()).toBe(
        BackupEmailDialogComponent
      )
    })
  })

  describe('getDialogDataToShow', () => {
    it('should build the correct data object from the user record', () => {
      const userRecord = userRecordWithEmails([
        { value: 'test@example.com' },
      ] as AssertionVisibilityString[])

      expect(service.getDialogDataToShow(userRecord)).toEqual({
        userEmailsJson: userRecord.emails,
        type: 'backup-email-interstitial',
      })
    })
  })

  describe('getInterstitialTogglz', () => {
    it('should resolve the LOGIN togglz', (done) => {
      mockTogglzService.getStateOf.and.returnValue(of(true))

      service.getInterstitialTogglz('LOGIN').subscribe((state) => {
        expect(mockTogglzService.getStateOf).toHaveBeenCalledWith(
          TogglzFlag.LOGIN_BACKUP_EMAIL_INTERSTITIAL
        )
        expect(state).toBeTrue()
        done()
      })
    })

    it('should resolve to false on the OAuth flow, where no togglz exists', (done) => {
      // getStateOf returns false for an unknown flag, keeping the OAuth flow untouched
      mockTogglzService.getStateOf.and.returnValue(of(false))

      service.getInterstitialTogglz('OAUTH').subscribe((state) => {
        expect(mockTogglzService.getStateOf).toHaveBeenCalledWith(undefined)
        expect(state).toBeFalse()
        done()
      })
    })
  })

  describe('getDefaultDialogConfig', () => {
    it('should give the dialog an accessible name and hide the record behind it', () => {
      // The shared config leaves both unset, which is a WCAG 4.1.2 failure
      const config = (service as any).getDefaultDialogConfig({
        type: 'backup-email-interstitial',
      })

      expect(config.ariaLabel).toBeTruthy()
      expect(config.ariaModal).toBeTrue()
      // Inherited from the shared config
      expect(config.width).toBe('580px')
      expect(config.disableClose).toBeTrue()
    })
  })

  describe('showInterstitial', () => {
    it('should report shown when the dialog opens and closed when it goes away', (done) => {
      const userRecord = userRecordWithEmails([
        { value: 'test@example.com' },
      ] as AssertionVisibilityString[])

      mockInterstitialsService.setInterstitialsViewed.and.returnValue(of(null))
      const afterClosed$ = new Subject<any>()
      const mockDialogRef = jasmine.createSpyObj<MatDialogRef<any>>(
        'MatDialogRef',
        ['afterClosed']
      )
      mockDialogRef.afterClosed.and.returnValue(afterClosed$.asObservable())
      mockMatDialog.open.and.returnValue(mockDialogRef)

      service.showInterstitialAsDialog(userRecord).subscribe({
        complete: () => {
          expect(mockObservability.closed).toHaveBeenCalled()
          done()
        },
      })

      expect(mockObservability.shown).toHaveBeenCalledWith(
        'BACKUP_EMAIL_INTERSTITIAL'
      )
      expect(mockObservability.closed).not.toHaveBeenCalled()

      afterClosed$.next({ type: 'backup-email-interstitial' })
      afterClosed$.complete()
    })

    it('should still open the dialog when recording the visit fails', (done) => {
      const userRecord = userRecordWithEmails([
        { value: 'test@example.com' },
      ] as AssertionVisibilityString[])

      // A 403 from account/addInterstitialFlag used to swallow the dialog
      mockInterstitialsService.setInterstitialsViewed.and.returnValue(
        throwError(() => new Error('403 Forbidden'))
      )
      const afterClosed$ = new Subject<any>()
      const mockDialogRef = jasmine.createSpyObj<MatDialogRef<any>>(
        'MatDialogRef',
        ['afterClosed']
      )
      mockDialogRef.afterClosed.and.returnValue(afterClosed$.asObservable())
      mockMatDialog.open.and.returnValue(mockDialogRef)

      service.showInterstitialAsDialog(userRecord).subscribe({
        complete: () => done(),
      })

      expect(mockMatDialog.open).toHaveBeenCalled()
      expect(mockObservability.shown).toHaveBeenCalled()

      afterClosed$.next({ type: 'backup-email-interstitial' })
      afterClosed$.complete()
    })

    it("should mark interstitial as viewed, open dialog, and return the dialog's afterClosed observable", (done) => {
      const userRecord = userRecordWithEmails([
        { value: 'test@example.com' },
      ] as AssertionVisibilityString[])

      mockInterstitialsService.setInterstitialsViewed.and.returnValue(of(null))

      const afterClosed$ = new Subject<any>()
      const mockDialogRef = jasmine.createSpyObj<MatDialogRef<any>>(
        'MatDialogRef',
        ['afterClosed']
      )
      mockDialogRef.afterClosed.and.returnValue(afterClosed$.asObservable())
      mockMatDialog.open.and.returnValue(mockDialogRef)

      service.showInterstitialAsDialog(userRecord).subscribe((dialogResult) => {
        expect(dialogResult).toEqual({
          type: 'backup-email-interstitial',
          addedBackupEmail: 'backup@example.com',
        })
        done()
      })

      expect(
        mockInterstitialsService.setInterstitialsViewed
      ).toHaveBeenCalledWith('BACKUP_EMAIL_INTERSTITIAL')
      expect(mockMatDialog.open).toHaveBeenCalled()

      afterClosed$.next({
        type: 'backup-email-interstitial',
        addedBackupEmail: 'backup@example.com',
      })
      afterClosed$.complete()
    })
  })
})
