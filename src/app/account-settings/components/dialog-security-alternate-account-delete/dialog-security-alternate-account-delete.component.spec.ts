import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DialogSecurityAlternateAccountDeleteComponent } from './dialog-security-alternate-account-delete.component'

describe('DialogSecurityAlternateAccountDeleteComponent', () => {
  let component: DialogSecurityAlternateAccountDeleteComponent
  let fixture: ComponentFixture<DialogSecurityAlternateAccountDeleteComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogSecurityAlternateAccountDeleteComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(
      DialogSecurityAlternateAccountDeleteComponent
    )
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
