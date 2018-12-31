import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileGeneralDataDetailComponent } from './profile-general-data-detail.component'

describe('ProfileGeneralDataDetailComponent', () => {
  let component: ProfileGeneralDataDetailComponent
  let fixture: ComponentFixture<ProfileGeneralDataDetailComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileGeneralDataDetailComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileGeneralDataDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
