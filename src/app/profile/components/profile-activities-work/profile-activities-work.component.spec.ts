import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileActivitiesWorkComponent } from './profile-activities-work.component'

describe('ProfileActivitiesWorkComponent', () => {
  let component: ProfileActivitiesWorkComponent
  let fixture: ComponentFixture<ProfileActivitiesWorkComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileActivitiesWorkComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileActivitiesWorkComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
