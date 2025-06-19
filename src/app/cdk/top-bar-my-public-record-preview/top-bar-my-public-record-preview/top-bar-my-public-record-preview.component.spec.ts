import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TopBarMyPublicRecordPreviewComponent } from './top-bar-my-public-record-preview.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../window'
import { PlatformInfoService } from '../../platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { TrustedIndividualsService } from '../../../core/trusted-individuals/trusted-individuals.service'
import { UserService } from '../../../core'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

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
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
