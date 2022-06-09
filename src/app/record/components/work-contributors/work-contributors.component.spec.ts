import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkContributorsComponent } from './work-contributors.component'
import { UserInfo } from '../../../types'
import { UserRecord } from '../../../types/record.local'
import { Affiliation, AffiliationGroup } from '../../../types/record-affiliation.endpoint'
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

describe('WorkContributorsComponent', () => {
  let component: WorkContributorsComponent;
  let fixture: ComponentFixture<WorkContributorsComponent>;
  let debugElement: DebugElement
  let formGroupDirective: FormControlDirective
  const formBuilder = new FormBuilder()

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkContributorsComponent ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        WINDOW_PROVIDERS,
        FormGroupDirective,
        { provide: ControlContainer, useValue: formGroupDirective },
        ErrorHandlerService,
        FormGroupDirective,
        MatSnackBar,
        Overlay,
        PlatformInfoService,
        RecordWorksService,
        SnackbarService,
        TogglzService,
        UserService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkContributorsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement
    const mockFormGroup: FormGroup = new FormGroup({})
    const formGroupDirective: FormGroupDirective = new FormGroupDirective([], [])
    component['parentForm'].form = mockFormGroup
    component['parentForm'].control.setControl('roles', new FormArray([
      formBuilder.group({
        role: [{ value: 'conceptualization', disabled: true }]
      }),
      formBuilder.group({
        role: [{ value: 'unspecified', disabled: true }]
      })
    ]))
    component.userRecord = getUserRecord()

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display record holder name with roles and affiliation', async () => {
    const rolesFormArray = component['parentForm'].control?.controls['roles'] as FormArray
    rolesFormArray.push(formBuilder.group({ role: 'methodology' }))

    fixture.detectChanges()

    const recordHolderData = fixture.debugElement.query(By.css('.record-holder-name-and-roles')).nativeElement;
    const affiliation = fixture.debugElement.query(By.css('.affiliation')).nativeElement;

    expect(recordHolderData.innerHTML).not.toBeNull();
    expect(recordHolderData.textContent).toBe('Name Surname (Conceptualization, Unspecified, Methodology)');
    expect(affiliation.innerHTML).not.toBeNull();
    expect(affiliation.textContent).toBe('ORCID');
  });
});

function getUserRecord(): UserRecord {
  const userRecord: UserRecord = {} as UserRecord
  userRecord.userInfo = {
    REAL_USER_ORCID: '0000-0000-0000-000X'
  } as UserInfo
  userRecord.names = {
    givenNames: { value: 'Name'},
    familyName: { value: 'Surname'}
  } as NamesEndPoint
  const affiliation = { affiliationName: { value: 'ORCID' } } as Affiliation
  const affiliationUIGroup = { defaultAffiliation: affiliation } as AffiliationGroup
  userRecord.affiliations = [{
    type: 'EMPLOYMENT',
    affiliationGroup: [affiliationUIGroup]
  }]
  return userRecord
}
