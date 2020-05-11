import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FormNotificationsComponent } from './form-notifications.component'

describe('FormNotificationsComponent', () => {
  let component: FormNotificationsComponent
  let fixture: ComponentFixture<FormNotificationsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormNotificationsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNotificationsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
