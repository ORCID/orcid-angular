import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { DisplayAttributeComponent } from './display-attribute.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('DisplayAttributeComponent', () => {
  let component: DisplayAttributeComponent
  let fixture: ComponentFixture<DisplayAttributeComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayAttributeComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayAttributeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
