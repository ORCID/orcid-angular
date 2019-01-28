import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileRecordsCardComponent } from './profile-records-card.component'

describe('ProfileRecordsCardComponent', () => {
  let component: ProfileRecordsCardComponent
  let fixture: ComponentFixture<ProfileRecordsCardComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileRecordsCardComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRecordsCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
