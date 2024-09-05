import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PanelPrivacyComponent } from './panel-privacy.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('PanelPrivacyComponent', () => {
  let component: PanelPrivacyComponent
  let fixture: ComponentFixture<PanelPrivacyComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanelPrivacyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelPrivacyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
