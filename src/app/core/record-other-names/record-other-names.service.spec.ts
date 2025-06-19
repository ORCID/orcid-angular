import { TestBed } from '@angular/core/testing'

import { RecordOtherNamesService } from './record-other-names.service'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { OtherNamesEndPoint } from '../../types/record-other-names.endpoint'
import { Assertion } from '../../types'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RecordOtherNamesService', () => {
  let service: RecordOtherNamesService

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
    service = TestBed.inject(RecordOtherNamesService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

export function getOtherNamesEndPoint(): OtherNamesEndPoint {
  return {
    otherNames: [
      {
        content: 'Published Name',
        putCode: '1',
        visibility: { visibility: 'PUBLIC' },
      } as Assertion,
    ],
    visibility: { visibility: 'PUBLIC' },
  } as OtherNamesEndPoint
}
