import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SignInComponent } from './sign-in.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { RegisterService } from '../../../core/register/register.service'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { UserService } from '../../../core'
import { AppModule } from 'src/app/app.module'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { Router } from '@angular/router'
import { OauthURLSessionManagerService } from '../../../core/oauth-urlsession-manager/oauth-urlsession-manager.service'

describe('SignInComponent', () => {
  let component: SignInComponent
  let fixture: ComponentFixture<SignInComponent>
  let oauthUrlSessionManager: jasmine.SpyObj<OauthURLSessionManagerService>

  beforeEach(() => {
    // The real collaborator is providedIn root and reads window.localStorage,
    // so unstubbed these specs would pass or fail on whatever another spec
    // happened to leave in browser storage.
    oauthUrlSessionManager =
      jasmine.createSpyObj<OauthURLSessionManagerService>(
        'OauthURLSessionManagerService',
        ['get', 'clear']
      )
    oauthUrlSessionManager.get.and.returnValue(null)

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [SignInComponent],
      providers: [
        WINDOW_PROVIDERS,
        UserService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
        {
          provide: OauthURLSessionManagerService,
          useValue: oauthUrlSessionManager,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('after a sign-in with the recovery phone number', () => {
    it('puts the panel in place of the sign-in card (R4.2)', () => {
      component.onTwoFactorDisabledByRecoveryPhone({
        url: 'https://qa.orcid.org/oauth/authorize',
      })
      fixture.detectChanges()

      expect(component.twoFactorDisabledByRecoveryPhone).toBeTrue()
      expect(component.twoFactorDisabledRedirectUrl).toBe(
        'https://qa.orcid.org/oauth/authorize'
      )
      expect(
        fixture.nativeElement.querySelector('app-two-factor-disabled')
      ).not.toBeNull()
      expect(fixture.nativeElement.querySelector('app-form-sign-in')).toBeNull()
    })

    it('continues to the stored oauth url once, and only once', () => {
      const navigateToSpy = spyOn(component, 'navigateTo')
      component.isOauthAuthorizationTogglzEnable = true
      // Nothing stored, so the url the sign-in answered with is the one used
      oauthUrlSessionManager.get.and.returnValue(null)
      component.onTwoFactorDisabledByRecoveryPhone({
        url: 'https://qa.orcid.org/oauth/authorize?client_id=APP-1',
      })

      component.continueAfterTwoFactorDisabled()
      component.continueAfterTwoFactorDisabled()

      expect(navigateToSpy).toHaveBeenCalledTimes(1)
      expect(navigateToSpy).toHaveBeenCalledWith(
        'https://qa.orcid.org/oauth/authorize?client_id=APP-1'
      )
    })

    it('prefers the url the oauth session manager is holding', () => {
      const navigateToSpy = spyOn(component, 'navigateTo')
      component.isOauthAuthorizationTogglzEnable = true
      oauthUrlSessionManager.get.and.returnValue(
        'https://qa.orcid.org/oauth/authorize?client_id=STORED'
      )
      component.onTwoFactorDisabledByRecoveryPhone({
        url: 'https://qa.orcid.org/oauth/authorize?client_id=APP-1',
      })

      component.continueAfterTwoFactorDisabled()

      expect(oauthUrlSessionManager.clear).toHaveBeenCalledTimes(1)
      expect(navigateToSpy).toHaveBeenCalledWith(
        'https://qa.orcid.org/oauth/authorize?client_id=STORED'
      )
    })

    it('takes the legacy flow to the authorization page', () => {
      const router = TestBed.inject(Router)
      const navigateSpy = spyOn(router, 'navigate').and.returnValue(
        Promise.resolve(true)
      )
      component.isOauthAuthorizationTogglzEnable = false
      component.onTwoFactorDisabledByRecoveryPhone({
        url: 'https://qa.orcid.org/oauth/authorize',
      })

      component.continueAfterTwoFactorDisabled()

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy.calls.mostRecent().args[0]).toEqual([
        '/oauth/authorize',
      ])
    })
  })
})
