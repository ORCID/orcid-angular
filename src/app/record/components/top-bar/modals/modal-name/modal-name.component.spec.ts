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
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RecordModule } from '../../../../record.module'
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms'
import { of } from 'rxjs'
import { getNamesEndPoint } from '../../../../../core/record-names/record-names.service.spec'
import { getOtherNamesEndPoint } from '../../../../../core/record-other-names/record-other-names.service.spec'
import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { MatButtonHarness } from '@angular/material/button/testing'

describe('ModalNameComponent', () => {
  let component: ModalNameComponent
  let fixture: ComponentFixture<ModalNameComponent>
  let fakeRecordNamesService: RecordNamesService
  let fakeRecordOtherNamesService: RecordOtherNamesService
  let loader: HarnessLoader

  beforeEach(waitForAsync(() => {
    fakeRecordNamesService = jasmine.createSpyObj<RecordNamesService>(
      'RecordNamesService',
      {
        getNames: of(getNamesEndPoint()),
      }
    )

    fakeRecordOtherNamesService = jasmine.createSpyObj<RecordOtherNamesService>(
      'RecordNamesService',
      {
        getOtherNames: of(getOtherNamesEndPoint()),
      }
    )

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
      declarations: [ModalNameComponent],
      providers: [
        { provide: RecordNamesService, useValue: fakeRecordNamesService },
        {
          provide: RecordOtherNamesService,
          useValue: fakeRecordOtherNamesService,
        },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        WINDOW_PROVIDERS,
        UntypedFormBuilder,
        UserService,
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
    fixture = TestBed.createComponent(ModalNameComponent)
    component = fixture.componentInstance
    loader = TestbedHarnessEnvironment.loader(fixture)
    fixture.detectChanges()
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
