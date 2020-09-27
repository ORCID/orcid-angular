import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PanelElementComponent } from './panel-element.component'

describe('PanelElementComponent', () => {
  let component: PanelElementComponent
  let fixture: ComponentFixture<PanelElementComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanelElementComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelElementComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
