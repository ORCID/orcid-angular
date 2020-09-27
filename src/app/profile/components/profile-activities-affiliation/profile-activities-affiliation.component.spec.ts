import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileRecordsAffiliationComponent } from './profile-activities-affiliation.component'

describe('ProfileRecordsAffiliationComponent', () => {
  let component: ProfileRecordsAffiliationComponent
  let fixture: ComponentFixture<ProfileRecordsAffiliationComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileRecordsAffiliationComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRecordsAffiliationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
