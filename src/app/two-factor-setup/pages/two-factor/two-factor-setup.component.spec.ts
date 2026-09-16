import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TwoFactorSetupComponent } from './two-factor-setup.component'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { Router } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { DebugElement } from '@angular/core'
import { By } from '@angular/platform-browser'
import { Observable, Subject, isObservable, of, throwError } from 'rxjs'
import { TogglzFlag } from '../../../types/config.endpoint'
import { Status } from '../../../types/two-factor.endpoint'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('Component: TwoFactorSetupComponent', () => {
  let component: TwoFactorSetupComponent
  let compiled: any
  let fixture: ComponentFixture<TwoFactorSetupComponent>
  let fakeTogglzService: jasmine.SpyObj<TogglzService>
  let fakeTwoFactorAuthenticationService: jasmine.SpyObj<TwoFactorAuthenticationService>
  let router: Router

  /**
   * The flag is read on init, so it has to be set before the fixture exists;
   * every test that wants the three step flow builds its own. An observable is
   * accepted too, for the tests that care about the moment it answers.
   */
  function createComponent(
    recoveryPhoneFlag: boolean | Observable<boolean> = false
  ) {
    fakeTogglzService.getStateOf.and.returnValue(
      isObservable(recoveryPhoneFlag)
        ? recoveryPhoneFlag
        : of(recoveryPhoneFlag)
    )
    fixture = TestBed.createComponent(TwoFactorSetupComponent)
    component = fixture.componentInstance
    compiled = fixture.debugElement.nativeElement
    fixture.detectChanges()
  }

  /**
   * The step components are not declared here, so a binding to one of them
   * lands on the element as a DOM property. That is what the page is
   * responsible for; what each step does with it is its own spec.
   */
  function boundProperty(selector: string, property: string): any {
    return findComponent(fixture, selector)?.nativeElement[property]
  }

  /** Walks step 1 out of the way with the backup codes it hands over. */
  function completeStepOne() {
    component.twoFactorEnabled({
      backupCodes: 'code1\ncode2',
      backupCodesClipboard: 'code1 code2',
    })
    fixture.detectChanges()
  }

  beforeEach(() => {
    fakeTogglzService = jasmine.createSpyObj<TogglzService>('TogglzService', [
      'getStateOf',
    ])
    fakeTogglzService.getStateOf.and.returnValue(of(false))
    fakeTwoFactorAuthenticationService = jasmine.createSpyObj(
      'TwoFactorAuthenticationService',
      ['checkState']
    )
    fakeTwoFactorAuthenticationService.checkState.and.returnValue(
      of({ enabled: false } as Status)
    )

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [TwoFactorSetupComponent],
      providers: [
        WINDOW_PROVIDERS,
        {
          provide: TwoFactorAuthenticationService,
          useValue: fakeTwoFactorAuthenticationService,
        },
        {
          provide: TogglzService,
          useValue: fakeTogglzService,
        },
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    router = TestBed.inject(Router)
    spyOn(router, 'navigate').and.resolveTo(true)
  })

  beforeEach(() => {
    createComponent()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should render TwoFactorEnableComponent', () => {
    const counter = findComponent(fixture, 'app-two-factor-enable')
    expect(counter).toBeTruthy()
  })

  it('should render TwoFactorRecoveryCodesComponent once the 2FA is enabled', () => {
    component.step = 'recoveryCodes'
    fixture.detectChanges()
    const counter = findComponent(fixture, 'app-two-factor-recovery-codes')
    expect(counter).toBeTruthy()
  })

  it('should send a user who already has 2FA on back to account settings', () => {
    expect(router.navigate).toHaveBeenCalledTimes(0)

    fakeTwoFactorAuthenticationService.checkState.and.returnValue(
      of({ enabled: true } as Status)
    )
    fixture.destroy()
    createComponent()

    expect(router.navigate).toHaveBeenCalled()
  })

  it('should render nothing at all until the flag has answered (R2.1)', () => {
    const flag = new Subject<boolean>()
    fixture.destroy()
    createComponent(flag)

    // the subtitle field still says "of 2" at this point, so rendering step 1
    // here is what makes the user watch it renumber itself
    expect(findComponent(fixture, 'app-two-factor-enable')).toBeNull()
    expect(compiled.querySelector('.container')).toBeNull()

    flag.next(true)
    fixture.detectChanges()

    expect(findComponent(fixture, 'app-two-factor-enable')).toBeTruthy()
    expect(boundProperty('app-two-factor-enable', 'subtitle')).toBe(
      'Step 1 of 3 - Authentication app'
    )
  })

  it('should fall back to the two step flow if the flag cannot be read', () => {
    fixture.destroy()
    createComponent(throwError(() => new Error('togglz is down')))

    expect(findComponent(fixture, 'app-two-factor-enable')).toBeTruthy()
    expect(boundProperty('app-two-factor-enable', 'subtitle')).toBe(
      'Step 1 of 2 - Authentication app'
    )
  })

  it('should read the recovery phone flag exactly once', () => {
    expect(fakeTogglzService.getStateOf).toHaveBeenCalledWith(
      TogglzFlag.TWO_FACTOR_RECOVERY_PHONE
    )
    expect(fakeTogglzService.getStateOf).toHaveBeenCalledTimes(1)

    completeStepOne()

    expect(fakeTogglzService.getStateOf).toHaveBeenCalledTimes(1)
  })

  describe('with the recovery phone flag off', () => {
    it('should keep the two step subtitles (R2.1)', () => {
      expect(boundProperty('app-two-factor-enable', 'subtitle')).toBe(
        'Step 1 of 2 - Authentication app'
      )

      completeStepOne()

      expect(boundProperty('app-two-factor-recovery-codes', 'subtitle')).toBe(
        'Step 2 of 2 - 2FA recovery codes'
      )
    })

    it('should go straight from the app step to the recovery codes (R2.1)', () => {
      completeStepOne()

      expect(component.step).toBe('recoveryCodes')
      expect(findComponent(fixture, 'app-two-factor-recovery-phone')).toBeNull()
      expect(
        findComponent(fixture, 'app-two-factor-recovery-codes')
      ).toBeTruthy()
    })
  })

  describe('with the recovery phone flag on', () => {
    beforeEach(() => {
      fixture.destroy()
      createComponent(true)
    })

    it('should renumber the steps as three (R2.1)', () => {
      expect(boundProperty('app-two-factor-enable', 'subtitle')).toBe(
        'Step 1 of 3 - Authentication app'
      )

      completeStepOne()

      expect(boundProperty('app-two-factor-recovery-phone', 'subtitle')).toBe(
        'Step 2 of 3 - Recovery phone number'
      )

      component.recoveryPhoneCompleted()
      fixture.detectChanges()

      expect(boundProperty('app-two-factor-recovery-codes', 'subtitle')).toBe(
        'Step 3 of 3 - 2FA recovery codes'
      )
    })

    it('should show the recovery phone step after the app step (R2.1)', () => {
      completeStepOne()

      expect(component.step).toBe('recoveryPhone')
      expect(
        findComponent(fixture, 'app-two-factor-recovery-phone')
      ).toBeTruthy()
      expect(findComponent(fixture, 'app-two-factor-recovery-codes')).toBeNull()
    })

    it('should advance to the recovery codes when the step completes (R2.4, R2.5)', () => {
      completeStepOne()

      component.recoveryPhoneCompleted()
      fixture.detectChanges()

      expect(component.step).toBe('recoveryCodes')
      expect(findComponent(fixture, 'app-two-factor-recovery-phone')).toBeNull()
      expect(
        findComponent(fixture, 'app-two-factor-recovery-codes')
      ).toBeTruthy()
    })

    it('should still hand over the recovery codes when the step can no longer run', () => {
      completeStepOne()

      component.recoveryPhoneFailed('2FA_DISABLED')
      fixture.detectChanges()

      expect(component.step).toBe('recoveryCodes')
      expect(
        boundProperty('app-two-factor-recovery-codes', 'backupCodes')
      ).toBe('code1\ncode2')
    })

    it('should stay on the recovery phone step when a save fails (R2.4)', () => {
      completeStepOne()

      component.recoveryPhoneFailed('HTTP')
      fixture.detectChanges()

      // no number was stored, so the codes step would be telling the user the
      // step behind them succeeded
      expect(component.step).toBe('recoveryPhone')
      expect(
        findComponent(fixture, 'app-two-factor-recovery-phone')
      ).toBeTruthy()
      expect(findComponent(fixture, 'app-two-factor-recovery-codes')).toBeNull()
    })
  })
})

export function findComponent<T>(
  fixture: ComponentFixture<T>,
  selector: string
): DebugElement {
  return fixture.debugElement.query(By.css(selector))
}
