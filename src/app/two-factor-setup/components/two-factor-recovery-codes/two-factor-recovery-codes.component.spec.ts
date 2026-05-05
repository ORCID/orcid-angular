import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TwoFactorRecoveryCodesComponent } from './two-factor-recovery-codes.component'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { MatTooltipModule } from '@angular/material/tooltip'

import { ReactiveFormsModule } from '@angular/forms'
import { RouterTestingModule } from '@angular/router/testing'
import { ClipboardModule } from '@angular/cdk/clipboard'
import { OrcidStepViewComponent } from '@orcid/ui'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { Router } from '@angular/router'
import { RumJourneyEventService } from '../../../rum/service/customEvent.service'
import { AppEventName } from '../../../rum/app-event-names'

describe('TwoFactorRecoveryCodesComponent', () => {
  let component: TwoFactorRecoveryCodesComponent
  let fixture: ComponentFixture<TwoFactorRecoveryCodesComponent>
  let router: Router
  let fakeObservability: jasmine.SpyObj<RumJourneyEventService>

  beforeEach(async () => {
    fakeObservability = jasmine.createSpyObj<RumJourneyEventService>(
      'RumJourneyEventService',
      ['recordSimpleEvent']
    )

    await TestBed.configureTestingModule({
      imports: [
        MatTooltipModule,
        ReactiveFormsModule,
        RouterTestingModule,
        ClipboardModule,
        OrcidStepViewComponent,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
      ],
      declarations: [TwoFactorRecoveryCodesComponent],
      providers: [
        WINDOW_PROVIDERS,
        {
          provide: RumJourneyEventService,
          useValue: fakeObservability,
        },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFactorRecoveryCodesComponent)
    component = fixture.componentInstance
    component.backupCodes = 'code1\ncode2'
    component.backupCodesClipboard = 'code1 code2'
    router = TestBed.inject(Router)
    spyOn(router, 'navigate').and.resolveTo(true)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
    expect(fakeObservability.recordSimpleEvent).toHaveBeenCalledWith(
      AppEventName.TwoFactorSetupStep2Loaded
    )
  })

  it('should only allow complete when copy/download and checkbox are done', () => {
    expect(component.canCompleteSetup).toBeFalse()

    component.markCodesCopied()
    expect(component.canCompleteSetup).toBeFalse()

    component.twoFactorForm.get('confirmCodes').setValue(true)
    expect(component.canCompleteSetup).toBeTrue()
  })

  it('should record click and completion events when setup is completed', async () => {
    component.markCodesCopied()
    component.twoFactorForm.get('confirmCodes').setValue(true)

    component.completeSetup()
    await fixture.whenStable()

    expect(fakeObservability.recordSimpleEvent).toHaveBeenCalledWith(
      AppEventName.TwoFactorSetupFinalButtonClicked
    )
    expect(fakeObservability.recordSimpleEvent).toHaveBeenCalledWith(
      AppEventName.TwoFactorSetupFinalCompleted
    )
    expect(router.navigate).toHaveBeenCalled()
  })
})
