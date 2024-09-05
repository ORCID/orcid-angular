import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PanelExpandButtonsComponent as SettingsPanelExpandButtonsComponent } from './settings-panels-expand-buttons.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip'

describe('PanelExpandButtonsComponent', () => {
  let component: SettingsPanelExpandButtonsComponent
  let fixture: ComponentFixture<SettingsPanelExpandButtonsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatLegacyTooltipModule],
      declarations: [SettingsPanelExpandButtonsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPanelExpandButtonsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
