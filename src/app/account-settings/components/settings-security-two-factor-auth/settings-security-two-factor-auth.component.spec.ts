import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsSecurityTwoFactorAuthComponent } from './settings-security-two-factor-auth.component'

describe('SettingsSecurityTwoFactorAuthComponent', () => {
  let component: SettingsSecurityTwoFactorAuthComponent
  let fixture: ComponentFixture<SettingsSecurityTwoFactorAuthComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsSecurityTwoFactorAuthComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSecurityTwoFactorAuthComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
