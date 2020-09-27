import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { NotificationPermissionComponent } from './notification-permission.component'

describe('NotificationPermissionComponent', () => {
  let component: NotificationPermissionComponent
  let fixture: ComponentFixture<NotificationPermissionComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationPermissionComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationPermissionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
