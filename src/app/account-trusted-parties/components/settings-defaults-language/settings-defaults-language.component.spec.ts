import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsDefaultsLanguageComponent } from './settings-defaults-language.component'

describe('SettingsDefaultsLanguageComponent', () => {
  let component: SettingsDefaultsLanguageComponent
  let fixture: ComponentFixture<SettingsDefaultsLanguageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsDefaultsLanguageComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDefaultsLanguageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
