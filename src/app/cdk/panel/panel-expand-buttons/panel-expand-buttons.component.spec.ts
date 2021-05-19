import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PanelExpandButtonsComponent } from './panel-expand-buttons.component'

describe('PanelExpandButtonsComponent', () => {
  let component: PanelExpandButtonsComponent
  let fixture: ComponentFixture<PanelExpandButtonsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanelExpandButtonsComponent],
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
