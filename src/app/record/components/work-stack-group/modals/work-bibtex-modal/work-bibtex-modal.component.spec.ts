import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkBibtexModalComponent } from './work-bibtex-modal.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../../../cdk/window'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { SharedModule } from '../../../../../shared/shared.module'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { RecordModule } from '../../../../record.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { of } from 'rxjs'
import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { MatLegacyCheckboxHarness as MatCheckboxHarness } from '@angular/material/legacy-checkbox/testing'
import { By } from '@angular/platform-browser'
import { Contributor } from '../../../../../types'
import { TogglzService } from 'src/app/core/togglz/togglz.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('WorkDoiBibtexModalComponent', () => {
  let component: WorkBibtexModalComponent
  let fixture: ComponentFixture<WorkBibtexModalComponent>
  let loader: HarnessLoader
  let fakeRecordWorksService: RecordWorksService

  beforeEach(async () => {
    fakeRecordWorksService = jasmine.createSpyObj<RecordWorksService>(
      'RecordWorksService',
      {
        getWorks: undefined,
        worksValidate: of(getWorksValidated()),
        save: of(),
      }
    )

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        RecordModule,
        RouterTestingModule,
        SharedModule,
      ],
      declarations: [WorkBibtexModalComponent],
      providers: [
        { provide: RecordWorksService, useValue: fakeRecordWorksService },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: TogglzService,
          useValue: {
            getStateOf: (x) => {
              return of(true)
            },
          },
        },

        WINDOW_PROVIDERS,
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
    fixture = TestBed.createComponent(WorkBibtexModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    loader = TestbedHarnessEnvironment.loader(fixture)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display 4 works and call `save` for each work selected', async () => {
    const files = { target: { files: getFileList() } }
    component.bibTexInputChange(files)

    await delay(100)

    await fixture.detectChanges()

    const worksCheckboxes = await loader.getAllHarnesses(MatCheckboxHarness)
    const selectAllCheckbox = worksCheckboxes[0]
    await selectAllCheckbox.check()

    const addAnotherContributor = fixture.debugElement.query(
      By.css('#cy-import-works')
    )
    addAnotherContributor.triggerEventHandler('click', null)

    expect(worksCheckboxes.length).toBe(5)
    expect(fakeRecordWorksService.save).toHaveBeenCalledTimes(4)
  })

  it('should import contributors from bibtex', async () => {
    const files = { target: { files: getFileList() } }
    component.bibTexInputChange(files)

    await delay(100)

    await fixture.detectChanges()
    const workWithContributors = component.worksFromBibtex[3]
    const contributors = workWithContributors.contributorsGroupedByOrcid
    const authors = filterContributorsByRole(contributors, 'author')
    const editors = filterContributorsByRole(contributors, 'editor')

    expect(workWithContributors.contributorsGroupedByOrcid.length).toBe(4)
    expect(authors.length).toBe(2)
    expect(editors.length).toBe(2)
  })
})

function getFileList() {
  const bibText =
    '@book{Test_Testing_119267872,\n' +
    'title={Work 3},\n' +
    'author={Test Author and Test Author 2},\n' +
    'year={2022}\n' +
    '},\n' +
    '@book{Test_Testing2_119267852,\n' +
    'title={Work 2},\n' +
    'author={Test Author and Test Author 2},\n' +
    'year={2022}\n' +
    '},\n' +
    '@ARTICLE{Test_Testing_119267798,\n' +
    'author={Test Author and Test Author 2},\n' +
    'journal={Nature Energy},\n' +
    'title={Article title},\n' +
    'year={2020},\n' +
    'month={Jan.},\n' +
    'volume={5},\n' +
    'number={},\n' +
    'pages={79–88},\n' +
    'keywords={},\n' +
    'doi={10.1038/s41560-019-0535-7},\n' +
    'ISSN={}\n' +
    '},\n' +
    '@book{Test_Testing_119268314,\n' +
    'title={Work 4},\n' +
    'author={Test Author 1 and Test Author 2},\n' +
    'editor={Test Author 3 and Test Author 4}\n' +
    '}\n'
  const dt = new DataTransfer()
  dt.items.add(new File([bibText], 'src/test/files/works.bib'))
  return dt.files
}

