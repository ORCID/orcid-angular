import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TwoFactorInputComponent } from './two-factor-input.component'

describe('TwoFactorInputComponent', () => {
  let component: TwoFactorInputComponent
  let fixture: ComponentFixture<TwoFactorInputComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoFactorInputComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TwoFactorInputComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
