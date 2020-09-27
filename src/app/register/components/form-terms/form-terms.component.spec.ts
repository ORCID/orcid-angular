import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FormTermsComponent } from './form-terms.component'

describe('FormTermsComponent', () => {
  let component: FormTermsComponent
  let fixture: ComponentFixture<FormTermsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormTermsComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTermsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
