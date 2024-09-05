import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ClientSecretModalComponent } from './client-secret-modal.component'
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ClientSecretModalComponent', () => {
  let component: ClientSecretModalComponent
  let fixture: ComponentFixture<ClientSecretModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientSecretModalComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(ClientSecretModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
