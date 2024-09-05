import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResearchResourceComponent } from './research-resource.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { Overlay } from '@angular/cdk/overlay'
import { SharedModule } from 'src/app/shared/shared.module'
import { ResearchResource } from 'src/app/types/record-research-resources.endpoint'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ResearchResourceComponent', () => {
  let component: ResearchResourceComponent
  let fixture: ComponentFixture<ResearchResourceComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, SharedModule],
      declarations: [ResearchResourceComponent],
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
    fixture = TestBed.createComponent(ResearchResourceComponent)
    component = fixture.componentInstance
    component.researchResource = { title: 'mock' } as ResearchResource

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
