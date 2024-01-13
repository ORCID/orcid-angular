import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StepC2Component } from './step-c2.component'

describe('StepCComponent', () => {
  let component: StepC2Component
  let fixture: ComponentFixture<StepC2Component>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepC2Component],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StepC2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
