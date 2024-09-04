import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PanelExpandButtonsComponent } from './panel-expand-buttons.component'
import { AppPanelsExpandAriaLabelPipe } from '../../../shared/pipes/app-panels-expand-aria-label/app-panels-expand-aria-label.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip'

describe('PanelExpandButtonsComponent', () => {
  let component: PanelExpandButtonsComponent
  let fixture: ComponentFixture<PanelExpandButtonsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatLegacyTooltipModule],
      declarations: [PanelExpandButtonsComponent, AppPanelsExpandAriaLabelPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelExpandButtonsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
