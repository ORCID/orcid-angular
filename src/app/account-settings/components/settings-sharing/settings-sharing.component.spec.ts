import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsSharingComponent } from './settings-sharing.component'
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'

describe('SettingsSharingComponent', () => {
  let component: SettingsSharingComponent
  let fixture: ComponentFixture<SettingsSharingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsSharingComponent],
      providers: [WINDOW_PROVIDERS],
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
