import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsSharingHtmlCodeComponent } from './settings-sharing-html-code.component'

describe('SettingsSharingHtmlCodeComponent', () => {
  let component: SettingsSharingHtmlCodeComponent
  let fixture: ComponentFixture<SettingsSharingHtmlCodeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsSharingHtmlCodeComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSharingHtmlCodeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
