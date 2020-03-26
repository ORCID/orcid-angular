import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FormAdditionalEmailsComponent } from './form-additional-emails.component'

describe('FormAdditionalEmailsComponent', () => {
  let component: FormAdditionalEmailsComponent
  let fixture: ComponentFixture<FormAdditionalEmailsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormAdditionalEmailsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAdditionalEmailsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
