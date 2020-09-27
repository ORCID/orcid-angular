import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MaintenanceMessageComponent } from './maintenance-message.component'

describe('MaintenanceMessageComponent', () => {
  let component: MaintenanceMessageComponent
  let fixture: ComponentFixture<MaintenanceMessageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceMessageComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceMessageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
