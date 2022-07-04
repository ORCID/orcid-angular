import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsTrustedOrganizationsComponent } from './settings-trusted-organizations.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { AccountTrustedOrganizationsService } from '../../../core/account-trusted-organizations/account-trusted-organizations.service'

describe('SettingsTrustedOrganizationsComponent', () => {
  let component: SettingsTrustedOrganizationsComponent
  let fixture: ComponentFixture<SettingsTrustedOrganizationsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      declarations: [SettingsTrustedOrganizationsComponent],
      providers: [
        WINDOW_PROVIDERS,
        AccountTrustedOrganizationsService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsTrustedOrganizationsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
