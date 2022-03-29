import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TopBarComponent } from './top-bar.component'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { UserService } from '../../../core'
import { RecordService } from '../../../core/record/record.service'
import { RecordEmailsService } from '../../../core/record-emails/record-emails.service'
import { VerificationEmailModalService } from '../../../core/verification-email-modal/verification-email-modal.service'
import { Overlay } from '@angular/cdk/overlay'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'

describe('TopBarComponent', () => {
  let component: TopBarComponent
  let fixture: ComponentFixture<TopBarComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule
      ],
      declarations: [TopBarComponent],
      providers: [
        WINDOW_PROVIDERS,
        MatDialog,
        PlatformInfoService,
        UserService,
        RecordService,
        RecordEmailsService,
        VerificationEmailModalService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        Overlay
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
