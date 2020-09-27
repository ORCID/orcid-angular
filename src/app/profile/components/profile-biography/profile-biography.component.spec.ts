import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileBiographyComponent } from './profile-biography.component'

describe('ProfileBiographyComponent', () => {
  let component: ProfileBiographyComponent
  let fixture: ComponentFixture<ProfileBiographyComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileBiographyComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileBiographyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
