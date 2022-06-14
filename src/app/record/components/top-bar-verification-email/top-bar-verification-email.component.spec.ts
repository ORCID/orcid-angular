import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TopBarVerificationEmailComponent } from './top-bar-verification-email.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { RecordService } from '../../../core/record/record.service'
import { RecordEmailsService } from '../../../core/record-emails/record-emails.service'

describe('TopBarVerificationEmailComponent', () => {
  let component: TopBarVerificationEmailComponent
  let fixture: ComponentFixture<TopBarVerificationEmailComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        RouterTestingModule
      ],
      declarations: [TopBarVerificationEmailComponent],
      providers: [
        WINDOW_PROVIDERS,
        RecordService,
        RecordEmailsService,
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
    fixture = TestBed.createComponent(TopBarVerificationEmailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
