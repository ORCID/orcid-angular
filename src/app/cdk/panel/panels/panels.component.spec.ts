import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PanelsComponent } from './panels.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../window'
import { RegisterService } from '../../../core/register/register.service'
import { PlatformInfoService } from '../../platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatMenuModule } from '@angular/material/menu'
import { SharedModule } from '../../../shared/shared.module'
import { SortLabelPipe } from '../sort-label.pipe'
import { PanelModule } from '../panel.module'

describe('PanelsComponent', () => {
  let component: PanelsComponent
  let fixture: ComponentFixture<PanelsComponent>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          MatDialogModule,
          MatMenuModule,
          RouterTestingModule,
          SharedModule,
          PanelModule,
        ],
        declarations: [PanelsComponent],
        providers: [
          WINDOW_PROVIDERS,
          RegisterService,
          PlatformInfoService,
          ErrorHandlerService,
          SnackbarService,
          MatSnackBar,
          MatDialog,
          Overlay
        ]
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
