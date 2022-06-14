import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MyOrcidComponent } from './my-orcid.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { FormBuilder } from '@angular/forms'
import { RecordWorksService } from '../../../core/record-works/record-works.service'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { UserInfoService } from '../../../core/user-info/user-info.service'

describe('MyOrcidComponent', () => {
  let component: MyOrcidComponent
  let fixture: ComponentFixture<MyOrcidComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [MyOrcidComponent],
      providers: [
        WINDOW_PROVIDERS,
        UserInfoService,
        RecordWorksService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrcidComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
