import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsSharingComponent } from './settings-sharing.component'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'

describe('SettingsSharingComponent', () => {
  let component: SettingsSharingComponent
  let fixture: ComponentFixture<SettingsSharingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsSharingComponent],
      providers: [WINDOW_PROVIDERS]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSharingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
