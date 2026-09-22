import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TopBarComponent } from './top-bar.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('TopBarComponent', () => {
  let component: TopBarComponent
  let fixture: ComponentFixture<TopBarComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      declarations: [TopBarComponent],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  /*
   * PD-6043. The frame links two words and the notice linked the whole closing
   * sentence. Measured off the export: the underline is a continuous 111 px
   * run, which is "account settings" and no more. `get_metadata` cannot answer
   * this - a design tool styles a link as a range inside one text node - so the
   * assertion pins the shape the pixels showed.
   */
  it('links only the account settings words in the 2FA disabled notice', () => {
    component.twoFactorDisabledByRecoveryPhone = true
    fixture.detectChanges()

    const notice: HTMLElement = fixture.nativeElement.querySelector(
      'app-warning-message'
    )
    const link: HTMLAnchorElement = notice.querySelector('a[fragment="2FA"]')

    expect(link).toBeTruthy()
    expect(link.textContent.trim()).toBe('account settings')
    expect(notice.textContent.replace(/\s+/g, ' ')).toContain(
      'You can re-enable 2FA from your account settings'
    )
  })
})
