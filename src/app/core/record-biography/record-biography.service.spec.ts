import { TestBed } from '@angular/core/testing'

import { RecordBiographyService } from './record-biography.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { BiographyEndPoint } from '../../types/record-biography.endpoint'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RecordBiographyService', () => {
  let service: RecordBiographyService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    })
    service = TestBed.inject(RecordBiographyService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

export function getBiographyEndPoint() {
  return {
    biography: { value: 'My Biography' },
    visibility: { visibility: 'PUBLIC' },
  } as BiographyEndPoint
}
