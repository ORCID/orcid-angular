import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OauthErrorComponent } from './oauth-error.component'

describe('OauthErrorComponent', () => {
  let component: OauthErrorComponent
  let fixture: ComponentFixture<OauthErrorComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OauthErrorComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(OauthErrorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
