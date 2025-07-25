import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ModalKeywordComponent } from './modal-keyword.component'
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
import { RecordKeywordService } from '../../../../core/record-keyword/record-keyword.service'
import { UserService } from '../../../../core'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms'

describe('ModalKeywordComponent', () => {
  let component: ModalKeywordComponent
  let fixture: ComponentFixture<ModalKeywordComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [ModalKeywordComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        WINDOW_PROVIDERS,
        RecordKeywordService,
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
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalKeywordComponent)
    component = fixture.componentInstance
    component.keywordsForm = new UntypedFormGroup({})
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
