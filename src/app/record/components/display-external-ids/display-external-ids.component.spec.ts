import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { DisplayExternalIdsComponent } from './display-external-ids.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('DisplayExternalIdsComponent', () => {
  let component: DisplayExternalIdsComponent
  let fixture: ComponentFixture<DisplayExternalIdsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayExternalIdsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayExternalIdsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
