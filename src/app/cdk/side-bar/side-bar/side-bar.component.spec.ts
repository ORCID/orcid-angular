import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SideBarComponent } from './side-bar.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../window'
import { RegisterService } from '../../../core/register/register.service'
import { PlatformInfoService } from '../../platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RecordService } from '../../../core/record/record.service'
import { UserService } from '../../../core'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SideBarComponent', () => {
  let component: SideBarComponent
  let fixture: ComponentFixture<SideBarComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [SideBarComponent],
      providers: [
        WINDOW_PROVIDERS,
        RecordService,
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
    fixture = TestBed.createComponent(SideBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
