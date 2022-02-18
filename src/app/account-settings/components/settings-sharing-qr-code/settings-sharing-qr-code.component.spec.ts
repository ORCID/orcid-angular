import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsSharingQrCodeComponent } from './settings-sharing-qr-code.component'

describe('SettingsSharingQrCodeComponent', () => {
  let component: SettingsSharingQrCodeComponent
  let fixture: ComponentFixture<SettingsSharingQrCodeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsSharingQrCodeComponent],
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
