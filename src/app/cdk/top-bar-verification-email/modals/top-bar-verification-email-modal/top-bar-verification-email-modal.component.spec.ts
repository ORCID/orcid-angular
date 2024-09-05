import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TopBarVerificationEmailModalComponent } from './top-bar-verification-email-modal.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog'

import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('TopBarVerificationEmailModalComponent', () => {
  let component: TopBarVerificationEmailModalComponent
  let fixture: ComponentFixture<TopBarVerificationEmailModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [TopBarVerificationEmailModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        WINDOW_PROVIDERS,
        RecordEmailsService,
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
    fixture = TestBed.createComponent(TopBarVerificationEmailModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
