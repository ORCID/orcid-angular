import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsDefaultsComponent } from './settings-defaults.component'
import { WINDOW_PROVIDERS } from '../../../cdk/window'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SettingsDefaultsComponent', () => {
  let component: SettingsDefaultsComponent
  let fixture: ComponentFixture<SettingsDefaultsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsDefaultsComponent],
      providers: [WINDOW_PROVIDERS],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDefaultsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
