import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsDefaultsEmailFrequencyComponent } from './settings-defaults-email-frequency.component'

describe('SettingsDefaultsEmailFrequencyComponent', () => {
  let component: SettingsDefaultsEmailFrequencyComponent
  let fixture: ComponentFixture<SettingsDefaultsEmailFrequencyComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsDefaultsEmailFrequencyComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDefaultsEmailFrequencyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
