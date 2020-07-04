import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { NotificationPermissionINSTITUTIONALCONNECTIONComponent } from './notification-permission-institutional-connection.component'

describe('NotificationPermissionINSTITUTIONALCONNECTIONComponent', () => {
  let component: NotificationPermissionINSTITUTIONALCONNECTIONComponent
  let fixture: ComponentFixture<NotificationPermissionINSTITUTIONALCONNECTIONComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationPermissionINSTITUTIONALCONNECTIONComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(
      NotificationPermissionINSTITUTIONALCONNECTIONComponent
    )
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
