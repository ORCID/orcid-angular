import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AccountTrustedPartiesComponent } from './account-trusted-parties.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { UserService } from '../../../core'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('AccountTrustedPartiesComponent', () => {
  let component: AccountTrustedPartiesComponent
  let fixture: ComponentFixture<AccountTrustedPartiesComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [AccountTrustedPartiesComponent],
      providers: [
        WINDOW_PROVIDERS,
        UserService,
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
    fixture = TestBed.createComponent(AccountTrustedPartiesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
