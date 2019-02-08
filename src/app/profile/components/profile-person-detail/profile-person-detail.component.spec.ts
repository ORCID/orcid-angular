import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileInfoDetailComponent } from './profile-person-detail.component'

describe('ProfileInfoDetailComponent', () => {
  let component: ProfileInfoDetailComponent
  let fixture: ComponentFixture<ProfileInfoDetailComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileInfoDetailComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileInfoDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
