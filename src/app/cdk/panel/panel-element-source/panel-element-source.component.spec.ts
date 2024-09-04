import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PanelElementSourceComponent } from './panel-element-source.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('PanelElementSourceComponent', () => {
  let component: PanelElementSourceComponent
  let fixture: ComponentFixture<PanelElementSourceComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanelElementSourceComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelElementSourceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
