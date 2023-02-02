import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ModalWebsitesComponent } from './modal-websites.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../window'
import { PlatformInfoService } from '../../../platform-info'
import { ErrorHandlerService } from '../../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { UserService } from '../../../../core'
import { RecordWebsitesService } from '../../../../core/record-websites/record-websites.service'

describe('ModalWebsitesComponent', () => {
  let component: ModalWebsitesComponent
  let fixture: ComponentFixture<ModalWebsitesComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ModalWebsitesComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        WINDOW_PROVIDERS,
        UserService,
        RecordWebsitesService,
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
    fixture = TestBed.createComponent(ModalWebsitesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
