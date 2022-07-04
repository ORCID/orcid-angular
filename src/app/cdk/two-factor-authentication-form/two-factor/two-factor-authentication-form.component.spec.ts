import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TwoFactorAuthenticationFormComponent } from './two-factor-authentication-form.component'
import { WINDOW_PROVIDERS } from '../../window'

describe('TwoFactorAuthenticationFormComponent', () => {
  let component: TwoFactorAuthenticationFormComponent
  let fixture: ComponentFixture<TwoFactorAuthenticationFormComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TwoFactorAuthenticationFormComponent],
      providers: [WINDOW_PROVIDERS],
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
