import { Component, EventEmitter, Input, Output } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import {
  NgClass,
  NgFor,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import {
  ActionSurfaceComponent,
  ActionSurfaceContainerComponent,
  BrandSecondaryDarkButtonDirective,
  UnderlineButtonDirective,
} from '@orcid/ui'

export type RegistryNotificationButtonVariant = 'text' | 'flat' | 'stroked'

export interface RegistryNotificationAction {
  id?: string
  label: string
  variant?: RegistryNotificationButtonVariant
  color?: 'primary' | 'accent' | 'warn'
  underline?: boolean
  disabled?: boolean
}

export interface RegistryPermissionNotification {
  id?: string
  text: string
  icon?: string
  iconColor?: string
  actions: RegistryNotificationAction[]
}

export interface RegistryNotificationActionEvent {
  notificationIndex: number
  actionIndex: number
  notificationId?: string
  actionId?: string
  action: RegistryNotificationAction
}

@Component({
  selector: 'orcid-registry-permission-notifications',
  standalone: true,
  imports: [
    NgClass,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    MatButtonModule,
    ActionSurfaceComponent,
    ActionSurfaceContainerComponent,
    BrandSecondaryDarkButtonDirective,
    UnderlineButtonDirective,
  ],
  templateUrl: './permission-notifications.component.html',
  styleUrls: ['./permission-notifications.component.scss'],
})
export class PermissionNotificationsComponent {
  @Input() title = ''
  @Input() subtitle = ''
  @Input() notifications: RegistryPermissionNotification[] = []

  @Output() actionClicked = new EventEmitter<RegistryNotificationActionEvent>()

  constructor(private _sanitizer: DomSanitizer) {}

  getTrustedHtml(text: string) {
    return this._sanitizer.bypassSecurityTrustHtml(text)
  }

  get visibleNotifications(): RegistryPermissionNotification[] {
    return (this.notifications || []).slice(0, 3)
  }

  onActionClick(
    notification: RegistryPermissionNotification,
    notificationIndex: number,
    action: RegistryNotificationAction,
    actionIndex: number
  ): void {
    this.actionClicked.emit({
      notificationIndex,
      actionIndex,
      notificationId: notification.id,
      actionId: action.id,
      action,
    })
  }
}