function getWorksValidated(): any[] {
  return [
    {
      publicationDate: {
        errors: [],
        month: null,
        day: null,
        year: '2022',
        required: true,
        getRequiredMessage: null,
      },
      citation: {
        errors: [],
        citation: {
          errors: [],
          value:
            '@book{Test_Testing_119267872,title={Work 3},author={Test Author and Test Author 2},year={2022}}\n',
          required: true,
          getRequiredMessage: null,
        },
        citationType: {
          errors: [],
          value: 'bibtex',
          required: true,
          getRequiredMessage: null,
        },
        required: true,
        getRequiredMessage: null,
      },
      title: {
        errors: [],
        value: 'Work 3',
        required: true,
        getRequiredMessage: null,
      },
      workCategory: {
        errors: [],
        value: 'publication',
        required: true,
        getRequiredMessage: null,
      },
      workType: {
        errors: [],
        value: 'book',
        required: true,
        getRequiredMessage: null,
      },
      errors: [],
      userSource: false,
    },
    {
      publicationDate: {
        errors: [],
        month: null,
        day: null,
        year: '2022',
        required: true,
        getRequiredMessage: null,
      },
      citation: {
        errors: [],
        citation: {
          errors: [],
          value:
            '@book{Test_Testing2_119267852,title={Work 2},author={Test Author and Test Author 2},year={2022}}\n',
          required: true,
          getRequiredMessage: null,
        },
        citationType: {
          errors: [],
          value: 'bibtex',
          required: true,
          getRequiredMessage: null,
        },
        required: true,
        getRequiredMessage: null,
      },
      title: {
        errors: [],
        value: 'Work 2',
        required: true,
        getRequiredMessage: null,
      },
      workCategory: {
        errors: [],
        value: 'publication',
        required: true,
        getRequiredMessage: null,
      },
      workType: {
        errors: [],
        value: 'book',
        required: true,
        getRequiredMessage: null,
      },
      errors: [],
      userSource: false,
    },
    {
      publicationDate: {
        errors: [],
        month: null,
        day: null,
        year: '2022',
        required: true,
        getRequiredMessage: null,
      },
      citation: {
        errors: [],
        citation: {
          errors: [],
          value:
            '@book{Test_Testing_119267798,title={Work 1},author={Test Author and Test Author 2},year={2022}}\n',
          required: true,
          getRequiredMessage: null,
        },
        citationType: {
          errors: [],
          value: 'bibtex',
          required: true,
          getRequiredMessage: null,
        },
        required: true,
        getRequiredMessage: null,
      },
      title: {
        errors: [],
        value: 'Work 1',
        required: true,
        getRequiredMessage: null,
      },
      workCategory: {
        errors: [],
        value: 'publication',
        required: true,
        getRequiredMessage: null,
      },
      workType: {
        errors: [],
        value: 'book',
        required: true,
        getRequiredMessage: null,
      },
      errors: [],
      userSource: false,
    },
    {
      citation: {
        errors: [],
        citation: {
          errors: [],
          value:
            '@book{Test_Testing_119268314,title={Work 4},author={Test Author and Pedro Test Author 2}}\n',
          required: true,
          getRequiredMessage: null,
        },
        citationType: {
          errors: [],
          value: 'bibtex',
          required: true,
          getRequiredMessage: null,
        },
        required: true,
        getRequiredMessage: null,
      },
      title: {
        errors: [],
        value: 'Work 4',
        required: true,
        getRequiredMessage: null,
      },
      workCategory: {
        errors: [],
        value: 'publication',
        required: true,
        getRequiredMessage: null,
      },
      workType: {
        errors: [],
        value: 'book',
        required: true,
        getRequiredMessage: null,
      },
      contributorsGroupedByOrcid: [
        {
          creditName: {
            content: 'Test Author 1',
          },
          rolesAndSequences: [
            {
              contributorRole: 'author',
              contributorSequence: null,
            },
          ],
        },
        {
          creditName: {
            content: 'Test Author 2',
          },
          rolesAndSequences: [
            {
              contributorRole: 'author',
              contributorSequence: null,
            },
          ],
        },
        {
          creditName: {
            content: 'Test Author 3',
          },
          rolesAndSequences: [
            {
              contributorRole: 'editor',
              contributorSequence: null,
            },
          ],
        },
        {
          creditName: {
            content: 'Test Author 4',
          },
          rolesAndSequences: [
            {
              contributorRole: 'editor',
              contributorSequence: null,
            },
          ],
        },
      ],
      errors: [],
      userSource: false,
    },
  ]
}

function filterContributorsByRole(
  contributors: Contributor[],
  role: 'author' | 'editor'
): Contributor[] {
  return contributors.filter((c) =>
    c.rolesAndSequences.some((r) => r.contributorRole === role)
  )
}

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}
