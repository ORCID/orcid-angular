import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileInfoComponent } from './profile-person.component'

describe('ProfileInfoComponent', () => {
  let component: ProfileInfoComponent
  let fixture: ComponentFixture<ProfileInfoComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileInfoComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileInfoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
