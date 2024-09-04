import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotificationHtmlComponent } from './notification-html.component'
import { SharedModule } from '../../../shared/shared.module'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('NotificationHtmlComponent', () => {
  let component: NotificationHtmlComponent
  let fixture: ComponentFixture<NotificationHtmlComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [NotificationHtmlComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
