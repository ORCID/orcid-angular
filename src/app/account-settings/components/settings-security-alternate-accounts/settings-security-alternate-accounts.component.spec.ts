import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsSecurityAlternateAccountsComponent } from './settings-security-alternate-accounts.component'

describe('SettingsSecurityAlternateAccountsComponent', () => {
  let component: SettingsSecurityAlternateAccountsComponent
  let fixture: ComponentFixture<SettingsSecurityAlternateAccountsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsSecurityAlternateAccountsComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(
      SettingsSecurityAlternateAccountsComponent
    )
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
