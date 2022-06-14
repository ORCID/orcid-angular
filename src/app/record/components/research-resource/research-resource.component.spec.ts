import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResearchResourceComponent } from './research-resource.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'

describe('ResearchResourceComponent', () => {
  let component: ResearchResourceComponent
  let fixture: ComponentFixture<ResearchResourceComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [ResearchResourceComponent],
      providers: [
        WINDOW_PROVIDERS,
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
    fixture = TestBed.createComponent(ResearchResourceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
