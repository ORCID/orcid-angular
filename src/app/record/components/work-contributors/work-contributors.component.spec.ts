import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkContributorsComponent } from './work-contributors.component'
import { Contributor, UserInfo } from '../../../types'
import { UserRecord } from '../../../types/record.local'
import {
  Affiliation,
  AffiliationGroup,
  AffiliationGroupsTypes,
} from '../../../types/record-affiliation.endpoint'
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormControlDirective,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'
import { DebugElement } from '@angular/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { NamesEndPoint } from '../../../types/record-name.endpoint'
import { By } from '@angular/platform-browser'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { RecordWorksService } from '../../../core/record-works/record-works.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { UserService } from '../../../core'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatSelectHarness } from '@angular/material/select/testing'
import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { MatInputHarness } from '@angular/material/input/testing'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'
import { SharedModule } from '../../../shared/shared.module'
import { MatInputModule } from '@angular/material/input'
import { MatButtonHarness } from '@angular/material/button/testing'
import { ModalModule } from '../../../cdk/modal/modal.module'

describe('WorkContributorsComponent', () => {
  let component: WorkContributorsComponent
  let fixture: ComponentFixture<WorkContributorsComponent>
  let debugElement: DebugElement
  let formGroupDirective: FormControlDirective
  let loader: HarnessLoader
  const formBuilder = new FormBuilder()

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkContributorsComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        ModalModule,
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
    fixture = TestBed.createComponent(WorkContributorsComponent)
    component = fixture.componentInstance
    debugElement = fixture.debugElement
    const mockFormGroup: FormGroup = new FormGroup({})
    const formGroupDirective: FormGroupDirective = new FormGroupDirective(
      [],
      []
    )
    component['parentForm'].form = mockFormGroup
    component['parentForm'].control.setControl(
      'roles',
      new FormArray([
        formBuilder.group({
          role: [{ value: 'conceptualization', disabled: true }],
        }),
        formBuilder.group({
          role: [{ value: 'no specified role', disabled: true }],
        }),
      ])
    )
    component.userRecord = getUserRecord()

    fixture.detectChanges()
    loader = TestbedHarnessEnvironment.loader(fixture)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display record holder name with roles and affiliation', async () => {
    const rolesFormArray = component['parentForm'].control?.controls[
      'roles'
    ] as FormArray
    rolesFormArray.push(formBuilder.group({ role: 'methodology' }))

    fixture.detectChanges()

    const creditNameAndRoles = fixture.debugElement.query(
      By.css('.credit-name-and-roles')
    ).nativeElement
    const affiliation = fixture.debugElement.query(By.css('.affiliation'))
      .nativeElement

    expect(creditNameAndRoles.innerHTML).not.toBeNull()
    expect(creditNameAndRoles.textContent).toBe(
      'Name Surname (Conceptualization, No specified role, Methodology)'
    )
    expect(affiliation.innerHTML).not.toBeNull()
    expect(affiliation.textContent).toBe('ORCID, University')
  })

  it('should display contributors metadata', async () => {
    const rolesFormArray = component['parentForm'].control?.controls[
      'roles'
    ] as FormArray
    rolesFormArray.push(formBuilder.group({ role: 'methodology' }))

    fixture.detectChanges()

    const recordHolderData = fixture.debugElement.query(
      By.css('.credit-name-and-roles')
    ).nativeElement
    const affiliation = fixture.debugElement.query(By.css('.affiliation'))
      .nativeElement

    expect(recordHolderData.innerHTML).not.toBeNull()
    expect(recordHolderData.textContent).toBe(
      'Name Surname (Conceptualization, No specified role, Methodology)'
    )
    expect(affiliation.innerHTML).not.toBeNull()
    expect(affiliation.textContent).toBe('ORCID, University')
  })

  it('should display `Add another contributor button`', () => {
    expect(
      debugElement.query(By.css('#cy-add-another-contributor'))
    ).toBeTruthy()
  })

  it('should add new contributor form when you click `Add another contributor`', async () => {
    await findByClassNameAndClickButton(
      debugElement,
      fixture,
      '#cy-add-another-contributor'
    )

    const contributorName = await loader.getHarness(MatInputHarness)
    const role = await loader.getHarness(MatSelectHarness)

    expect(contributorName).toBeTruthy()
    expect(role).toBeTruthy()
  })

  it('should add new role input to new contributor form when you click `Add another role`', async () => {
    await findByClassNameAndClickButton(
      debugElement,
      fixture,
      '#cy-add-another-contributor'
    )

    fixture.detectChanges()

    await findByClassNameAndClickButton(
      debugElement,
      fixture,
      '#cy-add-another-role'
    )

    const roles = await loader.getAllHarnesses(MatSelectHarness)

    expect(roles.length).toBe(2)
  })

  it('should display two error messages if `Save changes` is clicked and there is no name and role is duplicated`', async () => {
    await findByClassNameAndClickButton(
      debugElement,
      fixture,
      '#cy-add-another-contributor'
    )

    fixture.detectChanges()

    await findByClassNameAndClickButton(
      debugElement,
      fixture,
      '#cy-add-another-role'
    )

    const roles = await loader.getAllHarnesses(MatSelectHarness)
    await roles[0].open()
    await roles[0].clickOptions({ text: 'Conceptualization' })

    await roles[1].open()
    await roles[1].clickOptions({ text: 'Conceptualization' })

    component.contributorsFormArray.markAllAsTouched()

    fixture.detectChanges()

    expect(fixture.nativeElement.querySelectorAll('mat-error').length)
      .withContext('Expected two error messages')
      .toBe(2)
  })

  it('should display two contributors the record holder and other without the Orcid logo', async () => {
    component.contributors = [getContributors()[0]]
    component.ngOnInit()

    fixture.detectChanges()

    const contributors = fixture.nativeElement.querySelectorAll(
      '.contributors-box'
    )

    expect(contributors.length).toBe(2)
    expect(contributors[0].querySelector('.orcid-logo')).toBeTruthy()
    expect(contributors[1].querySelector('.orcid-logo')).not.toBeTruthy()
  })

  it('should display contributor with Orcid logo and a link to their profile', async () => {
    component.contributors = [getContributors()[1]]
    component.ngOnInit()

    fixture.detectChanges()

    const contributors = fixture.nativeElement.querySelectorAll(
      '.contributors-box'
    )

    expect(contributors.length).toBe(2)
    expect(contributors[0].querySelector('.orcid-logo')).toBeTruthy()
    expect(contributors[1].querySelector('.orcid-logo')).toBeTruthy()
  })

  it('should remove contributor from the list when you click the delete button', async () => {
    component.contributors = [getContributors()[1]]
    component.ngOnInit()

    fixture.detectChanges()

    const deleteButton = await loader.getHarness(MatButtonHarness)
    await deleteButton.click()

    const contributors = fixture.nativeElement.querySelectorAll(
      '.contributors-box'
    )

    expect(contributors.length).toBe(1)
  })

  it('should remove contributor role from the list when you click the delete button first role should not have delete button', async () => {
    await findByClassNameAndClickButton(
      debugElement,
      fixture,
      '#cy-add-another-contributor'
    )

    fixture.detectChanges()

    await findByClassNameAndClickButton(
      debugElement,
      fixture,
      '#cy-add-another-role'
    )

    const roles = await loader.getAllHarnesses(MatSelectHarness)
    await roles[0].open()
    await roles[0].clickOptions({ text: 'Conceptualization' })

    await roles[1].open()
    await roles[1].clickOptions({ text: 'Methodology' })

    const rolesBox = fixture.nativeElement.querySelectorAll('.roles-box')

    expect(rolesBox.length).toBe(2)
    expect(debugElement.query(By.css('#cy-remove-role-0'))).not.toBeTruthy()
  })

  it('should not display delete button if there is only record holder contribution', async () => {
    const deleteButton = debugElement.query(By.css('#cy-delete-button-1'))

    expect(deleteButton).not.toBeTruthy()
  })

  it('should display notice panel if theres 50+ editable contributors and button `Add another contributor` must be disabled', async () => {
    component.contributors = getNumberOfContributors(60)

    component.ngOnInit()

    fixture.detectChanges()

    const contributors = fixture.nativeElement.querySelectorAll(
      '.contributors-box'
    )

    const noticePanel = fixture.nativeElement.querySelector('.notice-panel')

    const addAnotherContributor = debugElement.query(By.css('a.disabled'))

    expect(contributors.length).toBe(61)
    expect(noticePanel).toBeTruthy()
    expect(addAnotherContributor).toBeTruthy()
  })

  it('should not display notice panel if there is less than 50 contributors', async () => {
    component.contributors = getNumberOfContributors(30)

    component.ngOnInit()

    fixture.detectChanges()

    const contributors = fixture.nativeElement.querySelectorAll(
      '.contributors-box'
    )

    const noticePanel = fixture.nativeElement.querySelector('.notice-panel')

    const addAnotherContributor = debugElement.query(By.css('a.disabled'))

    expect(contributors.length).toBe(31)
    expect(noticePanel).not.toBeTruthy()
    expect(addAnotherContributor).not.toBeTruthy()
  })

  it('should display record holder and one contributor with no roles', async () => {
    component.contributors = [getContributors()[1]]

    component.ngOnInit()

    fixture.detectChanges()

    const contributors = fixture.nativeElement.querySelectorAll(
      '.contributors-box'
    )
    const creditNameAndRoles = contributors[1].querySelector(
      '.credit-name-and-roles'
    )

    expect(contributors.length).toBe(2)
    expect(creditNameAndRoles.innerText).toBe('Contributor no role no sequence')
  })

  it('should display record holder and one contributor with only one role', async () => {
    component.contributors = [getContributors()[2]]

    component.ngOnInit()

    fixture.detectChanges()

    const contributors = fixture.nativeElement.querySelectorAll(
      '.contributors-box'
    )
    const creditNameAndRoles = contributors[1].querySelector(
      '.credit-name-and-roles'
    )

    expect(contributors.length).toBe(2)
    expect(creditNameAndRoles.innerText).toBe(
      'Contributor one role (Conceptualization)'
    )
  })

  it('should display record holder and one contributor with only one sequence', async () => {
    component.contributors = [getContributors()[3]]

    component.ngOnInit()

    fixture.detectChanges()

    const contributors = fixture.nativeElement.querySelectorAll(
      '.contributors-box'
    )
    const creditNameAndRoles = contributors[1].querySelector(
      '.credit-name-and-roles'
    )

    expect(contributors.length).toBe(2)
    expect(creditNameAndRoles.innerText).toBe('Contributor one sequence')
  })

  it('should display record holder and one contributor with role and sequence', async () => {
    component.contributors = [getContributors()[4]]

    component.ngOnInit()

    fixture.detectChanges()

    const contributors = fixture.nativeElement.querySelectorAll(
      '.contributors-box'
    )
    const creditNameAndRoles = contributors[1].querySelector(
      '.credit-name-and-roles'
    )

    expect(contributors.length).toBe(2)
    expect(creditNameAndRoles.innerText).toBe(
      'Contributor one role and one sequence (Conceptualization)'
    )
  })

  it('should display record holder and one contributor with multiple roles new and old', async () => {
    component.contributors = [getContributors()[5]]

    component.ngOnInit()

    fixture.detectChanges()

    const contributors = fixture.nativeElement.querySelectorAll(
      '.contributors-box'
    )
    const creditNameAndRoles = contributors[1].querySelector(
      '.credit-name-and-roles'
    )

    expect(contributors.length).toBe(2)
    expect(creditNameAndRoles.innerText).toBe(
      'Contributor multiple roles (Conceptualization, Author)'
    )
  })

  it('should display notice panel if 50+ contributors are added and button `Add another contributor` must be disabled', async () => {
    const addAnotherContributor = debugElement.query(
      By.css('#cy-add-another-contributor')
    )

    await Array.from({ length: 49 }, (x, i) => {
      addAnotherContributor.triggerEventHandler('click', null)

      fixture.detectChanges()
    })

    const contributors = fixture.nativeElement.querySelectorAll(
      '.contributors-box'
    )

    const noticePanel = fixture.nativeElement.querySelector('.notice-panel')

    const addAnotherContributorDisabled = debugElement.query(
      By.css('a.disabled')
    )

    expect(contributors.length).toBe(50)
    expect(noticePanel).toBeTruthy()
    expect(addAnotherContributorDisabled).toBeTruthy()
  })

  it('should display a notice panel if there are 50 contributors, but should disappear if a contributor is removed', async () => {
    component.contributors = getNumberOfContributors(49)

    component.ngOnInit()

    fixture.detectChanges()

    await findByClassNameAndClickButton(
      debugElement,
      fixture,
      '#cy-delete-button-49'
    )

    fixture.detectChanges()

    const contributors = fixture.nativeElement.querySelectorAll(
      '.contributors-box'
    )

    const noticePanel = fixture.nativeElement.querySelector('.notice-panel')

    const addAnotherContributorDisabled = debugElement.query(
      By.css('a.disabled')
    )

    expect(contributors.length).toBe(49)
    expect(noticePanel).not.toBeTruthy()
    expect(addAnotherContributorDisabled).not.toBeTruthy()
  })

})

