import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResearchResourceComponent } from './research-resource.component'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { OrganizationsService } from '../../../core'
import { RecordResearchResourceService } from '../../../core/record-research-resource/record-research-resource.service'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'

describe('ResearchResourceComponent', () => {
  let component: ResearchResourceComponent
  let fixture: ComponentFixture<ResearchResourceComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResearchResourceComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService,
        OrganizationsService,
        RecordResearchResourceService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        Overlay,
      ],
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
