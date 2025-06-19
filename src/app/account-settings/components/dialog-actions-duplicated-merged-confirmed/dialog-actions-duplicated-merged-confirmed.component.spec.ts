import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DialogActionsDuplicatedMergedConfirmedComponent } from './dialog-actions-duplicated-merged-confirmed.component'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('DialogActionsDuplicatedMergedConfirmedComponent', () => {
  let component: DialogActionsDuplicatedMergedConfirmedComponent
  let fixture: ComponentFixture<DialogActionsDuplicatedMergedConfirmedComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogActionsDuplicatedMergedConfirmedComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(
      DialogActionsDuplicatedMergedConfirmedComponent
    )
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
