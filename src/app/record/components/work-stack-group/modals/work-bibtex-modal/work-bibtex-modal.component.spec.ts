import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkBibtexModalComponent } from './work-bibtex-modal.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../../../cdk/window'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { SharedModule } from '../../../../../shared/shared.module'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { RecordModule } from '../../../../record.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { of } from 'rxjs'
import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { MatCheckboxHarness } from '@angular/material/checkbox/testing'
import { By } from '@angular/platform-browser'


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
        save: of()
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
        WINDOW_PROVIDERS,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
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

    await delay(100);

    await fixture.detectChanges()

    const worksCheckboxes = await loader.getAllHarnesses(MatCheckboxHarness)
    const selectAllCheckbox = worksCheckboxes[0]
    await selectAllCheckbox.check()

    const addAnotherContributor = fixture.debugElement.query(By.css('#cy-import-works'))
    addAnotherContributor.triggerEventHandler('click', null)

    expect(worksCheckboxes.length).toBe(5);
    expect(fakeRecordWorksService.save).toHaveBeenCalledTimes(4);
  })

})

function getFileList() {
  const bibText = '@book{Test_Testing_119267872,\n' +
    'title={Work 3},\n' +
    'author={Test Author and Test Author 2},\n' +
    'year={2022}\n' +
    '},\n' +
    '@book{Test_Testing2_119267852,\n' +
    'title={Work 2},\n' +
    'author={Test Author and Test Author 2},\n' +
    'year={2022}\n' +
    '},\n' +
    '@book{Test_Testing_119267798,\n' +
    'title={Work 1},\n' +
    'author={Test Author and Test Author 2},\n' +
    'year={2022}\n' +
    '},\n' +
    '@book{Test_Testing_119268314,\n' +
    'title={Work 4},\n' +
    'author={Test Author and Pedro Test Author 2}\n' +
    '}\n'
  const dt = new DataTransfer();
  dt.items.add(new File([bibText], 'src/test/files/works.bib'));
  return dt.files;
};

function getWorksValidated(): any[] {
  return [
    {
      'publicationDate': {
        'errors': [],
        'month': null,
        'day': null,
        'year': '2022',
        'required': true,
        'getRequiredMessage': null
      },
      'citation': {
        'errors': [],
        'citation': {
          'errors': [],
          'value': '@book{Test_Testing_119267872,title={Work 3},author={Test Author and Test Author 2},year={2022}}\n',
          'required': true,
          'getRequiredMessage': null
        },
        'citationType': {
          'errors': [],
          'value': 'bibtex',
          'required': true,
          'getRequiredMessage': null
        },
        'required': true,
        'getRequiredMessage': null
      },
      'title': {
        'errors': [],
        'value': 'Work 3',
        'required': true,
        'getRequiredMessage': null
      },
      'workCategory': {
        'errors': [],
        'value': 'publication',
        'required': true,
        'getRequiredMessage': null
      },
      'workType': {
        'errors': [],
        'value': 'book',
        'required': true,
        'getRequiredMessage': null
      },
      'errors': [],
      'userSource': false
    },
    {
      'publicationDate': {
        'errors': [],
        'month': null,
        'day': null,
        'year': '2022',
        'required': true,
        'getRequiredMessage': null
      },
      'citation': {
        'errors': [],
        'citation': {
          'errors': [],
          'value': '@book{Test_Testing2_119267852,title={Work 2},author={Test Author and Test Author 2},year={2022}}\n',
          'required': true,
          'getRequiredMessage': null
        },
        'citationType': {
          'errors': [],
          'value': 'bibtex',
          'required': true,
          'getRequiredMessage': null
        },
        'required': true,
        'getRequiredMessage': null
      },
      'title': {
        'errors': [],
        'value': 'Work 2',
        'required': true,
        'getRequiredMessage': null
      },
      'workCategory': {
        'errors': [],
        'value': 'publication',
        'required': true,
        'getRequiredMessage': null
      },
      'workType': {
        'errors': [],
        'value': 'book',
        'required': true,
        'getRequiredMessage': null
      },
      'errors': [],
      'userSource': false
    },
    {
      'publicationDate': {
        'errors': [],
        'month': null,
        'day': null,
        'year': '2022',
        'required': true,
        'getRequiredMessage': null
      },
      'citation': {
        'errors': [],
        'citation': {
          'errors': [],
          'value': '@book{Test_Testing_119267798,title={Work 1},author={Test Author and Test Author 2},year={2022}}\n',
          'required': true,
          'getRequiredMessage': null
        },
        'citationType': {
          'errors': [],
          'value': 'bibtex',
          'required': true,
          'getRequiredMessage': null
        },
        'required': true,
        'getRequiredMessage': null
      },
      'title': {
        'errors': [],
        'value': 'Work 1',
        'required': true,
        'getRequiredMessage': null
      },
      'workCategory': {
        'errors': [],
        'value': 'publication',
        'required': true,
        'getRequiredMessage': null
      },
      'workType': {
        'errors': [],
        'value': 'book',
        'required': true,
        'getRequiredMessage': null
      },
      'errors': [],
      'userSource': false
    },
    {
      'citation': {
        'errors': [],
        'citation': {
          'errors': [],
          'value': '@book{Test_Testing_119268314,title={Work 4},author={Test Author and Pedro Test Author 2}}\n',
          'required': true,
          'getRequiredMessage': null
        },
        'citationType': {
          'errors': [],
          'value': 'bibtex',
          'required': true,
          'getRequiredMessage': null
        },
        'required': true,
        'getRequiredMessage': null
      },
      'title': {
        'errors': [],
        'value': 'Work 4',
        'required': true,
        'getRequiredMessage': null
      },
      'workCategory': {
        'errors': [],
        'value': 'publication',
        'required': true,
        'getRequiredMessage': null
      },
      'workType': {
        'errors': [],
        'value': 'book',
        'required': true,
        'getRequiredMessage': null
      },
      'errors': [],
      'userSource': false
    }
  ]
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
