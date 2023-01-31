import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PanelSourceComponent } from './panel-source.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../window'
import { PlatformInfoService } from '../../platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { VerificationEmailModalService } from '../../../core/verification-email-modal/verification-email-modal.service'

describe('PanelSourceComponent', () => {
  let component: PanelSourceComponent
  let fixture: ComponentFixture<PanelSourceComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      declarations: [PanelSourceComponent],
      providers: [
        WINDOW_PROVIDERS,
        VerificationEmailModalService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelSourceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
