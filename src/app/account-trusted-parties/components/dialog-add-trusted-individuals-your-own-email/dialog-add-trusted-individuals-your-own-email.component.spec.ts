import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DialogAddTrustedIndividualsYourOwnEmailComponent } from './dialog-add-trusted-individuals-your-own-email.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('DialogAddTrustedIndividualsComponent', () => {
  let component: DialogAddTrustedIndividualsYourOwnEmailComponent
  let fixture: ComponentFixture<DialogAddTrustedIndividualsYourOwnEmailComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DialogAddTrustedIndividualsYourOwnEmailComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(
      DialogAddTrustedIndividualsYourOwnEmailComponent
    )
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
