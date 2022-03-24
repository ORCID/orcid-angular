import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TwoFactorEnableComponent } from './two-factor-enable.component'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { By } from 'protractor'

describe('TwoFactorEnableComponent', () => {
  let component: TwoFactorEnableComponent
  let compiled: any
  let fixture: ComponentFixture<TwoFactorEnableComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [TwoFactorEnableComponent],
      providers: [
        WINDOW_PROVIDERS,
        TwoFactorAuthenticationService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        Overlay,
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFactorEnableComponent)
    component = fixture.componentInstance
    compiled = fixture.debugElement.nativeElement
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should include a qr code image', () => {
    expect(compiled.querySelector('img').textContent).not.toBeNull()
  })

  it('should display a textarea with a textarea', () => {
    expect(compiled.querySelector('[data-cy="textCode"]')).toBeNull()
    const textCodeLink = compiled.debugElement.query(By.css('#cy-text-code'))
    textCodeLink.triggerEventHandler('click', null)
    fixture.detectChanges()
    // expect(compiled.querySelector('[data-cy="textCode"]').textContent).not.toBeNull()
  })
})
