import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsDefaultsVisibilityComponent } from './settings-defaults-visibility.component'

describe('SettingsDefaultsVisibilityComponent', () => {
  let component: SettingsDefaultsVisibilityComponent
  let fixture: ComponentFixture<SettingsDefaultsVisibilityComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsDefaultsVisibilityComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDefaultsVisibilityComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
