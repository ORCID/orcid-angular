import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileRecordsCardDetailComponent } from './profile-records-card-detail.component'

describe('ProfileRecordsCardDetailComponent', () => {
  let component: ProfileRecordsCardDetailComponent
  let fixture: ComponentFixture<ProfileRecordsCardDetailComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileRecordsCardDetailComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRecordsCardDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
