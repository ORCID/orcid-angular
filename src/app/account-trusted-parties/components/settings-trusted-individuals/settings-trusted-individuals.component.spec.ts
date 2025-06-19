import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsTrustedIndividualsComponent } from './settings-trusted-individuals.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { AccountTrustedIndividualsService } from '../../../core/account-trusted-individuals/account-trusted-individuals.service'

import { DialogRevokeTrustedIndividualsComponent } from '../dialog-revoke-trusted-individuals/dialog-revoke-trusted-individuals.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SettingsTrustedIndividualsComponent', () => {
  let component: SettingsTrustedIndividualsComponent
  let fixture: ComponentFixture<SettingsTrustedIndividualsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      declarations: [SettingsTrustedIndividualsComponent],
      providers: [
        WINDOW_PROVIDERS,
        AccountTrustedIndividualsService,
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
    fixture = TestBed.createComponent(SettingsTrustedIndividualsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
