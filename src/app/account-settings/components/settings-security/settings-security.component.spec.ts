import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsSecurityComponent } from './settings-security.component'
import { WINDOW } from '../../../cdk/window'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { RecoveryPhoneChallengeService } from '../../../core/two-factor-authentication/recovery-phone-challenge.service'
import { Status } from '../../../types/two-factor.endpoint'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { Subject, of } from 'rxjs'

describe('SettingsSecurityComponent', () => {
  let component: SettingsSecurityComponent
  let fixture: ComponentFixture<SettingsSecurityComponent>
  let twoFactor: jasmine.SpyObj<TwoFactorAuthenticationService>
  let twoFactorDisabled: Subject<void>

  const enabled = {
    enabled: true,
    maskedRecoveryPhoneNumber: '*******1234',
  } as Status
  const disabled = { enabled: false } as Status

  beforeEach(async () => {
    twoFactor = jasmine.createSpyObj('TwoFactorAuthenticationService', [
      'checkState',
    ])
    twoFactor.checkState.and.returnValues(of(enabled), of(disabled))
    twoFactorDisabled = new Subject<void>()

    await TestBed.configureTestingModule({
      declarations: [SettingsSecurityComponent],
      providers: [
        { provide: WINDOW, useValue: { location: { hash: '' } } },
        { provide: TwoFactorAuthenticationService, useValue: twoFactor },
        {
          provide: RecoveryPhoneChallengeService,
          useValue: { twoFactorDisabled$: twoFactorDisabled.asObservable() },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSecurityComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('reads the 2FA state once on load', () => {
    expect(twoFactor.checkState).toHaveBeenCalledTimes(1)
    expect(component.twoFactorEnabled).toBeTrue()
    expect(component.twoFactorInfo).toBe(enabled)
  })

  it('shows 2FA off as soon as a challenge is passed with the recovery phone (PD-14596 R3.1, R3.2)', () => {
    twoFactorDisabled.next()

    expect(component.twoFactorEnabled).toBeFalse()
    expect(twoFactor.checkState).toHaveBeenCalledTimes(2)
    expect(component.twoFactorInfo).toBe(disabled)
  })

  it('stops listening once the page is gone', () => {
    fixture.destroy()
    twoFactorDisabled.next()

    expect(twoFactor.checkState).toHaveBeenCalledTimes(1)
  })
})
