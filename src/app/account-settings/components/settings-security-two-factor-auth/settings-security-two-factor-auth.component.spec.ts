import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsSecurityTwoFactorAuthComponent } from './settings-security-two-factor-auth.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { RecoveryPhoneChallengeService } from '../../../core/two-factor-authentication/recovery-phone-challenge.service'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject, of } from 'rxjs'
import {
  AUTH_CHALLENGE_HEADING_ID,
  AuthChallengeRecoveryPhone,
} from '@orcid/registry-ui'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { Status } from '../../../types/two-factor.endpoint'
import { ApplicationRoutes } from '../../../constants'
import { MonthDayYearDateToStringPipe } from '../../../shared/pipes/month-day-year-date-to-string/month-day-year-date-to-string.pipe'

describe('SettingsSecurityTwoFactorAuthComponent', () => {
  let component: SettingsSecurityTwoFactorAuthComponent
  let fixture: ComponentFixture<SettingsSecurityTwoFactorAuthComponent>
  let togglzService: jasmine.SpyObj<TogglzService>
  let recoveryPhoneChallengeService: jasmine.SpyObj<RecoveryPhoneChallengeService>
  let recoveryPhone: AuthChallengeRecoveryPhone
  let queryParams: Record<string, string> = {}

  /** A stand-in for the object the factory hands the challenge. */
  function buildRecoveryPhoneHandle(): AuthChallengeRecoveryPhone {
    return {
      available: true,
      maskedNumber: '***********1234',
      codeSent: false,
      resendSeconds: 0,
      sending: false,
      errorCode: undefined,
      used: false,
      sendCode: jasmine.createSpy('sendCode'),
      verify: jasmine.createSpy('verify').and.returnValue(of('passed')),
      dispose: jasmine.createSpy('dispose'),
    }
  }

  /**
   * Stands in for the challenge dialog so the panel's own branching can be
   * driven directly: emit `submitAttempt`, then close with a result.
   */
  function stubChallengeDialog() {
    const submitAttempt = new Subject<void>()
    const cancelAttempt = new Subject<void>()
    const closed = new Subject<any>()
    const dialogRef = {
      componentInstance: {
        submitAttempt,
        cancelAttempt,
        loading: true,
        processBackendResponse: jasmine.createSpy('processBackendResponse'),
      },
      afterClosed: () => closed.asObservable(),
      close: jasmine.createSpy('close'),
    }
    spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRef as any)
    return { dialogRef, submitAttempt, closed }
  }

  const enabledStatus = (overrides: Partial<Status> = {}): Status =>
    ({
      enabled: true,
      twoFactorCreationDate: { year: '2026', month: '04', day: '15' },
      recoveryCodeCreationDate: { year: '2026', month: '04', day: '15' },
      ...overrides,
    } as Status)

  function build(flagEnabled: boolean, params: Record<string, string> = {}) {
    togglzService.getStateOf.and.returnValue(of(flagEnabled))
    queryParams = params
    fixture = TestBed.createComponent(SettingsSecurityTwoFactorAuthComponent)
    component = fixture.componentInstance
    component.twoFactorInfo = enabledStatus()
    fixture.detectChanges()
  }

  beforeEach(async () => {
    togglzService = jasmine.createSpyObj('TogglzService', ['getStateOf'])
    togglzService.getStateOf.and.returnValue(of(false))
    recoveryPhone = buildRecoveryPhoneHandle()
    recoveryPhoneChallengeService = jasmine.createSpyObj(
      'RecoveryPhoneChallengeService',
      ['create']
    )
    recoveryPhoneChallengeService.create.and.callFake(() => recoveryPhone)
    queryParams = {}

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [
        SettingsSecurityTwoFactorAuthComponent,
        MonthDayYearDateToStringPipe,
      ],
      providers: [
        WINDOW_PROVIDERS,
        TwoFactorAuthenticationService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
        { provide: TogglzService, useValue: togglzService },
        {
          provide: RecoveryPhoneChallengeService,
          useValue: recoveryPhoneChallengeService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            // PlatformInfoService subscribes to this
            queryParams: of({}),
            snapshot: {
              queryParamMap: { get: (key: string) => queryParams[key] ?? null },
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  it('should create', () => {
    build(false)
    expect(component).toBeTruthy()
  })

  it('leaves the panel as it was when the flag is off', () => {
    build(false)
    const text = fixture.nativeElement.textContent

    expect(component.recoveryPhoneTogglz).toBeFalse()
    expect(text).toContain('Account recovery')
    expect(text).not.toContain('2FA backup')
    expect(text).not.toContain('Recovery phone number')
  })

  it('renames the section and offers to add a number when there is none', () => {
    build(true)
    const text = fixture.nativeElement.textContent

    expect(text).toContain('2FA backup')
    expect(text).toContain('Add recovery phone number')
    expect(text).not.toContain('Manage recovery phone number')
    expect(component.hasRecoveryPhone).toBeFalse()
  })

  it('shows the masked number and its enabled date once one is stored', () => {
    build(true)
    component.twoFactorInfo = enabledStatus({
      maskedRecoveryPhoneNumber: '***********1234',
      recoveryPhoneCreationDate: { year: '2026', month: '04', day: '15' },
      recoveryPhoneLastModifiedDate: { year: '2026', month: '04', day: '15' },
      recoveryPhoneModified: false,
    })
    fixture.detectChanges()
    const text = fixture.nativeElement.textContent

    expect(text).toContain('***********1234')
    expect(text).toContain('Enabled:')
    expect(text).toContain('Manage recovery phone number')
    expect(text).not.toContain('Modified:')
  })

  it('labels the date as modified once the number has been changed', () => {
    build(true)
    component.twoFactorInfo = enabledStatus({
      maskedRecoveryPhoneNumber: '***********7890',
      recoveryPhoneCreationDate: { year: '2026', month: '04', day: '15' },
      recoveryPhoneLastModifiedDate: { year: '2026', month: '05', day: '17' },
      recoveryPhoneModified: true,
    })
    fixture.detectChanges()

    expect(fixture.nativeElement.textContent).toContain('Modified:')
    expect(component.recoveryPhoneDate).toEqual({
      year: '2026',
      month: '05',
      day: '17',
    } as any)
  })

  it('reports a number that was added', () => {
    build(true, { recoveryPhone: 'added' })
    expect(fixture.nativeElement.textContent).toContain(
      'Your recovery phone number has been added'
    )
  })

  it('reports a number that was updated', () => {
    build(true, { recoveryPhone: 'updated' })
    expect(fixture.nativeElement.textContent).toContain(
      'Your recovery phone number has been updated'
    )
  })

  it('warns when the number could not be saved', () => {
    build(true, { recoveryPhone: 'failed' })
    expect(fixture.nativeElement.textContent).toContain(
      'Your recovery phone number was not updated'
    )
  })

  it('ignores an outcome it does not recognise', () => {
    build(true, { recoveryPhone: 'nonsense' })
    expect(component.recoveryPhoneOutcome).toBeUndefined()
  })

  it('opens the recovery phone page from the panel link', () => {
    build(true)
    const router = TestBed.inject(Router)
    const navigate = spyOn(router, 'navigate')

    component.manageRecoveryPhone()

    expect(navigate).toHaveBeenCalledWith([ApplicationRoutes.recoveryPhone])
  })

  describe('a challenge answered with a recovery phone number code', () => {
    it('offers the option to the challenge it opens', () => {
      build(true)
      const { dialogRef } = stubChallengeDialog()

      component.openAuthChallenge()

      expect(recoveryPhoneChallengeService.create).toHaveBeenCalled()
      const open = TestBed.inject(MatDialog).open as jasmine.Spy
      const config = open.calls.mostRecent().args[1] as any
      expect(config.data.recoveryPhone).toBe(recoveryPhone)
      // the account password is the one the challenge collects itself here
      expect(config.data.passwordControlName).toBe('password')
      // named from the challenge's own heading rather than a second copy of it
      expect(config.ariaLabelledBy).toBe(AUTH_CHALLENGE_HEADING_ID)
      expect(config.ariaLabel).toBeUndefined()
      expect(dialogRef.close).not.toHaveBeenCalled()
    })

    it('does not disable 2FA a second time (R5.3)', () => {
      build(true)
      component.twoFactorInfo = enabledStatus({
        maskedRecoveryPhoneNumber: '***********1234',
        recoveryPhoneCreationDate: { year: '2026', month: '04', day: '15' },
      })
      const twoFactorService = TestBed.inject(TwoFactorAuthenticationService)
      const disable = spyOn(twoFactorService, 'disable').and.returnValue(
        of({} as any)
      )
      const stateOutput = spyOn(component.twoFactorStateOutput, 'emit')
      const { dialogRef, submitAttempt, closed } = stubChallengeDialog()

      component.openAuthChallenge()
      recoveryPhone.used = true
      submitAttempt.next()

      expect(disable).not.toHaveBeenCalled()
      expect(component.twoFactorInfo?.enabled).toBeFalse()
      expect(component.twoFactorInfo?.maskedRecoveryPhoneNumber).toBeUndefined()
      expect(stateOutput).toHaveBeenCalledWith(false)
      expect(dialogRef.close).toHaveBeenCalledWith(true)

      closed.next(true)
      fixture.detectChanges()
      expect(component.success).toBeTrue()
      expect(fixture.nativeElement.textContent).toContain(
        'Two-factor authentication has been disabled'
      )
    })

    it('still posts the ordinary disable when the option was not used', () => {
      build(true)
      const twoFactorService = TestBed.inject(TwoFactorAuthenticationService)
      const disable = spyOn(twoFactorService, 'disable').and.returnValue(
        of({ success: true, enabled: false } as any)
      )
      const { dialogRef, submitAttempt } = stubChallengeDialog()

      component.openAuthChallenge()
      submitAttempt.next()

      expect(disable).toHaveBeenCalled()
      expect(dialogRef.close).toHaveBeenCalledWith(true)
    })
  })
  /*
   * PD-5635, the second design round. Three values measured off the frame
   * exports rather than read off the panel: the disable button is
   * state-warning-dark over 9 486 px of `pd-6046-03`, every rule in the body of
   * that frame is a single #eeeeee row, and the off state opens with a heading
   * the panel did not have.
   */
  describe('the panel against its design frame', () => {
    it('paints the disable button state-warning-dark, border and all', () => {
      build(true)
      const button: HTMLElement = fixture.nativeElement.querySelector(
        '.two-factor-panel__disable-button'
      )
      const style = getComputedStyle(button)

      expect(style.backgroundColor).toBe('rgb(211, 47, 47)')
      expect(style.borderTopColor).toBe('rgb(211, 47, 47)')
    })

    it('rules the panel body in ui-background-light', () => {
      build(true)
      const section: HTMLElement = fixture.nativeElement.querySelector(
        '.two-factor-panel__section'
      )

      expect(getComputedStyle(section).borderBottomColor).toBe(
        'rgb(238, 238, 238)'
      )
    })

    it('opens the off state with the heading the frame draws', () => {
      build(true)
      component.twoFactorInfo = { enabled: false } as any
      fixture.detectChanges()
      const heading: HTMLElement = fixture.nativeElement.querySelector(
        '.two-factor-panel__heading'
      )

      expect(heading).toBeTruthy()
      expect(heading.textContent.trim()).toBe(
        'Enable two-factor authentication'
      )
    })
  })

  /*
   * PD-6046, the third design round. The frame's disable paragraph
   * (I904:11559;5677:17140, the same node in all five ON states) closes on
   * "any account recovery options you have set up". The build had a second
   * sentence behind the recovery-phone flag - "your 2FA backup options" - so
   * the paragraph the frame draws was the one a user could never see once the
   * feature was on. One sentence now, in one message, whatever the flag says.
   */
  describe('the disable warning against its frame', () => {
    const frameSentence =
      'You can disable two-factor authentication at any time. ' +
      'Turning 2FA off will reset any account recovery options you have set up.'

    const disableWarning = (): HTMLElement =>
      Array.from(
        fixture.nativeElement.querySelectorAll('p.two-factor-panel__copy')
      ).find((paragraph: HTMLElement) =>
        paragraph.textContent.includes('You can disable')
      ) as HTMLElement

    it('states the frame sentence with the recovery phone flag on', () => {
      build(true)
      const warning = disableWarning()

      expect(warning).toBeTruthy()
      expect(warning.textContent.replace(/\s+/g, ' ').trim()).toBe(
        frameSentence
      )
    })

    it('states the same sentence with the flag off', () => {
      build(false)
      const warning = disableWarning()

      expect(warning).toBeTruthy()
      expect(warning.textContent.replace(/\s+/g, ' ').trim()).toBe(
        frameSentence
      )
    })
  })
})
