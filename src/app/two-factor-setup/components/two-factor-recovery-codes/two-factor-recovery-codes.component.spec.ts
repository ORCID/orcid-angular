import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TwoFactorRecoveryCodesComponent } from './two-factor-recovery-codes.component'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterTestingModule } from '@angular/router/testing'
import { ClipboardModule } from '@angular/cdk/clipboard'

describe('TwoFactorRecoveryCodesComponent', () => {
  let component: TwoFactorRecoveryCodesComponent
  let fixture: ComponentFixture<TwoFactorRecoveryCodesComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTooltipModule,
        ReactiveFormsModule,
        RouterTestingModule,
        ClipboardModule,
      ],
      declarations: [TwoFactorRecoveryCodesComponent],
      providers: [WINDOW_PROVIDERS],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFactorRecoveryCodesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
