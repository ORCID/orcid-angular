import { TestBed } from '@angular/core/testing'

import { RecordAffiliationService } from './record-affiliations.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { FormBuilder } from '@angular/forms'
import { RecordWorksService } from '../record-works/record-works.service'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { RecordAffiliationsGroupingService } from '../record-affiliations-affiliations-grouping/record-affiliations-grouping.service'
import { AffiliationsSortService } from '..'

describe('AffiliationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule
    ],
    providers: [
      WINDOW_PROVIDERS,
      AffiliationsSortService,
      RecordAffiliationsGroupingService,
      PlatformInfoService,
      ErrorHandlerService,
      SnackbarService,
      MatSnackBar,
      MatDialog,
      Overlay
    ]
  }))

  it('should be created', () => {
    const service: RecordAffiliationService = TestBed.get(
      RecordAffiliationService
    )
    expect(service).toBeTruthy()
  })
})