function getUserRecord(): UserRecord {
  const userRecord: UserRecord = {} as UserRecord
  userRecord.userInfo = {
    REAL_USER_ORCID: '0000-0000-0000-000X',
    EFFECTIVE_USER_ORCID: '0000-0000-0000-000X',
  } as UserInfo
  userRecord.names = {
    givenNames: { value: 'Name' },
    familyName: { value: 'Surname' },
  } as NamesEndPoint
  const affiliationUIGroupEmployment = {
    defaultAffiliation: {
      affiliationName: { value: 'ORCID' },
      affiliationType: { value: 'employment' },
    } as Affiliation,
  } as AffiliationGroup
  const affiliationUIGroupMembership = {
    defaultAffiliation: {
      affiliationName: { value: 'University' },
      affiliationType: { value: 'employment' },
    } as Affiliation,
  } as AffiliationGroup
  userRecord.affiliations = [
    {
      type: AffiliationGroupsTypes.EMPLOYMENT,
      affiliationGroup: [affiliationUIGroupEmployment],
    },
    {
      type: AffiliationGroupsTypes.MEMBERSHIP,
      affiliationGroup: [affiliationUIGroupMembership],
    },
  ]
  return userRecord
}

function getContributors(): Contributor[] {
  return [
    {
      creditName: {
        content: 'Test Name',
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
    {
      creditName: {
        content: 'Contributor no role no sequence',
      },
      contributorOrcid: {
        path: '0000-0000-0000-0001',
        uri: 'https://dev.orcid.org/0000-0000-0000-0001',
      },
      rolesAndSequences: [
        {
          contributorRole: null,
          contributorSequence: null,
        },
      ],
    } as Contributor,
    {
      creditName: {
        content: 'Contributor one role',
      },
      contributorOrcid: {
        path: '0000-0000-0000-0001',
        uri: 'https://dev.orcid.org/0000-0000-0000-0001',
      },
      rolesAndSequences: [
        {
          contributorRole: 'conceptualization',
          contributorSequence: null,
        },
      ],
    } as Contributor,
    {
      creditName: {
        content: 'Contributor one sequence',
      },
      contributorOrcid: {
        path: '0000-0000-0000-0002',
        uri: 'https://dev.orcid.org/0000-0000-0000-0002',
      },
      rolesAndSequences: [
        {
          contributorRole: null,
          contributorSequence: 'first',
        },
      ],
    } as Contributor,
    {
      creditName: {
        content: 'Contributor one role and one sequence',
      },
      contributorOrcid: {
        path: '0000-0000-0000-0003',
        uri: 'https://dev.orcid.org/0000-0000-0000-0003',
      },
      rolesAndSequences: [
        {
          contributorRole: 'conceptualization',
          contributorSequence: 'first',
        },
      ],
    } as Contributor,
    {
      creditName: {
        content: 'Contributor multiple roles',
      },
      contributorOrcid: {
        path: '0000-0000-0000-0004',
        uri: 'https://dev.orcid.org/0000-0000-0000-0004',
      },
      rolesAndSequences: [
        {
          contributorRole: 'conceptualization',
          contributorSequence: null,
        },
        {
          contributorRole: 'author',
          contributorSequence: null,
        },
      ],
    } as Contributor,
  ]
}

function getNumberOfContributors(numberOfContributors: number): Contributor[] {
  const contributors = []
  for (let i = 0; i < numberOfContributors; i++) {
    const contributor = getContributor()
    contributor.creditName.content = contributor.creditName.content + ' ' + (i + 1)
    contributor.contributorOrcid.path = contributor.contributorOrcid.path + i
    contributors.push(contributor)
  }
  return contributors
}

function getContributor(): Contributor {
  return {
    creditName: {
      content: 'Contributor'
    },
    contributorOrcid: {
      path: '0000-0000-0000-000',
      uri: 'https://dev.orcid.org/0000-0000-0000-0001',
    },
    rolesAndSequences: [
      {
        contributorRole: 'conceptualization',
        contributorSequence: null,
      },
    ],
  } as Contributor
}

async function findByClassNameAndClickButton(
  debugElement,
  fixture,
  className: string
) {
  const addAnotherContributor = debugElement.query(By.css(className))
  addAnotherContributor.triggerEventHandler('click', null)
  await fixture.whenStable()
}
