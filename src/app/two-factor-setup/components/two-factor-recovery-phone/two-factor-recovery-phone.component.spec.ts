import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  tick,
} from '@angular/core/testing'
import { MatIconModule } from '@angular/material/icon'
import { By } from '@angular/platform-browser'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { AlertMessageComponent, OrcidStepViewComponent } from '@orcid/ui'

import { RecoveryPhoneFormComponent } from '../../../cdk/recovery-phone-form/recovery-phone-form.component'
import { RECOVERY_PHONE_ELEVATION_TTL_MILLIS } from '../../../core/two-factor-authentication/recovery-phone-elevation'
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

  it('leaves the step, with nothing to read, when the registry says the elevation ran out (PD-13638)', () => {
    const failed = jasmine.createSpy('failed')
    const completed = jasmine.createSpy('completed')
    const elevationExpired = jasmine.createSpy('elevationExpired')
    component.failed.subscribe(failed)
    component.completed.subscribe(completed)
    component.elevationExpired.subscribe(elevationExpired)
    form().codeSentChange.emit(true)

    form().challengeRequired.emit()
    fixture.detectChanges()

    // The page takes the user to account settings, so a message here would be
    // read by nobody; "please try again" was the advice it used to give, and
    // every further attempt on this surface is refused the same way.
    expect(elevationExpired).toHaveBeenCalledTimes(1)
    expect(failed).not.toHaveBeenCalled()
    expect(completed).not.toHaveBeenCalled()
    expect(stepError()).toBeNull()
    expect(fakeObservability.recordSimpleEvent).toHaveBeenCalledWith(
      AppEventName.TwoFactorSetupRecoveryPhoneElevationExpired
    )
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

  /*
   * The clock, rather than the registry, reaching the end of the window.
   *
   * These build their own fixture inside fakeAsync and call ngOnInit by hand.
   * Rendering the step renders the real recovery phone form, whose phone field
   * lazily imports its formatting utilities, and a dynamic import inside
   * fakeAsync never settles - the test fails on a pending task rather than on
   * anything it was asserting.
   */
  describe('when the elevation window runs out on its own', () => {
    const TTL = RECOVERY_PHONE_ELEVATION_TTL_MILLIS

    function stepWithGrantAt(grantedAt: number) {
      fixture.destroy()
      fixture = TestBed.createComponent(TwoFactorRecoveryPhoneComponent)
      component = fixture.componentInstance
      component.elevatedAt = grantedAt
      component.ngOnInit()
      return jasmine.createSpy('elevationExpired')
    }

    it('leaves the step eight minutes after 2FA was turned on', fakeAsync(() => {
      const elevationExpired = stepWithGrantAt(Date.now())
      component.elevationExpired.subscribe(elevationExpired)

      tick(TTL - 1)
      expect(elevationExpired).not.toHaveBeenCalled()

      tick(1)
      expect(elevationExpired).toHaveBeenCalledTimes(1)
      expect(fakeObservability.recordSimpleEvent).toHaveBeenCalledWith(
        AppEventName.TwoFactorSetupRecoveryPhoneElevationExpired
      )
    }))

    it('counts from the grant the page reports, not from when the step opened', fakeAsync(() => {
      // Five of the eight minutes were spent on step 1, so three are left
      const elevationExpired = stepWithGrantAt(Date.now() - 5 * 60 * 1000)
      component.elevationExpired.subscribe(elevationExpired)

      tick(3 * 60 * 1000 - 1)
      expect(elevationExpired).not.toHaveBeenCalled()

      tick(1)
      expect(elevationExpired).toHaveBeenCalledTimes(1)
    }))

    it('reports the expiry once when the clock and the registry agree', fakeAsync(() => {
      const elevationExpired = stepWithGrantAt(Date.now())
      component.elevationExpired.subscribe(elevationExpired)

      component.onChallengeRequired()
      tick(TTL)

      expect(elevationExpired).toHaveBeenCalledTimes(1)
      discardPeriodicTasks()
    }))

    it('lets a save already on the wire answer first', fakeAsync(() => {
      const elevationExpired = stepWithGrantAt(Date.now())
      component.elevationExpired.subscribe(elevationExpired)
      // ngOnDestroy because the suite's afterEach calls it on whatever this
      // field holds, and the real form owns an interval that has to die
      component.recoveryPhoneForm = {
        saving: true,
        ngOnDestroy: () => undefined,
      } as RecoveryPhoneFormComponent

      tick(TTL)

      expect(elevationExpired).not.toHaveBeenCalled()
    }))

    it('drops the clock when the step is gone', fakeAsync(() => {
      const elevationExpired = stepWithGrantAt(Date.now())
      component.elevationExpired.subscribe(elevationExpired)

      component.ngOnDestroy()
      tick(TTL)

      expect(elevationExpired).not.toHaveBeenCalled()
    }))
  })
})
