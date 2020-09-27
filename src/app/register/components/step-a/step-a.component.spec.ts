import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StepAComponent } from './step-a.component'

describe('StepAComponent', () => {
  let component: StepAComponent
  let fixture: ComponentFixture<StepAComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepAComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StepAComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
