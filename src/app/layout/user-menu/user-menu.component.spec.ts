import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UserMenuComponent } from './user-menu.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { SignInService } from '../../core/sign-in/sign-in.service'
import { MatMenuModule } from '@angular/material/menu'

describe('UserMenuComponent', () => {
  let component: UserMenuComponent
  let fixture: ComponentFixture<UserMenuComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatMenuModule,
        RouterTestingModule
      ],
      declarations: [UserMenuComponent],
      providers: [
        WINDOW_PROVIDERS,
        SignInService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMenuComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
