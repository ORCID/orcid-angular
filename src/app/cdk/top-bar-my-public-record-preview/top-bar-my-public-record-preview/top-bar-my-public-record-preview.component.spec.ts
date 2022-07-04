import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TopBarMyPublicRecordPreviewComponent } from './top-bar-my-public-record-preview.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../window'
import { PlatformInfoService } from '../../platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { TrustedIndividualsService } from '../../../core/trusted-individuals/trusted-individuals.service'
import { UserService } from '../../../core'

describe('TopBarMyPublicRecordPreviewComponent', () => {
  let component: TopBarMyPublicRecordPreviewComponent
  let fixture: ComponentFixture<TopBarMyPublicRecordPreviewComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [TopBarMyPublicRecordPreviewComponent],
      providers: [
        WINDOW_PROVIDERS,
        TrustedIndividualsService,
        UserService,
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
    fixture = TestBed.createComponent(TopBarMyPublicRecordPreviewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
