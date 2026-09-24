import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SocialComponent } from './social.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { SignInService } from '../../../core/sign-in/sign-in.service'
import { OauthService } from '../../../core/oauth/oauth.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SocialComponent', () => {
  let component: SocialComponent
  let fixture: ComponentFixture<SocialComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [SocialComponent],
      providers: [
        WINDOW_PROVIDERS,
        SignInService,
        OauthService,
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
    fixture = TestBed.createComponent(SocialComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  /*
   * PD-5635. The sign-in frames draw this button as the only outlined control
   * on the page: a 1 px rectangle in ui-background #bdbdbd, x 64..515 by
   * y 948..987 in pd-6042-01, -08 and -09, the same grey the form fields and
   * the card take. It used to inherit a blanket `border: solid 1px` that
   * `_button-theme.scss` put on every unthemed raised button in the
   * application, coloured with Material's stock divider rgba(0, 0, 0, 0.12).
   * That blanket rule is gone - the frames draw no border at all on the filled
   * buttons it also reached - so the one button that does have an outline now
   * declares it, in the token the frames bind for it.
   */
  it('outlines the institutional button in ui-background', () => {
    const button = fixture.nativeElement.querySelector(
      '#access-through-your-institution-button'
    ) as HTMLElement
    const style = getComputedStyle(button)

    expect(style.borderTopWidth).toBe('1px')
    expect(style.borderTopColor).toBe('rgb(189, 189, 189)')
    expect(style.borderBottomColor).toBe('rgb(189, 189, 189)')
    expect(style.borderLeftColor).toBe('rgb(189, 189, 189)')
    expect(style.borderRightColor).toBe('rgb(189, 189, 189)')
  })
})
