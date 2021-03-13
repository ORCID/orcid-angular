import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotificationHtmlComponent } from './notification-html.component'

describe('NotificationHtmlComponent', () => {
  let component: NotificationHtmlComponent
  let fixture: ComponentFixture<NotificationHtmlComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationHtmlComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationHtmlComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
