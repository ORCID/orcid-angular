import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { FormAuthorizeComponent } from './form-authorize.component'

describe('FormAuthorizeComponent', () => {
  let component: FormAuthorizeComponent
  let fixture: ComponentFixture<FormAuthorizeComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormAuthorizeComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAuthorizeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
