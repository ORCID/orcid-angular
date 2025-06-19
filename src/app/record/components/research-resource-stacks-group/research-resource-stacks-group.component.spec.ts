import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResearchResourceStacksGroupComponent } from './research-resource-stacks-group.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { RegisterService } from '../../../core/register/register.service'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { OrganizationsService, UserService } from '../../../core'
import { RecordService } from '../../../core/record/record.service'
import { RecordResearchResourceService } from '../../../core/record-research-resource/record-research-resource.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ResearchResourcesComponent', () => {
  let component: ResearchResourceStacksGroupComponent
  let fixture: ComponentFixture<ResearchResourceStacksGroupComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ResearchResourceStacksGroupComponent],
      providers: [
        WINDOW_PROVIDERS,
        OrganizationsService,
        RecordResearchResourceService,
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
    fixture = TestBed.createComponent(ResearchResourceStacksGroupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
