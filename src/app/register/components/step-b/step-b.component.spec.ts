import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { StepBComponent } from './step-b.component'

describe('StepBComponent', () => {
  let component: StepBComponent
  let fixture: ComponentFixture<StepBComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepBComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StepBComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
