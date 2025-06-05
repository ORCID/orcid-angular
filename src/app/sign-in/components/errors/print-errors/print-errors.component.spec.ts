import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PrintErrorsComponent } from './print-errors.component'
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../../cdk/window'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('PrintErrorsComponent', () => {
  let component: PrintErrorsComponent
  let fixture: ComponentFixture<PrintErrorsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintErrorsComponent],
      providers: [WINDOW_PROVIDERS],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintErrorsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
