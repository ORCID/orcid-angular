import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PanelComponent } from './panel.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../window'
import { PlatformInfoService } from '../../platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { UserService } from '../../../core'
import { RecordAffiliationService } from '../../../core/record-affiliations/record-affiliations.service'
import { RecordFundingsService } from '../../../core/record-fundings/record-fundings.service'
import { RecordPeerReviewService } from '../../../core/record-peer-review/record-peer-review.service'
import { RecordResearchResourceService } from '../../../core/record-research-resource/record-research-resource.service'
import { RecordWorksService } from '../../../core/record-works/record-works.service'
import { VerificationEmailModalService } from '../../../core/verification-email-modal/verification-email-modal.service'
import { SharedModule } from '../../../shared/shared.module'
import { MatIconModule } from '@angular/material/icon'
import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { ModalBiographyComponent } from '../../../record/components/top-bar/modals/modal-biography/modal-biography.component'
import { MatMenuModule } from '@angular/material/menu'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { MatDialogHarness } from '@angular/material/dialog/testing'

describe('PanelComponent', () => {
  let component: PanelComponent
  let fixture: ComponentFixture<PanelComponent>
  let loader: HarnessLoader

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        NoopAnimationsModule,
        RouterTestingModule,
        SharedModule,
        MatMenuModule,
      ],
      declarations: [PanelComponent],
      providers: [
        WINDOW_PROVIDERS,
        UserService,
        RecordAffiliationService,
        RecordFundingsService,
        RecordPeerReviewService,
        RecordResearchResourceService,
        RecordWorksService,
        VerificationEmailModalService,
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
    fixture = TestBed.createComponent(PanelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should be able to get aria-label of dialog', async () => {
    component.editModalComponent = ModalBiographyComponent
    component.open()

    const dialogs = await loader.getAllHarnesses(MatDialogHarness)
    expect(dialogs.length).toBe(1)
    expect(await dialogs[0].getAriaLabel()).toBe('Manage your biography dialog')
  })
})
