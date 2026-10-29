import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotificationComponent } from './notification.component'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { InboxService } from '../../../core/inbox/inbox.service'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { MatTooltipModule, MatTooltip } from '@angular/material/tooltip'
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox'
import { Overlay } from '@angular/cdk/overlay'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'

describe('NotificationComponent', () => {
  let component: NotificationComponent
  let fixture: ComponentFixture<NotificationComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatTooltipModule,
      ],
      declarations: [NotificationComponent],
      providers: [
        WINDOW_PROVIDERS,
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
    fixture = TestBed.createComponent(NotificationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  // `notificationTitle` runs for every row in the inbox, so an unguarded read
  // of a null source throws during change detection and takes the whole page
  // down with it — the global header buttons included (PD-13322).
  describe('with a notification whose source is null', () => {
    function notification(notificationType: string) {
      return {
        notificationType,
        putCode: 1,
        subject: 'A subject composed by the backend',
        source: null,
      } as any
    }

    it('falls back to the subject for an amended notification', () => {
      expect(() =>
        component.notificationTitle(notification('AMENDED'))
      ).not.toThrow()
      expect(component.notificationTitle(notification('AMENDED'))).toBe(
        'A subject composed by the backend'
      )
    })

    it('falls back to the subject for an institutional connection', () => {
      expect(() =>
        component.notificationTitle(notification('INSTITUTIONAL_CONNECTION'))
      ).not.toThrow()
      expect(
        component.notificationTitle(notification('INSTITUTIONAL_CONNECTION'))
      ).toBe('A subject composed by the backend')
    })

    it('still uses the source name when one is present', () => {
      const withSource = {
        notificationType: 'AMENDED',
        putCode: 1,
        subject: 'ignored',
        source: { sourceName: { content: 'Example University' } },
      } as any

      expect(component.notificationTitle(withSource)).toContain(
        'Example University'
      )
    })
  })
})
