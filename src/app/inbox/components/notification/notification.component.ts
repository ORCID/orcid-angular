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
} from '@angular/core'
import { InboxNotification } from 'src/app/types/notifications.endpoint'
import { DateAdapter } from '@angular/material/core'
import { uiNotificationType } from 'src/app/types/notifications.local'
import { PlatformInfoService, PlatformInfo } from 'src/app/cdk/platform-info'
import { InboxService } from 'src/app/core/inbox/inbox.service'
import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y'
import { trigger, transition, animate, style } from '@angular/animations'
import { heightAnimation } from 'src/app/animations'
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: [
    './notification.component.scss',
    './notification.component.scss-theme.scss',
  ],
  animations: heightAnimation,
})
export class NotificationComponent implements OnInit, AfterViewInit {
  state = 'close'
  @ViewChild('header') header: ElementRef<HTMLElement>
  @HostBinding('class.archived') archived = false
  @HostBinding('class.green') green = false
  @HostBinding('class.orange') orange = true
  @HostBinding('class.blue') blue = false

  _notification: InboxNotification
  notificationLabel: string
  notificationType: uiNotificationType
  platform: PlatformInfo
  @HostBinding('class.mat-elevation-z2') showNotificationContent = false

  @Input()
  set notification(notification: InboxNotification) {
    this._notification = notification
    this.notificationType = this.getNotificationType(notification)
    this.setNotificationColor(this.notificationType)
    this.archived = !!notification.archivedDate
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
  }

  notificationTypeLabel(notificationType: uiNotificationType) {
    switch (notificationType) {
      case 'your-record':
        return 'YOUR RECORD'
      case 'permission':
        return 'PERMISSIONS'
      default:
        return 'ANNOUNCEMENT'
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
    switch (notification.notificationType) {
      case 'AMENDED':
        return `${notification.source.sourceName.content} has made changes to your ORCID record`
      case 'ADMINISTRATIVE':
        return `${notification.subject}`
      case 'PERMISSION':
        return `${notification.subject}`
      case 'INSTITUTIONAL_CONNECTION':
        return `Connecting an ${notification.source.sourceName.content} account with your ORCID record`
      default:
        return 'DEFINE'
    }
  }

  notificationDate(notification: InboxNotification) {
    const date = new Date(notification.createdDate)
    return date.toLocaleDateString(this.locale)
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
    this.showNotificationContent = !this.showNotificationContent
    this.state = this.showNotificationContent ? 'open' : 'close'
  }

  archive() {
    this._inbox.archive(this.notification.putCode).subscribe()
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    console.log(this.header)
    this._focusMonitor.monitor(this.header).subscribe((origin) =>
      this._ngZone.run(() => {
        console.log(origin)
        this._cdr.markForCheck()
      })
    )
  }
}
