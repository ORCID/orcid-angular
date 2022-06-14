import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DialogSecurityAlternateAccountDeleteComponent } from './dialog-security-alternate-account-delete.component'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

describe('DialogSecurityAlternateAccountDeleteComponent', () => {
  let component: DialogSecurityAlternateAccountDeleteComponent
  let fixture: ComponentFixture<DialogSecurityAlternateAccountDeleteComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogSecurityAlternateAccountDeleteComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
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
