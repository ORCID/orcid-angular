import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatOptionModule } from '@angular/material/core'
import {
  PermissionNotificationsComponent,
  RegistryNotificationActionEvent,
  RegistryPermissionNotification,
} from '@orcid/registry-ui'
import { DocumentationPageComponent } from '../components/documentation-page/documentation-page.component'

@Component({
  selector: 'orcid-registry-permission-notifications-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    PermissionNotificationsComponent,
    DocumentationPageComponent,
  ],
  styleUrls: ['./registry-permission-notifications-page.component.scss'],
  templateUrl: './registry-permission-notifications-page.component.html',
})
export class RegistryPermissionNotificationsPageComponent {
  title = 'Unread permission notifications'
  subtitle = 'You have 3 updates waiting for your review.'
  notificationCount = 3
  lastAction?: RegistryNotificationActionEvent

  notifications: RegistryPermissionNotification[] = [
    {
      id: 'oxford',
      text: '<strong>University of Oxford</strong> wants to add information to your ORCID record',
      icon: 'work_outline',
      iconColor: 'var(--orcid-color-state-notice-dark, #ff9c00)',
      actions: [
        { id: 'read', label: 'Read', variant: 'text', underline: true },
        { id: 'connect', label: 'Connect now', variant: 'flat' },
      ],
    },
    {
      id: 'royal-society',
      text: '<strong>Royal Society</strong> wants to update your affiliation details',
      icon: 'automation',
      iconColor: 'var(--orcid-color-state-notice-dark, #ff9c00)',
      actions: [
        { id: 'read', label: 'Read', variant: 'text', underline: true },
        { id: 'connect', label: 'Connect now', variant: 'flat' },
      ],
    },
    {
      id: 'national-library',
      text: '<strong>National Library</strong> wants to add a peer review to your record',
      icon: 'auto_stories',
      iconColor: 'var(--orcid-color-state-notice-dark, #ff9c00)',
      actions: [
        { id: 'read', label: 'Read', variant: 'text', underline: true },
        { id: 'connect', label: 'Connect now', variant: 'flat' },
      ],
    },
  ]

  get visibleNotifications(): RegistryPermissionNotification[] {
    return this.notifications.slice(0, this.notificationCount)
  }

  onActionClicked(event: RegistryNotificationActionEvent) {
    this.lastAction = event
  }
}
