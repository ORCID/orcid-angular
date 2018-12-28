import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfilePublicPageComponent } from './profile-public-page.component'

describe('ProfilePublicPageComponent', () => {
  let component: ProfilePublicPageComponent
  let fixture: ComponentFixture<ProfilePublicPageComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilePublicPageComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePublicPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
