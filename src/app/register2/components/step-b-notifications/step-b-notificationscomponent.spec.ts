import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StepBNotificationsComponent } from './step-b-notifications.component'

describe('StepBComponent', () => {
  let component: StepBNotificationsComponent
  let fixture: ComponentFixture<StepBNotificationsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepBNotificationsComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StepBNotificationsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
