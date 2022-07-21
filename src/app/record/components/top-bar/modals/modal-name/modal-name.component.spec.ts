import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ModalNameComponent } from './modal-name.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../../../cdk/window'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { UserService } from '../../../../../core'
import { RecordNamesService } from '../../../../../core/record-names/record-names.service'
import { RecordOtherNamesService } from '../../../../../core/record-other-names/record-other-names.service'
import { SharedModule } from '../../../../../shared/shared.module'

describe('ModalNameComponent', () => {
  let component: ModalNameComponent
  let fixture: ComponentFixture<ModalNameComponent>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, SharedModule, RouterTestingModule],
        declarations: [ModalNameComponent],
        providers: [
          { provide: MatDialogRef, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: {} },
          WINDOW_PROVIDERS,
          UserService,
          RecordNamesService,
          RecordOtherNamesService,
          PlatformInfoService,
          ErrorHandlerService,
          SnackbarService,
          MatSnackBar,
          MatDialog,
          Overlay,
        ],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNameComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
