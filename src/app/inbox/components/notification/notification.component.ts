import {
  Component,
  OnInit,
  HostBinding,
  Input,
  Inject,
  LOCALE_ID,
  ChangeDetectorRef,
  NgZone,
  ViewChild,
  ElementRef,
  AfterViewInit,
  forwardRef,
} from '@angular/core'
import { InboxNotification } from 'src/app/types/notifications.endpoint'
import { uiNotificationType } from 'src/app/types/notifications.local'
import { PlatformInfoService, PlatformInfo } from 'src/app/cdk/platform-info'
import { InboxService } from 'src/app/core/inbox/inbox.service'
import { FocusMonitor } from '@angular/cdk/a11y'
import { heightAnimation } from 'src/app/animations'
import {
  ControlValueAccessor,
  UntypedFormGroup,
  UntypedFormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms'

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: [
    './notification.component.scss',
    './notification.component.scss-theme.scss',
  ],
  animations: heightAnimation,

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NotificationComponent),
      multi: true,
    },
  ],
})
export class NotificationComponent
  implements OnInit, AfterViewInit, ControlValueAccessor
{
  state = 'close'
  @ViewChild('header') header: ElementRef<HTMLElement>
  @HostBinding('class.archived') _archived = false
  @HostBinding('class.read') _read = false
  @HostBinding('class.green') green = false
  @HostBinding('class.orange') orange = true
  @HostBinding('class.blue') blue = false

  _notification: InboxNotification
  notificationLabel: string
  notificationType: uiNotificationType
  platform: PlatformInfo
  public onTouchedFunction
  displayCheckBox = false

  ariaLabelArchived = $localize`:@@inbox.archive:archive`

  form: UntypedFormGroup
  @HostBinding('class.mat-elevation-z2') showNotificationContent = false

  @Input()
  set archived(value) {
    this._archived = value
  }
  get archived() {
    return this._archived
  }
  @Input()
  set read(value) {
    this._read = value
  }
  get read() {
    return this._read
  }
  @Input()
  set notification(notification: InboxNotification) {
    this._notification = notification
    this.notificationType = this.getNotificationType(notification)
    this.setNotificationColor(this.notificationType)
  }
  get notification() {
    return this._notification
  }

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private _platform: PlatformInfoService,
    private _inbox: InboxService,
    private _focusMonitor: FocusMonitor,
    private _cdr: ChangeDetectorRef,
    private _ngZone: NgZone
  ) {
    _platform.get().subscribe((value) => (this.platform = value))
    this.form = new UntypedFormGroup({
      selected: new UntypedFormControl(false, Validators.required),
    })
  }

  notificationTypeLabel(notificationType: uiNotificationType) {
    switch (notificationType) {
      case 'your-record':
        return $localize`:@@inbox.yourRecord:YOUR RECORD`
      case 'permission':
        return $localize`:@@inbox.permissions:PERMISSIONS`
      default:
        return $localize`:@@inbox.announcement:ANNOUNCEMENT`
    }
  }

  getNotificationType(notification: InboxNotification): uiNotificationType {
    switch (notification.notificationType) {
      case 'AMENDED':
        return 'your-record'
      case 'ADMINISTRATIVE':
        return 'your-record'
      case 'PERMISSION':
        return 'permission'
      case 'INSTITUTIONAL_CONNECTION':
        return 'permission'
      default:
        return 'announcement'
    }
  }

  notificationTitle(notification: InboxNotification) {
    switch (notification?.notificationType) {
      case 'AMENDED':
        return `${
          notification.source.sourceName.content
        } ${$localize`:@@inbox.hadMadeChanges:has made changes to your ORCID record`}`
      case 'INSTITUTIONAL_CONNECTION':
        return `${$localize`:@@inbox.connectingYour:Connecting your`} ${
          notification.source.sourceName.content
        } ${$localize`:@@inbox.accountWithYourOrcid:account with your ORCID record`}`

      case 'PERMISSION':
        // The subject of the permission request is define by the member with the API
        return `${notification.subject}`
      default:
        // any subject for HTML notifications define on the backend is define on the backend
        return `${notification?.subject}`
    }
  }

  notificationDate(notification: InboxNotification) {
    const date = new Date(notification?.createdDate)
    return date.toLocaleDateString('en-ZA', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })
  }

  setNotificationColor(type: uiNotificationType) {
    this.blue = false
    this.orange = false
    this.green = false
    switch (type) {
      case 'your-record':
        this.green = true
        break
      case 'permission':
        this.orange = true
        break
      case 'announcement':
        this.blue = true
        break
    }
  }

  toggleNotificationContent() {
    this.state = !this.showNotificationContent ? 'open' : 'close'
    if (this.state === 'open' && !this.notification.readDate) {
      this._inbox
        .flagAsRead(this.notification.putCode)
        .subscribe(
          () => (this.showNotificationContent = !this.showNotificationContent)
        )
    } else {
      this.showNotificationContent = !this.showNotificationContent
    }
  }

  archive() {
    this._inbox.flagAsArchive(this.notification.putCode).subscribe()
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this._focusMonitor.monitor(this.header).subscribe((origin) =>
      this._ngZone.run(() => {
        this._cdr.markForCheck()
      })
    )
  }

  writeValue(obj: any): void {
    if (obj != null && obj !== undefined && obj !== '') {
      this.displayCheckBox = true
      this.form.setValue({ selected: obj }, { emitEvent: false })
    }
  }
  registerOnChange(fn: any): void {
    this.form.valueChanges.subscribe((value) => {
      fn(value.selected)
    })
  }
  registerOnTouched(fn: any): void {
    this.onTouchedFunction = fn
  }
}
