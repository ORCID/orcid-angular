import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MyOrcidComponent } from './my-orcid.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { By } from '@angular/platform-browser'
import { SideBarModule } from '../../../cdk/side-bar/side-bar.module'
import { RecordModule } from '../../record.module'
import { UserService } from '../../../core'
import { of, ReplaySubject } from 'rxjs'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { Config } from '../../../types/config.endpoint'
import { RecordService } from '../../../core/record/record.service'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { getUserRecord } from '../../../core/record/record.service.spec'
import { getUserSession } from '../../../core/user/user.service.spec'
import { RecordPublicSideBarService } from '../../../core/record-public-side-bar/record-public-side-bar.service'
import { getSideBarPublicUserRecord } from '../../../core/record-public-side-bar/record-public-side-bar.service.spec'
import { OpenGraphService } from 'src/app/core/open-graph/open-graph.service'
import { TitleService } from 'src/app/core/title-service/title.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('MyOrcidComponent', () => {
  let component: MyOrcidComponent
  let fixture: ComponentFixture<MyOrcidComponent>
  let togglzService: TogglzService
  let fakeRecordService: RecordService
  let userService: UserService
  let recordPublicSideBarService: RecordPublicSideBarService
  let openGraph: OpenGraphService

  beforeEach(() => {
    fakeRecordService = jasmine.createSpyObj<RecordService>('RecordService', {
      getRecord: of(getUserRecord()),
    })

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RecordModule,
        RouterTestingModule,
        SideBarModule,
      ],
      declarations: [MyOrcidComponent],
      providers: [
        { provide: RecordService, useValue: fakeRecordService },
        WINDOW_PROVIDERS,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
        OpenGraphService,
        TitleService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    togglzService = TestBed.inject(TogglzService)
    togglzService.togglzSubject = new ReplaySubject<Config>()
    userService = TestBed.inject(UserService)
    recordPublicSideBarService = TestBed.inject(RecordPublicSideBarService)
    recordPublicSideBarService = TestBed.inject(RecordPublicSideBarService)

    userService.getUserSession = jasmine
      .createSpy()
      .and.returnValue(of(getUserSession()))
    recordPublicSideBarService.getPublicRecordSideBar = jasmine
      .createSpy()
      .and.returnValue(of(getSideBarPublicUserRecord()))

    fixture = TestBed.createComponent(MyOrcidComponent)
    component = fixture.componentInstance
    component.platform = {
      columns12: true,
    } as PlatformInfo
    component.initMyOrcidParameter = true
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have only one main landmark', () => {
    validateThatExistAndNumberOfElements(fixture, 'main', 1)
  })

  it('should have only one section personal information', () => {
    if (component.platform.columns12) {
      validateThatExistAndNumberOfElements(fixture, 'personal-information', 1)
    } else {
      validateThatExistAndNumberOfElements(fixture, 'personal-information', 2)
    }
  })

  it('[PRIVATE] should have only one of each section', () => {
    validateTopBarAndActivities(fixture, 1)
  })

  it('[PUBLIC] should have only one of each section', () => {
    addIsPublicRecord(component, fixture)

    validateTopBarAndActivities(fixture, 1)
  })

  it('[PUBLIC] should have heading hierarchy', () => {
    addIsPublicRecord(component, fixture)

    expect(
      fixture.debugElement.query(By.css('h2.biography-header'))
    ).toBeTruthy()
    expect(
      fixture.debugElement.query(By.css('h2.activities-header'))
    ).toBeTruthy()
    expect(
      fixture.debugElement.queryAll(By.css('h3.activity-header')).length
    ).toBe(5)
  })
})

function validateTopBarAndActivities(
  fixture: ComponentFixture<MyOrcidComponent>,
  numberOfElements: number
) {
  validateThatExistAndNumberOfElements(fixture, 'names', numberOfElements)
  validateThatExistAndNumberOfElements(fixture, 'biography', numberOfElements)
  validateThatExistAndNumberOfElements(fixture, 'activities', numberOfElements)
  validateThatExistAndNumberOfElements(
    fixture,
    'affiliations',
    numberOfElements
  )
  validateThatExistAndNumberOfElements(
    fixture,
    'professional-activities',
    numberOfElements
  )
  validateThatExistAndNumberOfElements(
    fixture,
    'research-resources',
    numberOfElements
  )
  validateThatExistAndNumberOfElements(fixture, 'funding', numberOfElements)
  validateThatExistAndNumberOfElements(fixture, 'works', numberOfElements)
  validateThatExistAndNumberOfElements(
    fixture,
    'peer-reviews',
    numberOfElements
  )
}

function validateThatExistAndNumberOfElements(
  fixture: ComponentFixture<MyOrcidComponent>,
  id: string,
  numberOfElements: number
) {
  const elements = fixture.debugElement.queryAll(By.css(`#${id}`))
  expect(elements).toBeTruthy()
  expect(elements.length).toBe(
    numberOfElements,
    `Section ${id} should be unique`
  )
}

function addIsPublicRecord(
  component: MyOrcidComponent,
  fixture: ComponentFixture<MyOrcidComponent>
) {
  component.publicOrcid = getUserRecord().userInfo.REAL_USER_ORCID
  fixture.detectChanges()
}
