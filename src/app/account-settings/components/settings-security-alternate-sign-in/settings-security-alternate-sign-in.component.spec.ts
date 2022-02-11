import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsSecurityAlternateSignInComponent } from './settings-security-alternate-sign-in.component'

describe('SettingsSecurityAlternateSignInComponent', () => {
  let component: SettingsSecurityAlternateSignInComponent
  let fixture: ComponentFixture<SettingsSecurityAlternateSignInComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsSecurityAlternateSignInComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSecurityAlternateSignInComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
