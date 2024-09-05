import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TwoFactorAuthenticationFormComponent } from './two-factor-authentication-form.component'
import { WINDOW_PROVIDERS } from '../../window'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'

describe('TwoFactorAuthenticationFormComponent', () => {
  let component: TwoFactorAuthenticationFormComponent
  let fixture: ComponentFixture<TwoFactorAuthenticationFormComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TwoFactorAuthenticationFormComponent],
      providers: [WINDOW_PROVIDERS],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFactorAuthenticationFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
