import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalWorksSearchLinkComponent } from './modal-works-search-link.component'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../../../cdk/window'
import { FormBuilder } from '@angular/forms'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ModalWorksSearchLink.Component.HtmlComponent', () => {
  let component: ModalWorksSearchLinkComponent
  let fixture: ComponentFixture<ModalWorksSearchLinkComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ModalWorksSearchLinkComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        WINDOW_PROVIDERS,
        RecordWorksService,
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
    fixture = TestBed.createComponent(ModalWorksSearchLinkComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
