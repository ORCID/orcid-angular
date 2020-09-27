import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FormPasswordComponent } from './form-password.component'

describe('FormPasswordComponent', () => {
  let component: FormPasswordComponent
  let fixture: ComponentFixture<FormPasswordComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormPasswordComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPasswordComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
