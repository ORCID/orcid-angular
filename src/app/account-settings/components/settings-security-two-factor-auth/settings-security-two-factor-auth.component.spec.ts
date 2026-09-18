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
import { TogglzService } from '../../../core/togglz/togglz.service'
import { ActivatedRoute, Router } from '@angular/router'
import { of } from 'rxjs'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { Status } from '../../../types/two-factor.endpoint'
import { ApplicationRoutes } from '../../../constants'
import { MonthDayYearDateToStringPipe } from '../../../shared/pipes/month-day-year-date-to-string/month-day-year-date-to-string.pipe'

describe('SettingsSecurityTwoFactorAuthComponent', () => {
  let component: SettingsSecurityTwoFactorAuthComponent
  let fixture: ComponentFixture<SettingsSecurityTwoFactorAuthComponent>
  let togglzService: jasmine.SpyObj<TogglzService>
  let queryParams: Record<string, string> = {}

  const enabledStatus = (overrides: Partial<Status> = {}): Status =>
    ({
      enabled: true,
      twoFactorCreationDate: { year: '2026', month: '04', day: '15' },
      recoveryCodeCreationDate: { year: '2026', month: '04', day: '15' },
      ...overrides,
    }) as Status

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
})
