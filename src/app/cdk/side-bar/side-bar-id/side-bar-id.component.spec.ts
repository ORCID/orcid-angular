import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SideBarIdComponent } from './side-bar-id.component'
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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SideBarIdComponent', () => {
  let component: SideBarIdComponent
  let fixture: ComponentFixture<SideBarIdComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [SideBarIdComponent],
      providers: [
        WINDOW_PROVIDERS,
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
    fixture = TestBed.createComponent(SideBarIdComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
