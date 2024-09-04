import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InfoDropDownComponent } from './info-drop-down.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('InfoDropDownComponent', () => {
  let component: InfoDropDownComponent
  let fixture: ComponentFixture<InfoDropDownComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoDropDownComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoDropDownComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
