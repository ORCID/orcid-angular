import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { NotificationPermissionInstitutionalConnectionComponent } from './notification-permission-institutional-connection.component'

describe('NotificationPermissionINSTITUTIONALCONNECTIONComponent', () => {
  let component: NotificationPermissionInstitutionalConnectionComponent
  let fixture: ComponentFixture<NotificationPermissionInstitutionalConnectionComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationPermissionInstitutionalConnectionComponent],
    }).compileComponents()
  }))

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
