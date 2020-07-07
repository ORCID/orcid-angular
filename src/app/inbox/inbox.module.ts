import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { InboxRoutingModule } from './inbox-routing.module'
import { InboxComponent } from './pages/inbox/inbox.component'
import { NotificationsComponent } from './components/notifications/notifications.component'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatIconModule } from '@angular/material/icon'
import { NotificationComponent } from './components/notification/notification.component'
import { MatButtonModule } from '@angular/material/button'
// tslint:disable-next-line: max-line-length
import { NotificationYourRecordAmendedComponent } from './components/notification-your-record-amended/notification-your-record-amended.component'
import { InfoDropDownModule } from '../cdk/info-drop-down/info-drop-down.module'
import { NotificationPermissionComponent } from './components/notification-permission/notification-permission.component'
import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { NotificationHtmlComponent } from './components/notification-html/notification-html.component'
// tslint:disable-next-line: max-line-length
import { NotificationPermissionInstitutionalConnectionComponent } from './components/notification-permission-institutional-connection/notification-permission-institutional-connection.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

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
  ],
})
export class InboxModule {}
