import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfilePrivatePageComponent } from './profile-private-page.component'

describe('ProfilePrivatePageComponent', () => {
  let component: ProfilePrivatePageComponent
  let fixture: ComponentFixture<ProfilePrivatePageComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilePrivatePageComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePrivatePageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
