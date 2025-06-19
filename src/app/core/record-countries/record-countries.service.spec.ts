import { TestBed } from '@angular/core/testing'

import { RecordCountriesService } from './record-countries.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RecordCountriesService', () => {
  let service: RecordCountriesService

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
    service = TestBed.inject(RecordCountriesService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

export const getCountries = (): { key: string; value: string }[] => {
  return [
    { key: 'Albania', value: 'AL' },
    { key: 'Mexico', value: 'MX' },
    { key: 'South Africa', value: 'ZA' },
  ]
}
