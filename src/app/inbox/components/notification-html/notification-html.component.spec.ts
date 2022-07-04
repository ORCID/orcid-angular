import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotificationHtmlComponent } from './notification-html.component'
import { SharedModule } from '../../../shared/shared.module'

describe('NotificationHtmlComponent', () => {
  let component: NotificationHtmlComponent
  let fixture: ComponentFixture<NotificationHtmlComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
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
