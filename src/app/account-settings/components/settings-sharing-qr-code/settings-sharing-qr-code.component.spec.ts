import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsSharingQrCodeComponent } from './settings-sharing-qr-code.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SettingsSharingQrCodeComponent', () => {
  let component: SettingsSharingQrCodeComponent
  let fixture: ComponentFixture<SettingsSharingQrCodeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsSharingQrCodeComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSharingQrCodeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
