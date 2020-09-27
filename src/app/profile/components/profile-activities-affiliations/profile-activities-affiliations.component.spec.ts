import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileActivitiesAffiliationsComponent } from './profile-activities-affiliations.component'

describe('ProfileActivitiesAffiliationsComponent', () => {
  let component: ProfileActivitiesAffiliationsComponent
  let fixture: ComponentFixture<ProfileActivitiesAffiliationsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileActivitiesAffiliationsComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileActivitiesAffiliationsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
