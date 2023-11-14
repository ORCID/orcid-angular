import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StepCTComponent } from './step-c.component'

describe('StepCComponent', () => {
  let component: StepCTComponent
  let fixture: ComponentFixture<StepCTComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepCTComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StepCTComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
