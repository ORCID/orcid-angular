import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PanelsComponent } from './panels.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../window'
import { RegisterService } from '../../../core/register/register.service'
import { PlatformInfoService } from '../../platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatMenuModule } from '@angular/material/menu'
import { SharedModule } from '../../../shared/shared.module'
import { PanelModule } from '../panel.module'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { MatDialogHarness } from '@angular/material/dialog/testing'
import { RecordModule } from '../../../record/record.module'
import { UntypedFormBuilder } from '@angular/forms'
import { ModalFundingComponent } from '../../../record/components/funding-stacks-groups/modals/modal-funding/modal-funding.component'

describe('PanelsComponent', () => {
  let component: PanelsComponent
  let fixture: ComponentFixture<PanelsComponent>
  let loader: HarnessLoader

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatMenuModule,
        NoopAnimationsModule,
        PanelModule,
        RecordModule,
        RouterTestingModule,
        SharedModule,
      ],
      declarations: [PanelsComponent],
      providers: [
        UntypedFormBuilder,
        WINDOW_PROVIDERS,
        RegisterService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should be able to get aria-label of dialog', async () => {
    component.openModal(ModalFundingComponent)

    const dialogs = await loader.getAllHarnesses(MatDialogHarness)
    expect(dialogs.length).toBe(1)
    expect(await dialogs[0].getAriaLabel()).toBe('Manage funding dialog')
  })
})
