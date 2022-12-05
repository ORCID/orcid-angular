import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PanelExpandButtonsComponent } from './panel-expand-buttons.component'
import { AppPanelsExpandAriaLabelPipe } from '../../../shared/pipes/app-panels-expand-aria-label/app-panels-expand-aria-label.pipe'

describe('PanelExpandButtonsComponent', () => {
  let component: PanelExpandButtonsComponent
  let fixture: ComponentFixture<PanelExpandButtonsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanelExpandButtonsComponent, AppPanelsExpandAriaLabelPipe],
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
