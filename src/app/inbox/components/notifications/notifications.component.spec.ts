import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotificationsComponent } from './notifications.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { RegisterService } from '../../../core/register/register.service'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { UntypedFormBuilder } from '@angular/forms'
import { InboxService } from '../../../core/inbox/inbox.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('NotificationsComponent', () => {
  let component: NotificationsComponent
  let fixture: ComponentFixture<NotificationsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [NotificationsComponent],
      providers: [
        WINDOW_PROVIDERS,
        UntypedFormBuilder,
        InboxService,
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
    fixture = TestBed.createComponent(NotificationsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
