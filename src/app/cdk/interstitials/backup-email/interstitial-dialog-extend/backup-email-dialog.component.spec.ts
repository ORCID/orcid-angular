import { TestBed } from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { of } from 'rxjs'

import { PlatformInfoService } from 'src/app/cdk/platform-info/platform-info.service'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { UserService } from 'src/app/core'
import { InterstitialObservabilityService } from 'src/app/core/login-interstitials-manager/interstitial-observability.service'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { RecordService } from 'src/app/core/record/record.service'
import { RegisterService } from 'src/app/core/register/register.service'
import { EmailsEndpoint } from 'src/app/types'
import { BackupEmailDialogComponent } from './backup-email-dialog.component'

describe('BackupEmailDialogComponent', () => {
  let dialogRef: jasmine.SpyObj<MatDialogRef<BackupEmailDialogComponent>>

  const emails = {
    emails: [{ value: 'primary@example.com', primary: true }],
    emailDomains: [],
    errors: [],
  } as unknown as EmailsEndpoint

  beforeEach(() => {
    dialogRef = jasmine.createSpyObj<MatDialogRef<BackupEmailDialogComponent>>(
      'MatDialogRef',
      ['close']
    )

    TestBed.configureTestingModule({
      declarations: [BackupEmailDialogComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: PlatformInfoService, useValue: {} },
        {
          provide: RecordEmailsService,
          useValue: {
            backendEmailValidate: () => () => of(null),
            postEmails: (toSave: EmailsEndpoint) => of(toSave),
          },
        },
        {
          provide: RecordService,
          useValue: { getRecord: () => of({ emails }) },
        },
        {
          provide: RegisterService,
          useValue: { getEmailCategory: () => of(null) },
        },
        { provide: UserService, useValue: { getUserSession: () => of({}) } },
        {
          provide: InterstitialObservabilityService,
          useValue: jasmine.createSpyObj('InterstitialObservabilityService', [
            'shown',
            'outcome',
            'closed',
          ]),
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { type: 'backup-email-interstitial' },
        },
        { provide: MatDialogRef, useValue: dialogRef },
        WINDOW_PROVIDERS,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
  })

  function createComponent(): BackupEmailDialogComponent {
    const fixture = TestBed.createComponent(BackupEmailDialogComponent)
    fixture.detectChanges()
    return fixture.componentInstance
  }

  it('should close on success instead of showing the confirmation screen', () => {
    // The confirmation exists for the inline OAuth flow, which has no record
    // to return to. The dialog closes and /my-orcid shows its own notice, so
    // the two must not both appear.
    const component = createComponent()

    component.backupEmailControl.setValue('backup@example.com')
    component.addBackupEmail()

    expect(component.afterSummitStatus).toBeFalse()
    expect(dialogRef.close).toHaveBeenCalledWith({
      type: 'backup-email-interstitial',
      addedBackupEmail: 'backup@example.com',
    })
  })

  it('should return the address so the record can show the added notice', () => {
    const component = createComponent()

    component.afterSummit('backup@example.com')

    expect(dialogRef.close).toHaveBeenCalledWith({
      type: 'backup-email-interstitial',
      addedBackupEmail: 'backup@example.com',
    })
  })
})
