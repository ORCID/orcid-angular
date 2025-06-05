import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsTrustedIndividualsSearchComponent } from './settings-trusted-individuals-search.component'
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
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { SearchService } from '../../../core/search/search.service'
import { AccountTrustedIndividualsService } from '../../../core/account-trusted-individuals/account-trusted-individuals.service'
import { UserService } from '../../../core'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'

describe('SettingsTrustedIndividualsSearchComponent', () => {
  let component: SettingsTrustedIndividualsSearchComponent
  let fixture: ComponentFixture<SettingsTrustedIndividualsSearchComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        RouterTestingModule,
        FormsModule,
      ],
      declarations: [SettingsTrustedIndividualsSearchComponent],
      providers: [
        WINDOW_PROVIDERS,
        AccountTrustedIndividualsService,
        SearchService,
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
    fixture = TestBed.createComponent(SettingsTrustedIndividualsSearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
