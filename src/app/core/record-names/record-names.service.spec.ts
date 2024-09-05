import { TestBed } from '@angular/core/testing'

import { RecordNamesService } from './record-names.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { Overlay } from '@angular/cdk/overlay'
import { NamesEndPoint } from '../../types/record-name.endpoint'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RecordNamesService', () => {
  let service: RecordNamesService

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
    service = TestBed.inject(RecordNamesService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

export function getNamesEndPoint(): NamesEndPoint {
  return {
    givenNames: { value: 'Name' },
    familyName: { value: 'Surname' },
    creditName: { value: 'Published Name' },
    visibility: { visibility: 'PUBLIC' },
  } as NamesEndPoint
}
