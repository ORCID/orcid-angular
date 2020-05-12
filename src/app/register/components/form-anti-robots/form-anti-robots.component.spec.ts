import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FormAntiRobotsComponent } from './form-anti-robots.component'

describe('FormAntiRobotsComponent', () => {
  let component: FormAntiRobotsComponent
  let fixture: ComponentFixture<FormAntiRobotsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormAntiRobotsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAntiRobotsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
