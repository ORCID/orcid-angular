import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  tick,
} from '@angular/core/testing'
import { By } from '@angular/platform-browser'

import { RecoveryPhoneFormComponent } from 'src/app/cdk/recovery-phone-form/recovery-phone-form.component'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { InterstitialObservabilityService } from 'src/app/core/login-interstitials-manager/interstitial-observability.service'
import { RECOVERY_PHONE_ELEVATION_TTL_MILLIS } from 'src/app/core/two-factor-authentication/recovery-phone-elevation'
import { AppEventName } from 'src/app/rum/app-event-names'
import { RecoveryPhoneSaveResponse } from 'src/app/types/two-factor.endpoint'

import { RecoveryPhoneInterstitialComponent } from './recovery-phone-interstitial.component'

describe('RecoveryPhoneInterstitialComponent', () => {
  let component: RecoveryPhoneInterstitialComponent
  let fixture: ComponentFixture<RecoveryPhoneInterstitialComponent>
  let observability: jasmine.SpyObj<InterstitialObservabilityService>
  let form: jasmine.SpyObj<RecoveryPhoneFormComponent>

  beforeEach(() => {
    observability = jasmine.createSpyObj<InterstitialObservabilityService>(
      'InterstitialObservabilityService',
      ['shown', 'outcome', 'closed']
    )
    // The form is a standalone component carrying its own phone library, so it
    // is left out of the testing module: the interstitial only ever calls
    // save() on it and reads nothing back
    form = jasmine.createSpyObj<RecoveryPhoneFormComponent>(
      'RecoveryPhoneFormComponent',
      ['save']
    )

    TestBed.configureTestingModule({
      declarations: [RecoveryPhoneInterstitialComponent],
      providers: [
        { provide: InterstitialObservabilityService, useValue: observability },
        WINDOW_PROVIDERS,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })

    fixture = TestBed.createComponent(RecoveryPhoneInterstitialComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  /**
   * The unresolved element leaves the ViewChild empty, and every change
   * detection run refreshes it, so the spy is attached after the last one.
   */
  function attachFormSpy(): void {
    component.recoveryPhoneForm = form
  }

  function primaryButton(): HTMLButtonElement {
    return fixture.debugElement.query(
      By.css('#cy-interstitial-add-recovery-phone')
    ).nativeElement
  }

  function denyButton(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('#deny-button')).nativeElement
  }

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should show a spinner until the form reports it can render', () => {
    // The form renders nothing until its phone field's translations load
    expect(fixture.debugElement.query(By.css('mat-spinner'))).toBeTruthy()

    component.onFormReady()
    fixture.detectChanges()

    expect(fixture.debugElement.query(By.css('mat-spinner'))).toBeNull()
  })

  describe('the primary action', () => {
    it('should be disabled until the form says a code has been sent', () => {
      expect(primaryButton().disabled).toBeTrue()

      component.codeSent = true
      fixture.detectChanges()

      expect(primaryButton().disabled).toBeFalse()
    })

    it('should delegate to the form, which owns what gets posted', () => {
      component.codeSent = true
      fixture.detectChanges()
      attachFormSpy()

      primaryButton().click()

      expect(form.save).toHaveBeenCalled()
    })
  })

  describe('the decline action', () => {
    it('should be a button, because disableClose makes it the only way out', () => {
      const deny = fixture.debugElement.query(By.css('#deny-button'))

      expect(deny).toBeTruthy()
      expect(deny.nativeElement.tagName).toBe('BUTTON')
    })

    /*
     * PD-5850. The label was wrapped in a literal <i>, which the frame does not
     * draw: the slant is the user-agent default for that element, so nothing in
     * a stylesheet undoes it.
     */
    it('should not be italic, which the frame does not draw', () => {
      const deny = denyButton()

      expect(deny.querySelector('i')).toBeNull()
      expect(getComputedStyle(deny).fontStyle).toBe('normal')
      expect(deny.textContent.trim()).toBe(
        'Continue without adding a recovery number'
      )
    })

    it('should be disabled while a save is in flight, so keyboard cannot reach it', () => {
      expect(denyButton().disabled).toBeFalse()

      // The form is left out of the testing module, so the flag it exposes is
      // faked at the seam the template reads it through
      spyOnProperty(component, 'saving', 'get').and.returnValue(true)
      fixture.detectChanges()

      expect(denyButton().disabled).toBeTrue()
    })

    it('should be ignored while a save is in flight', () => {
      // The save POST cannot be called back, so declining now would close
      // reporting nothing added for a number the registry goes on to store,
      // and the record would show no notice for it (R6.4)
      const finish = spyOn(component.finish, 'emit')
      attachFormSpy()
      form.saving = true

      component.declineRecoveryPhone()

      expect(observability.outcome).not.toHaveBeenCalled()
      expect(finish).not.toHaveBeenCalled()
    })

    it('should report a dismissal and end the interstitial without saving', () => {
      const finish = spyOn(component.finish, 'emit')
      attachFormSpy()

      fixture.debugElement.query(By.css('#deny-button')).nativeElement.click()

      expect(observability.outcome).toHaveBeenCalledWith(
        AppEventName.InterstitialDismissed
      )
      expect(form.save).not.toHaveBeenCalled()
      expect(finish).toHaveBeenCalled()
    })
  })

  describe('after the form answers', () => {
    it('should report completion and hand the masked number on', () => {
      component.onSaved({
        success: true,
        maskedRecoveryPhoneNumber: '***********6789',
      } as RecoveryPhoneSaveResponse)

      expect(observability.outcome).toHaveBeenCalledWith(
        AppEventName.InterstitialCompleted
      )
      expect(component.addedRecoveryPhone).toBe('***********6789')
      // The base swaps the form out; the dialog subclass closes instead
      expect(component.afterSummitStatus).toBeTrue()
    })

    it('should never put the number in a telemetry attribute', () => {
      component.onSaved({
        success: true,
        maskedRecoveryPhoneNumber: '***********6789',
      } as RecoveryPhoneSaveResponse)

      // One argument only: the RUM sanitizer redacts attribute keys, not
      // values, so an attribute carrying a number would travel intact
      expect(observability.outcome).toHaveBeenCalled()
      observability.outcome.calls.allArgs().forEach((args) => {
        expect(args.length).toBe(1)
      })
    })

    it('should report a save error and end the interstitial on failure', () => {
      const finish = spyOn(component.finish, 'emit')

      component.onFailed()

      expect(observability.outcome).toHaveBeenCalledWith(
        AppEventName.InterstitialSaveError
      )
      expect(component.afterSummitStatus).toBeFalse()
      expect(finish).toHaveBeenCalled()
    })

    it('should end the interstitial with its own outcome when the registry asks for a challenge', () => {
      // R6.3: there is no second challenge inside an interstitial, and this
      // dialog cannot be dismissed, so the user must not be stranded in it.
      // PD-13638 separates this from a save failure: nothing was saved and
      // nothing failed, the window simply closed.
      const finish = spyOn(component.finish, 'emit')

      component.onChallengeRequired()

      expect(observability.outcome).toHaveBeenCalledWith(
        AppEventName.InterstitialElevationExpired
      )
      expect(observability.outcome).not.toHaveBeenCalledWith(
        AppEventName.InterstitialSaveError
      )
      expect(finish).toHaveBeenCalled()
    })
  })

  describe('when the elevation window runs out on its own', () => {
    const TTL = RECOVERY_PHONE_ELEVATION_TTL_MILLIS

    /** Rebuilt inside fakeAsync, so the clock starts under the fake one. */
    function interstitialOnAFakeClock() {
      fixture.destroy()
      fixture = TestBed.createComponent(RecoveryPhoneInterstitialComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
      observability.outcome.calls.reset()
    }

    it('closes on its own eight minutes after it opened', fakeAsync(() => {
      interstitialOnAFakeClock()
      const finish = spyOn(component.finish, 'emit')

      tick(TTL - 1)
      expect(finish).not.toHaveBeenCalled()

      tick(1)
      expect(observability.outcome).toHaveBeenCalledWith(
        AppEventName.InterstitialElevationExpired
      )
      expect(finish).toHaveBeenCalledTimes(1)
      // Nothing is handed back, so the record page shows no notice (R6.4)
      expect(component.addedRecoveryPhone).toBeUndefined()
    }))

    it('lets a save already on the wire answer first', fakeAsync(() => {
      interstitialOnAFakeClock()
      const finish = spyOn(component.finish, 'emit')
      component.recoveryPhoneForm = form
      ;(form as any).saving = true

      tick(TTL)

      expect(finish).not.toHaveBeenCalled()
      expect(observability.outcome).not.toHaveBeenCalled()
      ;(form as any).saving = false
    }))

    it('does not report a second outcome after one has already ended it', fakeAsync(() => {
      // A dialog is not destroyed until its exit animation finishes, so the
      // clock is still live for a moment after a save has closed it
      interstitialOnAFakeClock()
      component.onSaved({ success: true } as RecoveryPhoneSaveResponse)
      observability.outcome.calls.reset()

      tick(TTL)

      expect(observability.outcome).not.toHaveBeenCalled()
      discardPeriodicTasks()
    }))

    it('drops the clock when the interstitial is gone', fakeAsync(() => {
      interstitialOnAFakeClock()
      const finish = spyOn(component.finish, 'emit')

      component.ngOnDestroy()
      tick(TTL)

      expect(finish).not.toHaveBeenCalled()
      discardPeriodicTasks()
    }))
  })
})
