import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UserMenuComponent } from './user-menu.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { SignInService } from '../../core/sign-in/sign-in.service'
import { MatMenuModule } from '@angular/material/menu'
import { InboxService } from '../../core/inbox/inbox.service'
import { By } from '@angular/platform-browser'
import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { UserInfo } from '../../types'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { UserSession } from '../../types/session.local'
import { UserService } from '../../core'
import { TogglzService } from '../../core/togglz/togglz.service'
import { of, ReplaySubject } from 'rxjs'
import { Config } from 'src/app/types/config.endpoint'
import { MatIconModule } from '@angular/material/icon'
import { MatIconHarness } from '@angular/material/icon/testing'
import {
  MatMenuHarness,
  MatMenuItemHarness,
} from '@angular/material/menu/testing'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('UserMenuComponent', () => {
  let component: UserMenuComponent
  let fixture: ComponentFixture<UserMenuComponent>
  let togglzService: TogglzService
  let fakeInboxService: InboxService
  let fakeUserService: jasmine.SpyObj<UserService>
  let loader: HarnessLoader

  beforeEach(() => {
    fakeUserService = jasmine.createSpyObj<UserService>('UserService', {
      getUserSession: of(getUserSession()),
    })

    fakeInboxService = jasmine.createSpyObj<InboxService>('InboxService', {
      retrieveUnreadCount: of(3),
    })

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        MatMenuModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      declarations: [UserMenuComponent],
      providers: [
        { provide: InboxService, useValue: fakeInboxService },
        { provide: UserService, useValue: fakeUserService },
        WINDOW_PROVIDERS,
        TogglzService,
        SignInService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
    togglzService = TestBed.inject(TogglzService)
    togglzService.togglzSubject = new ReplaySubject<Config>()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMenuComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    loader = TestbedHarnessEnvironment.loader(fixture)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display user menu options when clicked', async () => {
    const matMenu = await loader.getHarness(MatMenuHarness)
    await matMenu.open()

    fixture.detectChanges()

    const isMatMenuOpen = await matMenu.isOpen()
    const matMenuItems: MatMenuItemHarness[] = await matMenu.getItems()
    const myOrcidItem = await matMenuItems[0].getText()
    const notificationsItem = await matMenuItems[1].getText()
    const accountSettingsItem = await matMenuItems[2].getText()
    const trustedPartiesItem = await matMenuItems[3].getText()
    const developerToolsItem = await matMenuItems[4].getText()
    const logoutItem = await matMenuItems[5].getText()

    expect(isMatMenuOpen).toBe(true)
    expect(matMenuItems.length).toBe(6)
    expect(myOrcidItem).toContain('View my ORCID record')
    expect(notificationsItem).toContain('Notifications inbox')
    expect(accountSettingsItem).toContain('Account settings')
    expect(trustedPartiesItem).toContain('Trusted parties')
    expect(developerToolsItem).toContain('Developer tools')
    expect(logoutItem).toContain('Logout')
  })

  it('should display 3 as unread notifications count', async () => {
    const userMenuButton = fixture.debugElement.query(By.css('#cy-user-info'))
    userMenuButton.triggerEventHandler('click', null)

    fixture.detectChanges()

    const menu = await loader.getHarness(MatMenuHarness)
    const menuItems = await menu.getItems()
    const inboxItem = await menuItems[1]
    const inboxCount = await inboxItem.getText()
    const inboxIcon = await inboxItem.getHarness(MatIconHarness)
    const inboxIconName = await inboxIcon.getName()

    expect(inboxCount).toBe(inboxIconName + 'Notifications inbox (3)')
  })
})

function getUserSession(): UserSession {
  const userSession = {} as UserSession
  userSession.userInfo = {
    REAL_USER_ORCID: '0000-0000-0000-000X',
    EFFECTIVE_USER_ORCID: '0000-0000-0000-000X',
    IN_DELEGATION_MODE: 'false',
  } as UserInfo
  userSession.loggedIn = true
  userSession.displayName = 'Test Name'
  return userSession
}
