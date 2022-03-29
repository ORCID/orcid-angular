import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BannersComponent } from './banners.component'
import { PlatformInfoService } from '../../cdk/platform-info'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { CookieService } from 'ngx-cookie-service'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TogglzService } from '../../core/togglz/togglz.service'
import { ErrorHandlerService } from '../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { UserService } from '../../core'

describe('BannersComponent', () => {
  let component: BannersComponent
  let fixture: ComponentFixture<BannersComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [BannersComponent],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService,
        CookieService,
        TogglzService,
        UserService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        Overlay
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BannersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
