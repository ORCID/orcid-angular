import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AccountTrustedPartiesComponent } from './account-trusted-parties.component'

describe('AccountSettingsComponent', () => {
  let component: AccountTrustedPartiesComponent
  let fixture: ComponentFixture<AccountTrustedPartiesComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountTrustedPartiesComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTrustedPartiesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
