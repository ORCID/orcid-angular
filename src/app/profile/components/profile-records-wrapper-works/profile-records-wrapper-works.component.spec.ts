import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileRecordsWrapperWorksComponent } from './profile-records-wrapper-works.component'

describe('ProfileRecordsWrapperWorksComponent', () => {
  let component: ProfileRecordsWrapperWorksComponent
  let fixture: ComponentFixture<ProfileRecordsWrapperWorksComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileRecordsWrapperWorksComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRecordsWrapperWorksComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
