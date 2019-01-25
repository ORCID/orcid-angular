import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileRecordsStackComponent } from './profile-records-stack.component'

describe('ProfileRecordsStackComponent', () => {
  let component: ProfileRecordsStackComponent
  let fixture: ComponentFixture<ProfileRecordsStackComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileRecordsStackComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRecordsStackComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
