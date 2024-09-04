import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotificationPermissionInstitutionalConnectionComponent } from './notification-permission-institutional-connection.component'
import { WINDOW_PROVIDERS } from '../../../cdk/window'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('NotificationPermissionINSTITUTIONALCONNECTIONComponent', () => {
  let component: NotificationPermissionInstitutionalConnectionComponent
  let fixture: ComponentFixture<NotificationPermissionInstitutionalConnectionComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationPermissionInstitutionalConnectionComponent],
      providers: [WINDOW_PROVIDERS],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(
      NotificationPermissionInstitutionalConnectionComponent
    )
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
