import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TwoFactorAuthenticationFormComponent } from './two-factor.component'

describe('TwoFactorComponent', () => {
  let component: TwoFactorAuthenticationFormComponent
  let fixture: ComponentFixture<TwoFactorAuthenticationFormComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TwoFactorAuthenticationFormComponent],
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
