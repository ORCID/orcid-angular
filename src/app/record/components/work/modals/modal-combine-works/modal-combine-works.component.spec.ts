import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalCombineWorksComponent } from './modal-combine-works.component'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MatDialogRef } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../../../cdk/window'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { RecordAffiliationService } from '../../../../../core/record-affiliations/record-affiliations.service'
import { RecordFundingsService } from '../../../../../core/record-fundings/record-fundings.service'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { RecordResearchResourceService } from '../../../../../core/record-research-resource/record-research-resource.service'
import { RecordPeerReviewService } from '../../../../../core/record-peer-review/record-peer-review.service'
import { SnackbarService } from '../../../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'

describe('ModalCombineWorksComponent', () => {
  let component: ModalCombineWorksComponent
  let fixture: ComponentFixture<ModalCombineWorksComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ModalCombineWorksComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        WINDOW_PROVIDERS,
        PlatformInfoService,
        RecordWorksService,
        SnackbarService,
        MatSnackBar,
        Overlay,
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCombineWorksComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
