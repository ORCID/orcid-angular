import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { StepCComponent } from './step-c.component'

describe('StepCComponent', () => {
  let component: StepCComponent
  let fixture: ComponentFixture<StepCComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StepCComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(StepCComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
