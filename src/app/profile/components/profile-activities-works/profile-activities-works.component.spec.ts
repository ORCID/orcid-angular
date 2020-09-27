import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileActivitiesWorksComponent } from './profile-activities-works.component'

describe('ProfileActivitiesWorksComponent', () => {
  let component: ProfileActivitiesWorksComponent
  let fixture: ComponentFixture<ProfileActivitiesWorksComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileActivitiesWorksComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileActivitiesWorksComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
