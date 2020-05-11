import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FormVisibilityComponent } from './form-visibility.component'

describe('FormVisibilityComponent', () => {
  let component: FormVisibilityComponent
  let fixture: ComponentFixture<FormVisibilityComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormVisibilityComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormVisibilityComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
