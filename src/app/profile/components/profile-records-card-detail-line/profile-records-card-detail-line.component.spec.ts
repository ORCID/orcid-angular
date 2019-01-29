import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileRecordsCardDetailLineComponent } from './profile-records-card-detail-line.component'

describe('ProfileRecordsCardDetailLineComponent', () => {
  let component: ProfileRecordsCardDetailLineComponent
  let fixture: ComponentFixture<ProfileRecordsCardDetailLineComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileRecordsCardDetailLineComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRecordsCardDetailLineComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
