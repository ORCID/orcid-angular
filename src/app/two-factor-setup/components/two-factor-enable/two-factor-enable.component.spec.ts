import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TwoFactorEnableComponent } from './two-factor-enable.component'
import { RouterTestingModule } from '@angular/router/testing'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { DebugElement } from '@angular/core'
import { By } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { of } from 'rxjs'
import { TwoFactorSetup } from 'src/app/types/two-factor.endpoint'
import { OrcidStepViewComponent } from '@orcid/ui'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { RumJourneyEventService } from '../../../rum/service/customEvent.service'
import { AppEventName } from '../../../rum/app-event-names'
import { MatTooltipModule } from '@angular/material/tooltip'
import { ClipboardModule } from '@angular/cdk/clipboard'

describe('TwoFactorEnableComponent', () => {
  let component: TwoFactorEnableComponent
  let fixture: ComponentFixture<TwoFactorEnableComponent>
  let fakeTwoFactorAuthenticationService: TwoFactorAuthenticationService
  let fakeObservability: jasmine.SpyObj<RumJourneyEventService>
  let debugElement: DebugElement

  beforeEach(async () => {
    fakeTwoFactorAuthenticationService =
      jasmine.createSpyObj<TwoFactorAuthenticationService>(
        'TwoFactorAuthenticationService',
        {
          getTextCode: of({ secret: '123456' }),
          register: of({ valid: true } as TwoFactorSetup),
        }
      )
    fakeObservability = jasmine.createSpyObj<RumJourneyEventService>(
      'RumJourneyEventService',
      ['recordSimpleEvent']
    )

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatInputModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        RouterTestingModule,
        OrcidStepViewComponent,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        ClipboardModule,
      ],
      declarations: [TwoFactorEnableComponent],
      providers: [
        WINDOW_PROVIDERS,
        {
          provide: TwoFactorAuthenticationService,
          useValue: fakeTwoFactorAuthenticationService,
        },
        {
          provide: RumJourneyEventService,
          useValue: fakeObservability,
        },
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        Overlay,
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFactorEnableComponent)
    component = fixture.componentInstance
    debugElement = fixture.debugElement
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
    expect(fakeObservability.recordSimpleEvent).toHaveBeenCalledWith(
      AppEventName.TwoFactorSetupStep1Loaded
    )
  })

  it('should include a qr code image', () => {
    expect(
      debugElement.nativeElement.querySelector('img').textContent
    ).not.toBeNull()
  })

  it('should display a textarea with a text code', () => {
    expect(
      debugElement.nativeElement.querySelector('[data-cy="textCode"]')
    ).toBeNull()
    const textCodeLink = debugElement.query(By.css('#cy-text-code'))
    textCodeLink.triggerEventHandler('click', null)
    expect(fakeTwoFactorAuthenticationService.getTextCode).toHaveBeenCalled()
    component.showTextCode = true
    fixture.detectChanges()
    expect(
      debugElement.nativeElement.querySelector('[data-cy="textCode"]')
        .textContent
    ).not.toBeNull()
  })

  it('should call register method when input is filled and submit is triggered', async () => {
    component.twoFactorForm.get('verificationCode').setValue('123456')

    fixture.detectChanges()
    await fixture.whenStable()

    component.onSubmit()

    fixture.detectChanges()

    expect(fakeTwoFactorAuthenticationService.register).toHaveBeenCalled()
    expect(
      component.twoFactorForm.get('verificationCode')?.hasError('invalidCode')
    ).toBeFalse()
  })
})
