import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileRecordsWrapperAffiliationsComponent } from './profile-records-wrapper-affiliations.component'

describe('ProfileRecordsWrapperAffiliationsComponent', () => {
  let component: ProfileRecordsWrapperAffiliationsComponent
  let fixture: ComponentFixture<ProfileRecordsWrapperAffiliationsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileRecordsWrapperAffiliationsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ProfileRecordsWrapperAffiliationsComponent
    )
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
