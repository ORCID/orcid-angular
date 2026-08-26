import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BackupEmailComponent } from './backup-email.component'
import {
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PlatformInfoService } from 'src/app/cdk/platform-info/platform-info.service'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { RecordService } from 'src/app/core/record/record.service'
import { InterstitialObservabilityService } from 'src/app/core/login-interstitials-manager/interstitial-observability.service'
import { RegisterService } from 'src/app/core/register/register.service'
import { Observable, of, Subject, throwError } from 'rxjs'
import { AssertionVisibilityString, EmailsEndpoint } from 'src/app/types'
import { EmailCategoryEndpoint } from 'src/app/types/register.email-category'
import { AppEventName } from 'src/app/rum/app-event-names'

describe('BackupEmailComponent', () => {
  let component: BackupEmailComponent
  let fixture: ComponentFixture<BackupEmailComponent>
  let postEmails: jasmine.Spy
  let backendValidation: (
    control: AbstractControl
  ) => Observable<ValidationErrors | null>
  let emailCategory: () => Observable<EmailCategoryEndpoint>
  let observability: jasmine.SpyObj<InterstitialObservabilityService>

  const primaryEmail = {
    value: 'primary@example.com',
    primary: true,
    visibility: 'PUBLIC',
  } as AssertionVisibilityString

  function emailsEndpoint(
    emails: AssertionVisibilityString[] = [primaryEmail]
  ): EmailsEndpoint {
    return { emails, emailDomains: [], errors: [] } as EmailsEndpoint
  }

  beforeEach(() => {
    // Valid by default, individual tests swap in the failing responses
    backendValidation = () => of(null)
    emailCategory = () =>
      of({ category: 'PROFESSIONAL', rorId: null } as EmailCategoryEndpoint)
    observability = jasmine.createSpyObj<InterstitialObservabilityService>(
      'InterstitialObservabilityService',
      ['shown', 'outcome', 'closed']
    )
    postEmails = jasmine
      .createSpy('postEmails')
      .and.callFake((toSave: EmailsEndpoint) => of(toSave))

    TestBed.configureTestingModule({
      declarations: [BackupEmailComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: PlatformInfoService, useValue: {} },
        {
          provide: RecordEmailsService,
          useValue: {
            backendEmailValidate: () => (control: AbstractControl) =>
              backendValidation(control),
            postEmails: (toSave: EmailsEndpoint) => postEmails(toSave),
          },
        },
        {
          provide: RecordService,
          useValue: { getRecord: () => of({ emails: emailsEndpoint() }) },
        },
        {
          provide: RegisterService,
          useValue: {
            getEmailCategory: () => emailCategory(),
          },
        },
        { provide: InterstitialObservabilityService, useValue: observability },
        WINDOW_PROVIDERS,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    fixture = TestBed.createComponent(BackupEmailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create and build the form from the record emails', () => {
    expect(component).toBeTruthy()
    expect(component.form).toBeTruthy()
    expect(component.userEmailsJson.emails.length).toBe(1)
  })

  describe('inline errors', () => {
    it('should show the required error only after the user submits', () => {
      const finish = spyOn(component.finish, 'emit')
      expect(component.isErrorVisible('required')).toBeFalse()

      component.addBackupEmail()

      expect(component.isErrorVisible('required')).toBeTrue()
      expect(postEmails).not.toHaveBeenCalled()
      // The user cannot complete the action while an inline error is shown
      expect(finish).not.toHaveBeenCalled()
    })

    it('should treat a blank value as missing', () => {
      component.backupEmailControl.setValue('   ')
      component.addBackupEmail()

      expect(component.isErrorVisible('required')).toBeTrue()
      expect(postEmails).not.toHaveBeenCalled()
    })

    it('should show the invalid email error on a malformed address', () => {
      component.backupEmailControl.setValue('not-an-email')
      component.addBackupEmail()

      expect(component.isErrorVisible('invalid')).toBeTrue()
      expect(postEmails).not.toHaveBeenCalled()
    })

    it('should show the already in use error when the backend rejects the address', () => {
      backendValidation = () => of({ backendError: ['Email already used'] })

      component.backupEmailControl.setValue('taken@example.com')
      component.addBackupEmail()

      expect(component.isErrorVisible('in_use')).toBeTrue()
      expect(postEmails).not.toHaveBeenCalled()
    })

    it('should reject an address already on this record', () => {
      // The backend validation ignores the current user, so this must be caught locally
      component.backupEmailControl.setValue('PRIMARY@example.com')
      component.addBackupEmail()

      expect(component.backupEmailControl.hasError('duplicated')).toBeTrue()
      expect(component.isErrorVisible('in_use')).toBeTrue()
      expect(postEmails).not.toHaveBeenCalled()
    })
  })

  it('should wait for a pending backend validation before submitting', () => {
    const pendingValidation = new Subject<ValidationErrors | null>()
    backendValidation = () => pendingValidation

    component.backupEmailControl.setValue('backup@example.com')
    expect(component.form.pending).toBeTrue()

    component.addBackupEmail()
    expect(postEmails).not.toHaveBeenCalled()

    pendingValidation.next(null)
    pendingValidation.complete()

    expect(postEmails).toHaveBeenCalled()
  })

  it('should post the existing emails together with the new one', () => {
    component.backupEmailControl.setValue('backup@example.com')
    component.addBackupEmail()

    expect(postEmails).toHaveBeenCalled()
    const posted: EmailsEndpoint = postEmails.calls.mostRecent().args[0]
    expect(posted.emails.length).toBe(2)
    expect(posted.emails[0].value).toBe('primary@example.com')
    expect(posted.emails[1]).toEqual(
      jasmine.objectContaining({
        value: 'backup@example.com',
        visibility: 'PRIVATE',
        primary: false,
      })
    )
  })

  it('should finish on success, the confirmation is shown on the record not in the panel', () => {
    const finish = spyOn(component.finish, 'emit')

    component.backupEmailControl.setValue('backup@example.com')
    component.addBackupEmail()

    expect(finish).toHaveBeenCalled()
  })

  it('should finish even though postEmails replays the pre-save email list', () => {
    const finish = spyOn(component.finish, 'emit')
    // getEmails is backed by a ReplaySubject, so the first emission after a save
    // is the cached list and cannot be used to confirm the write
    postEmails.and.returnValue(of(emailsEndpoint()))

    component.backupEmailControl.setValue('backup@example.com')
    component.addBackupEmail()

    expect(finish).toHaveBeenCalled()
    expect(component.saving).toBeFalse()
  })

  describe('primary email', () => {
    it('should expose the only email on the record as the primary one', () => {
      expect(component.primaryEmail.value).toBe('primary@example.com')
    })

    it('should label the primary email with its category', () => {
      expect(component.primaryEmailCategory).toBe('PROFESSIONAL')
    })

    // The outlined look comes from the Material Symbols font. The
    // `material-icons-outlined` class these used to carry matches no loaded
    // stylesheet, so it silently fell back to the filled font (PD-6198).
    it('should draw the professional category icon in the outlined font', () => {
      const icon = fixture.nativeElement.querySelector(
        '.email-category mat-icon'
      )

      expect(icon.textContent.trim()).toBe('work')
      expect(icon.classList).toContain('material-symbols-outlined')
    })

    it('should draw the personal category icon in the outlined font', () => {
      emailCategory = () =>
        of({ category: 'PERSONAL', rorId: null } as EmailCategoryEndpoint)

      const newFixture = TestBed.createComponent(BackupEmailComponent)
      newFixture.detectChanges()

      const icon = newFixture.nativeElement.querySelector(
        '.email-category mat-icon'
      )

      expect(icon.textContent.trim()).toBe('fingerprint')
      expect(icon.classList).toContain('material-symbols-outlined')
    })

    it('should leave the category out when the lookup fails', () => {
      emailCategory = () => throwError(() => new Error('lookup failed'))

      const newFixture = TestBed.createComponent(BackupEmailComponent)
      newFixture.detectChanges()

      expect(newFixture.componentInstance.primaryEmailCategory).toBeUndefined()
    })
  })

  it('should finish the interstitial if saving fails', () => {
    const finish = spyOn(component.finish, 'emit')
    postEmails.and.returnValue(throwError(() => new Error('save failed')))

    component.backupEmailControl.setValue('backup@example.com')
    component.addBackupEmail()

    expect(finish).toHaveBeenCalled()
  })

  it('should finish without saving when the user declines', () => {
    const finish = spyOn(component.finish, 'emit')

    component.declineBackupEmail()

    expect(finish).toHaveBeenCalled()
    expect(postEmails).not.toHaveBeenCalled()
  })

  describe('accessibility', () => {
    it('should not point at an error while the field is clean', () => {
      expect(component.visibleErrorId).toBeNull()
    })

    it('should describe the input with the visible error', () => {
      component.addBackupEmail()
      expect(component.visibleErrorId).toBe('backup-email-required-error')

      component.backupEmailControl.setValue('not-an-email')
      expect(component.visibleErrorId).toBe('backup-email-invalid-error')

      backendValidation = () => of({ backendError: ['taken'] })
      component.backupEmailControl.setValue('taken@example.com')
      expect(component.visibleErrorId).toBe('backup-email-in-use-error')
    })
  })

  describe('observability', () => {
    const outcomeNames = () =>
      observability.outcome.calls.allArgs().map(([name]) => name)

    it('should report the validation error that blocked the submit', () => {
      component.addBackupEmail()

      expect(observability.outcome).toHaveBeenCalledWith(
        AppEventName.InterstitialValidationError,
        { validationErrorKind: 'required', formValid: false }
      )
      expect(outcomeNames()).not.toContain(AppEventName.InterstitialCompleted)
    })

    it('should distinguish a dismissal from a failed save', () => {
      component.declineBackupEmail()

      expect(outcomeNames()).toEqual([AppEventName.InterstitialDismissed])
    })

    it('should report a failed save rather than a dismissal', () => {
      postEmails.and.returnValue(throwError(() => new Error('save failed')))

      component.backupEmailControl.setValue('backup@example.com')
      component.addBackupEmail()

      expect(outcomeNames()).toEqual([AppEventName.InterstitialSaveError])
    })

    it('should report a successful add', () => {
      component.backupEmailControl.setValue('backup@example.com')
      component.addBackupEmail()

      expect(outcomeNames()).toEqual([AppEventName.InterstitialCompleted])
    })
  })
})
