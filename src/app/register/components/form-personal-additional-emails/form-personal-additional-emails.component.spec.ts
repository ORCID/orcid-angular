import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormPersonalAdditionalEmailsComponent } from './form-personal-additional-emails.component'
import { MdePopoverModule } from '../../../cdk/popover'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('FormPersonalAdditionalEmailsComponent', () => {
  let component: FormPersonalAdditionalEmailsComponent
  let fixture: ComponentFixture<FormPersonalAdditionalEmailsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MdePopoverModule],
      declarations: [FormPersonalAdditionalEmailsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPersonalAdditionalEmailsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
