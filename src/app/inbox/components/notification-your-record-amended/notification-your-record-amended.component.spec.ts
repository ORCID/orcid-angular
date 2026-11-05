import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotificationYourRecordAmendedComponent } from './notification-your-record-amended.component'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('NotificationYourRecordAmendedComponent', () => {
  let component: NotificationYourRecordAmendedComponent
  let fixture: ComponentFixture<NotificationYourRecordAmendedComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [NotificationYourRecordAmendedComponent],
      providers: [
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
    fixture = TestBed.createComponent(NotificationYourRecordAmendedComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  // A notification raised by ORCID itself carries no member source, and the
  // endpoint sends `source: null`. Rendering must not throw: an exception here
  // aborts the change-detection pass and takes the rest of the page — the
  // global header buttons included — down with it (PD-13322).
  it('renders a notification whose source is null', () => {
    component.notification = {
      notificationType: 'AMENDED',
      putCode: 1,
      subject: 'Your record was amended',
      amendedSection: 'EMPLOYMENT',
      source: null,
      items: { items: [] },
    } as any

    expect(() => fixture.detectChanges()).not.toThrow()
  })
})
