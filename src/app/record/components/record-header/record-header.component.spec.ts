import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RecordHeaderComponent } from './record-header.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RouterTestingModule } from '@angular/router/testing'
import { RecordService } from 'src/app/core/record/record.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { MatTooltipModule } from '@angular/material/tooltip'

describe('RecordHeaderComponent', () => {
  let component: RecordHeaderComponent
  let fixture: ComponentFixture<RecordHeaderComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MatTooltipModule],
      declarations: [RecordHeaderComponent],
      providers: [
        WINDOW_PROVIDERS,
        RecordService,
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
    fixture = TestBed.createComponent(RecordHeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
