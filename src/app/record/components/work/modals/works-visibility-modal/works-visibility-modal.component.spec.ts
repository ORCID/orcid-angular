import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorksVisibilityModalComponent } from './works-visibility-modal.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../../../cdk/window'
import { RegisterService } from '../../../../../core/register/register.service'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { SharedModule } from '../../../../../shared/shared.module'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { VisibilitySelectorComponent } from 'src/app/cdk/visibility-selector/visibility-selector/visibility-selector.component'
import { MatLegacyMenuModule } from '@angular/material/legacy-menu'

describe('WorksVisibilityModalComponent', () => {
  let component: WorksVisibilityModalComponent
  let fixture: ComponentFixture<WorksVisibilityModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule,
        ReactiveFormsModule,
        MatLegacyMenuModule,
      ],
      declarations: [
        WorksVisibilityModalComponent,
        VisibilitySelectorComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        WINDOW_PROVIDERS,
        RegisterService,
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
    fixture = TestBed.createComponent(WorksVisibilityModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
