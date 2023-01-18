import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkContributorRolesComponent } from './work-contributor-roles.component'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { HarnessLoader, parallel } from '@angular/cdk/testing'
import {
  ControlContainer,
  FormControlDirective,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'
import { MatSelectHarness } from '@angular/material/select/testing'
import { Contributor } from '../../../types'
import { MatIconModule } from '@angular/material/icon'
import { MatIconHarness } from '@angular/material/icon/testing'
import { SharedModule } from '../../../shared/shared.module'
import { RecordWorksService } from '../../../core/record-works/record-works.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { UserService } from '../../../core'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { getUserRecord } from '../../../core/record/record.service.spec'

describe('WorkContributorRoleComponent', () => {
  let component: WorkContributorRolesComponent
  let fixture: ComponentFixture<WorkContributorRolesComponent>
  let debugElement: DebugElement
  let formGroupDirective: FormControlDirective
  let loader: HarnessLoader

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkContributorRolesComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule,
      ],
      providers: [
        WINDOW_PROVIDERS,
        { provide: ControlContainer, useValue: formGroupDirective },
        ErrorHandlerService,
        FormGroupDirective,
        MatSnackBar,
        Overlay,
        PlatformInfoService,
        RecordWorksService,
        SnackbarService,
        TogglzService,
        UserService,
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkContributorRolesComponent)
    component = fixture.componentInstance
    debugElement = fixture.debugElement
    const mockFormGroup: UntypedFormGroup = new UntypedFormGroup({})
    component['parentForm'].form = mockFormGroup
    component.userRecord = getUserRecord()

    fixture.detectChanges()
    loader = TestbedHarnessEnvironment.loader(fixture)
  })

  it('should create an empty mat select if there is no contributors data and options length must be 14', async () => {
    const matSelects = await loader.getAllHarnesses(MatSelectHarness)
    const select = await loader.getHarness(MatSelectHarness)
    await select.open()
    const options = await select.getOptions()

    expect(component).toBeTruthy()
    expect(matSelects.length).toBe(1)
    expect(options.length).toBe(15)
  })

  it('should have unique error', async () => {
    const roles = await loader.getAllHarnesses(MatSelectHarness)
    await roles[0].open()
    await roles[0].clickOptions({ text: 'Conceptualization' })

    const addAnotherRoleButton = debugElement.query(
      By.css('#cy-add-another-role-contributors')
    )
    addAnotherRoleButton.triggerEventHandler('click', null)
    await fixture.whenStable()

    const newRoles = await loader.getAllHarnesses(MatSelectHarness)
    await newRoles[1].open()
    await newRoles[1].clickOptions({ text: 'Conceptualization' })

    expect(component.roles.controls[1].get('role')?.errors?.unique).toBe(true)
  })

  it('should display two disabled options since they were previously selected', async () => {
    component.contributors = getContributor()
    component.ngOnInit()

    fixture.detectChanges()

    const addAnotherRoleButton = debugElement.query(
      By.css('#cy-add-another-role-contributors')
    )
    addAnotherRoleButton.triggerEventHandler('click', null)
    await fixture.whenStable()

    const select = await loader.getHarness(MatSelectHarness)
    await select.open()
    const options = await select.getOptions()
    const disabledStates = await parallel(() =>
      options.map((option) => option.isDisabled())
    )

    await select.clickOptions({ text: 'Validation' })

    const deleteButtons = await loader.getAllHarnesses(MatIconHarness)

    expect(disabledStates.filter((value) => value).length).toBe(2)
    expect(deleteButtons.length).toBe(4)
  })

  it('should not display contributor roles if record holder is not present in the contributors list', async () => {
    component.contributors = getContributor()
    component.contributors[0].contributorOrcid.path = '0000-0000-0000-0001'
    component.recordHolderAsContributor = true

    component.ngOnInit()

    fixture.detectChanges()

    const roles = await loader.getAllHarnesses(MatSelectHarness)

    expect(roles.length).toBe(0)
  })
})

function getContributor(): Contributor[] {
  return [
    {
      creditName: 'Test Name',
      contributorOrcid: {
        path: '0000-0000-0000-000X',
        uri: 'https://dev.orcid.org/0000-0000-0000-000X',
      },
      rolesAndSequences: [
        {
          contributorRole: 'conceptualization',
          contributorSequence: null,
        },
        {
          contributorRole: 'project administration',
          contributorSequence: null,
        },
        {
          contributorRole: 'editor',
          contributorSequence: null,
        },
      ],
    } as Contributor,
  ]
}
