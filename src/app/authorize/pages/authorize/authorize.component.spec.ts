import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AuthorizeComponent } from './authorize.component'

describe('AuthorizeComponent', () => {
  let component: AuthorizeComponent
  let fixture: ComponentFixture<AuthorizeComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorizeComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
