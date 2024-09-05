import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResultsComponent } from './results.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ResultsComponent', () => {
  let component: ResultsComponent
  let fixture: ComponentFixture<ResultsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
