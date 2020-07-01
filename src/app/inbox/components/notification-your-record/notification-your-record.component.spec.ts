import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { NotificationYourRecordComponent } from './notification-your-record.component'

describe('NotificationYourRecordComponent', () => {
  let component: NotificationYourRecordComponent
  let fixture: ComponentFixture<NotificationYourRecordComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationYourRecordComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationYourRecordComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
