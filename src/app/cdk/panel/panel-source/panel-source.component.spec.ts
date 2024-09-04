import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PanelSourceComponent } from './panel-source.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../window'
import { PlatformInfoService } from '../../platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogModule as MatDialogModule,
} from '@angular/material/legacy-dialog'
import { Overlay } from '@angular/cdk/overlay'
import { VerificationEmailModalService } from '../../../core/verification-email-modal/verification-email-modal.service'
import { AppPanelActivityActionAriaLabelPipe } from '../../../shared/pipes/app-panel-activity-action-aria-label/app-panel-activity-action-aria-label.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('PanelSourceComponent', () => {
  let component: PanelSourceComponent
  let fixture: ComponentFixture<PanelSourceComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      declarations: [PanelSourceComponent],
      providers: [
        AppPanelActivityActionAriaLabelPipe,
        WINDOW_PROVIDERS,
        VerificationEmailModalService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
