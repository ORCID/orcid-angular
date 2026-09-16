import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatIconModule } from '@angular/material/icon'
import { By } from '@angular/platform-browser'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { AlertMessageComponent, OrcidStepViewComponent } from '@orcid/ui'

import { RecoveryPhoneFormComponent } from '../../../cdk/recovery-phone-form/recovery-phone-form.component'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { AppEventName } from '../../../rum/app-event-names'
import { RumJourneyEventService } from '../../../rum/service/customEvent.service'
import { RecoveryPhoneSaveResponse } from '../../../types/two-factor.endpoint'
import { TwoFactorRecoveryPhoneComponent } from './two-factor-recovery-phone.component'

describe('TwoFactorRecoveryPhoneComponent', () => {
  let component: TwoFactorRecoveryPhoneComponent
  let fixture: ComponentFixture<TwoFactorRecoveryPhoneComponent>
  let fakeObservability: jasmine.SpyObj<RumJourneyEventService>
  let fakeTwoFactorAuthenticationService: jasmine.SpyObj<TwoFactorAuthenticationService>

  /** The real form is rendered, so the step is tested through what it hosts. */
  function form(): RecoveryPhoneFormComponent {
    return component.recoveryPhoneForm as RecoveryPhoneFormComponent
  }

  function primaryAction(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('#cy-step-view-primary-action'))
      .nativeElement
  }

  function secondaryAction(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('#cy-step-view-secondary-action'))
      .nativeElement
  }

  /** The step's own message: the one it shows when the form has none. */
  function stepError(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.recovery-phone-step-error')
  }

  beforeEach(async () => {
    fakeObservability = jasmine.createSpyObj<RumJourneyEventService>(
      'RumJourneyEventService',
      ['recordSimpleEvent']
    )
    fakeTwoFactorAuthenticationService = jasmine.createSpyObj(
      'TwoFactorAuthenticationService',
      ['sendRecoveryPhoneCode', 'saveRecoveryPhone']
    )

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatIconModule,
        AlertMessageComponent,
        OrcidStepViewComponent,
        RecoveryPhoneFormComponent,
      ],
      declarations: [TwoFactorRecoveryPhoneComponent],
      providers: [
        {
          provide: RumJourneyEventService,
          useValue: fakeObservability,
        },
        {
          provide: TwoFactorAuthenticationService,
          useValue: fakeTwoFactorAuthenticationService,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(TwoFactorRecoveryPhoneComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  afterEach(() => {
    // the form owns a live resend interval; it dies with the component
    component.recoveryPhoneForm?.ngOnDestroy()
  })

  it('records that the step was reached', () => {
    expect(component).toBeTruthy()
    expect(fakeObservability.recordSimpleEvent).toHaveBeenCalledWith(
      AppEventName.TwoFactorSetupRecoveryPhoneLoaded
    )
  })

  it('puts the warning notice ahead of the form (R2.2)', () => {
    const notice: HTMLElement = fixture.nativeElement.querySelector(
      '.recovery-phone-onboarding-notice'
    )
    const phoneForm: HTMLElement = fixture.nativeElement.querySelector(
      'app-recovery-phone-form'
    )

    expect(notice).toBeTruthy()
    expect(phoneForm).toBeTruthy()
    expect(notice.textContent).toContain(
      'We strongly recommend adding a phone number to ORCID'
    )
    expect(
      notice.compareDocumentPosition(phoneForm) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it('tells the form which flow asked for the number (R2.6)', () => {
    expect(form().context).toBe('ONBOARDING')
  })

  it('offers the step subtitle and the skip link', () => {
    const text = fixture.nativeElement.textContent
    expect(text).toContain('Step 2 of 3 - Recovery phone number')
    expect(text).toContain("Skip this step - Don't add a recovery phone number")
    expect(primaryAction().textContent).toContain(
      'Next step - 2FA recovery codes'
    )
  })

  it('keeps the primary action dead until a code has been sent (R2.2)', () => {
    expect(primaryAction().disabled).toBeTrue()

    form().codeSentChange.emit(true)
    fixture.detectChanges()

    expect(component.codeSent).toBeTrue()
    expect(primaryAction().disabled).toBeFalse()
  })

  it('keeps the primary action dead while a save is in flight', () => {
    form().codeSentChange.emit(true)
    form().saving = true
    fixture.detectChanges()

    expect(component.saving).toBeTrue()
    expect(primaryAction().disabled).toBeTrue()
  })

  it('saves through the form when the primary action is pressed (R2.4)', () => {
    const save = spyOn(form(), 'save')
    form().codeSentChange.emit(true)
    fixture.detectChanges()

    primaryAction().click()

    expect(save).toHaveBeenCalled()
  })

  it('reports the step complete and records the save (R2.4)', () => {
    const completed = jasmine.createSpy('completed')
    component.completed.subscribe(completed)

    form().saved.emit({ success: true } as RecoveryPhoneSaveResponse)

    expect(completed).toHaveBeenCalled()
    expect(fakeObservability.recordSimpleEvent).toHaveBeenCalledWith(
      AppEventName.TwoFactorSetupRecoveryPhoneSaved
    )
  })

  it('advances without saving when the step is skipped (R2.5)', () => {
    const completed = jasmine.createSpy('completed')
    component.completed.subscribe(completed)
    const save = spyOn(form(), 'save')

    secondaryAction().click()

    expect(completed).toHaveBeenCalled()
    expect(save).not.toHaveBeenCalled()
    expect(
      fakeTwoFactorAuthenticationService.saveRecoveryPhone
    ).not.toHaveBeenCalled()
    expect(fakeObservability.recordSimpleEvent).toHaveBeenCalledWith(
      AppEventName.TwoFactorSetupRecoveryPhoneSkipped
    )
  })

  it('passes a refusal that ends the step up rather than swallowing it', () => {
    const failed = jasmine.createSpy('failed')
    component.failed.subscribe(failed)

    form().failed.emit('2FA_DISABLED')
    form().failed.emit('FEATURE_DISABLED')

    expect(failed).toHaveBeenCalledWith('2FA_DISABLED')
    expect(failed).toHaveBeenCalledWith('FEATURE_DISABLED')
  })

  it('keeps the user on the step when the save never landed (R2.4)', () => {
    const failed = jasmine.createSpy('failed')
    const completed = jasmine.createSpy('completed')
    component.failed.subscribe(failed)
    component.completed.subscribe(completed)
    form().codeSentChange.emit(true)

    form().failed.emit('HTTP')
    fixture.detectChanges()

    // nothing was stored, so nothing may report the step over
    expect(failed).not.toHaveBeenCalled()
    expect(completed).not.toHaveBeenCalled()
    expect(stepError()?.textContent).toContain(
      'We could not save your recovery phone number'
    )
    // and the retry is one press away rather than a trip to account settings
    expect(primaryAction().disabled).toBeFalse()
  })

  it('says the number was not saved when the elevation ran out (R2.6)', () => {
    const failed = jasmine.createSpy('failed')
    const completed = jasmine.createSpy('completed')
    component.failed.subscribe(failed)
    component.completed.subscribe(completed)
    form().codeSentChange.emit(true)

    form().challengeRequired.emit()
    fixture.detectChanges()

    expect(failed).not.toHaveBeenCalled()
    expect(completed).not.toHaveBeenCalled()
    expect(stepError()?.getAttribute('role')).toBe('alert')
    expect(stepError()?.textContent).toContain(
      'Your recovery phone number was not saved'
    )
    expect(primaryAction().disabled).toBeFalse()
  })

  it('leaves the message to the form when the form has one (R2.4)', () => {
    const failed = jasmine.createSpy('failed')
    component.failed.subscribe(failed)
    form().codeSentChange.emit(true)
    form().generalErrorMessage = 'Something went wrong. Please try again.'

    form().failed.emit('HTTP')
    fixture.detectChanges()

    // still on the step, but not arguing with the form about why
    expect(failed).not.toHaveBeenCalled()
    expect(stepError()).toBeNull()
    expect(primaryAction().disabled).toBeFalse()
  })

  it('drops its own message when the save is tried again', () => {
    const save = spyOn(form(), 'save')
    form().codeSentChange.emit(true)
    form().failed.emit('HTTP')
    fixture.detectChanges()
    expect(stepError()).toBeTruthy()

    primaryAction().click()
    fixture.detectChanges()

    expect(save).toHaveBeenCalled()
    expect(stepError()).toBeNull()
  })
})
