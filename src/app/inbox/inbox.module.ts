import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { InfoDropDownModule } from '../cdk/info-drop-down/info-drop-down.module'
import { SideBarModule } from '../cdk/side-bar/side-bar.module'
import { SharedModule } from '../shared/shared.module'
import { NotificationHtmlComponent } from './components/notification-html/notification-html.component'
// tslint:disable-next-line: max-line-length
import { NotificationPermissionInstitutionalConnectionComponent } from './components/notification-permission-institutional-connection/notification-permission-institutional-connection.component'
import { NotificationPermissionComponent } from './components/notification-permission/notification-permission.component'
// tslint:disable-next-line: max-line-length
import { NotificationYourRecordAmendedComponent } from './components/notification-your-record-amended/notification-your-record-amended.component'
import { NotificationComponent } from './components/notification/notification.component'
import { NotificationsComponent } from './components/notifications/notifications.component'
import { InboxRoutingModule } from './inbox-routing.module'
import { InboxComponent } from './pages/inbox/inbox.component'
@NgModule({
  declarations: [
    InboxComponent,
    NotificationsComponent,
    NotificationComponent,
    NotificationYourRecordAmendedComponent,
    NotificationPermissionComponent,
    NotificationHtmlComponent,
    NotificationPermissionInstitutionalConnectionComponent,
  ],
  imports: [
    CommonModule,
    InboxRoutingModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    InfoDropDownModule,
    A11yLinkModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressBarModule,
    MatTooltipModule,
    SharedModule,
    SideBarModule,
  ],
})
export class InboxModule {}
