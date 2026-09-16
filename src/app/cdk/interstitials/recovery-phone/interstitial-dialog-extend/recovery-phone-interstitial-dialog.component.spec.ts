import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

import { WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { InterstitialObservabilityService } from 'src/app/core/login-interstitials-manager/interstitial-observability.service'
import { RecoveryPhoneSaveResponse } from 'src/app/types/two-factor.endpoint'

import { RecoveryPhoneInterstitialDialogComponent } from './recovery-phone-interstitial-dialog.component'

describe('RecoveryPhoneInterstitialDialogComponent', () => {
  let dialogRef: jasmine.SpyObj<
    MatDialogRef<RecoveryPhoneInterstitialDialogComponent>
  >

  beforeEach(() => {
    dialogRef = jasmine.createSpyObj<
      MatDialogRef<RecoveryPhoneInterstitialDialogComponent>
    >('MatDialogRef', ['close'])

    TestBed.configureTestingModule({
      declarations: [RecoveryPhoneInterstitialDialogComponent],
      providers: [
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
          useValue: { type: 'recovery-phone-interstitial' },
        },
        { provide: MatDialogRef, useValue: dialogRef },
        WINDOW_PROVIDERS,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
  })

  function createComponent(): RecoveryPhoneInterstitialDialogComponent {
    const fixture = TestBed.createComponent(
      RecoveryPhoneInterstitialDialogComponent
    )
    fixture.detectChanges()
    return fixture.componentInstance
  }

  it('should close on success instead of swapping in a panel', () => {
    // /my-orcid carries the "Recovery phone number added" notice on this flow
    // (R6.4), so the dialog must not also acknowledge the save
    const component = createComponent()

    component.onSaved({
      success: true,
      maskedRecoveryPhoneNumber: '***********6789',
    } as RecoveryPhoneSaveResponse)

    expect(component.afterSummitStatus).toBeFalse()
    expect(dialogRef.close).toHaveBeenCalledWith({
      type: 'recovery-phone-interstitial',
      addedRecoveryPhone: '***********6789',
    })
  })

  it('should hand back only the masked number, which is all the record prints', () => {
    const component = createComponent()

    component.afterSummit('***********6789')

    expect(dialogRef.close).toHaveBeenCalledWith({
      type: 'recovery-phone-interstitial',
      addedRecoveryPhone: '***********6789',
    })
  })

  it('should close with no number when the user declines', () => {
    const component = createComponent()

    component.declineRecoveryPhone()

    expect(dialogRef.close).toHaveBeenCalledWith({
      type: 'recovery-phone-interstitial',
      addedRecoveryPhone: undefined,
    })
  })

  it('should close with no number when the save fails', () => {
    const component = createComponent()

    component.onFailed()

    expect(dialogRef.close).toHaveBeenCalledWith({
      type: 'recovery-phone-interstitial',
      addedRecoveryPhone: undefined,
    })
  })
})
