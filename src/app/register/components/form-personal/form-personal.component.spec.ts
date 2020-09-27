import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FormPersonalComponent } from './form-personal.component'

describe('FormPersonalComponent', () => {
  let component: FormPersonalComponent
  let fixture: ComponentFixture<FormPersonalComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormPersonalComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPersonalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
