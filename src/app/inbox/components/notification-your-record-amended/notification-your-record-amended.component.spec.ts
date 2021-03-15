import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotificationYourRecordAmendedComponent } from './notification-your-record-amended.component'

describe('NotificationYourRecordAmendedComponent', () => {
  let component: NotificationYourRecordAmendedComponent
  let fixture: ComponentFixture<NotificationYourRecordAmendedComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationYourRecordAmendedComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationYourRecordAmendedComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
