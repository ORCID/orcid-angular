import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsUsersThatThrustYouComponent } from './settings-users-that-thrust-you.component'

describe('SettingsUsersThatThrustYouComponent', () => {
  let component: SettingsUsersThatThrustYouComponent
  let fixture: ComponentFixture<SettingsUsersThatThrustYouComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsUsersThatThrustYouComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsUsersThatThrustYouComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
