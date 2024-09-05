import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PanelElementComponent } from './panel-element.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('PanelElementComponent', () => {
  let component: PanelElementComponent
  let fixture: ComponentFixture<PanelElementComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanelElementComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
