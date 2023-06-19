import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ClientSecretModalComponent } from './client-secret-modal.component'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

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
    }).compileComponents()

    fixture = TestBed.createComponent(ClientSecretModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
