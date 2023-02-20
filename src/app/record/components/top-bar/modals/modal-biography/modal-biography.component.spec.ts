import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ModalBiographyComponent } from './modal-biography.component'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../../../cdk/window'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { SnackbarService } from '../../../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { RecordBiographyService } from '../../../../../core/record-biography/record-biography.service'
import { SharedModule } from '../../../../../shared/shared.module'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RecordModule } from '../../../../record.module'

describe('ModalBiographyComponent', () => {
  let component: ModalBiographyComponent
  let fixture: ComponentFixture<ModalBiographyComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        SharedModule,
        ReactiveFormsModule,
        RecordModule,
        RouterTestingModule,
      ],
      declarations: [ModalBiographyComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        WINDOW_PROVIDERS,
        PlatformInfoService,
        RecordBiographyService,
        SnackbarService,
        MatSnackBar,
        Overlay,
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBiographyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
